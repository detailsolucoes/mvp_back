-- SCRIPT DE RESET TOTAL E CONFIGURAÇÃO DO BANCO DE DADOS
-- Este script remove tudo e recria a estrutura compatível com o Frontend e Integrações (n8n/Chat)

-- 1. LIMPEZA TOTAL (CUIDADO: Isso apaga todos os dados!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- 2. EXTENSÕES E TIPOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'attendant');
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'debit_card', 'cash');
CREATE TYPE message_sender AS ENUM ('customer', 'business');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- 3. TABELAS PRINCIPAIS

-- Empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Perfis de Usuário
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Clientes
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Categorias de Produtos
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  name TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method,
  notes TEXT,
  source TEXT DEFAULT 'web', -- 'web', 'whatsapp', 'n8n'
  external_id TEXT, -- ID do n8n ou sistema externo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Itens do Pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Conversas (Chat)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, customer_id)
);

-- Mensagens (Chat)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender message_sender NOT NULL,
  text TEXT NOT NULL,
  status message_status DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. SEGURANÇA (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas de exemplo (Simplificadas para o MVP)
CREATE POLICY "Users can see their own company data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Company data access" ON companies FOR ALL USING (id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Company customers access" ON customers FOR ALL USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Company products access" ON products FOR ALL USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Company orders access" ON orders FOR ALL USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Company chat access" ON conversations FOR ALL USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Company messages access" ON messages FOR ALL USING (conversation_id IN (SELECT id FROM conversations WHERE company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())));

-- 5. REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- 6. DADOS INICIAIS (SUPER ADMIN)
-- Execute o script de criação de super admin após este reset.
