-- 1. Enums
CREATE TYPE order_status AS ENUM ('recebido', 'em_preparo', 'pronto', 'entregue', 'cancelado');
CREATE TYPE payment_method AS ENUM ('pix', 'dinheiro', 'cartao', 'pendente');
CREATE TYPE user_role AS ENUM ('admin', 'attendant');

-- 2. Tables
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  opening_hours TEXT,
  logo_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'attendant',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  last_order_date TIMESTAMPTZ,
  total_spent DECIMAL(10,2) DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  extras JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  status order_status NOT NULL DEFAULT 'recebido',
  payment_method payment_method NOT NULL DEFAULT 'pendente',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  extras JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL
);

-- 3. RLS Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Companies: Users can view their own company
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (
    id IN (SELECT company_id FROM profiles WHERE profiles.id = auth.uid())
  );

-- Customers, Categories, Products, Orders, Order Items: Filter by company_id
CREATE POLICY "Company data access" ON customers
  FOR ALL USING (company_id IN (SELECT company_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Company data access" ON categories
  FOR ALL USING (company_id IN (SELECT company_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Company data access" ON products
  FOR ALL USING (company_id IN (SELECT company_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Company data access" ON orders
  FOR ALL USING (company_id IN (SELECT company_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Company data access" ON order_items
  FOR ALL USING (
    order_id IN (
      SELECT id FROM orders WHERE company_id IN (
        SELECT company_id FROM profiles WHERE profiles.id = auth.uid()
      )
    )
  );

-- Public access for Menu
CREATE POLICY "Public menu access" ON companies FOR SELECT USING (active = true);
CREATE POLICY "Public menu access" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public menu access" ON products FOR SELECT USING (active = true);

-- 4. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;

-- 5. Functions & Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
