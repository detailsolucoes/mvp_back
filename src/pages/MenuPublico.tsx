import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

function formatWhatsAppMessage(productName: string, price: number) {
  const message = `Olá! Gostaria de pedir:\n\n*${productName}* - R$ ${price.toFixed(2).replace('.', ',')}\n\nPode confirmar?`;
  return encodeURIComponent(message);
}

export default function MenuPublico() {
  // In a real scenario, companyId would come from the URL or a subdomain
  const companyId = 'company-001'; 

  const { data: company } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('company_id', companyId)
        .eq('active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', companyId)
        .eq('active', true);
      if (error) throw error;
      return data;
    }
  });

  const handleOrder = (productName: string, price: number) => {
    const whatsapp = company?.whatsapp || '5511999887766';
    const message = formatWhatsAppMessage(productName, price);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center">
          <img src={company?.logo_url || logo} alt={company?.name || "Detail Soluções"} className="h-10 w-auto" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Menu className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">Cardápio Digital</h1>
          </div>
          <p className="text-muted-foreground">Escolha seus produtos e peça via WhatsApp</p>
        </div>

        {/* Categories Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category: any) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="px-4 py-2 bg-muted rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              {category.name}
            </a>
          ))}
        </div>

        {/* Products by Category */}
        {categories.map((category: any) => {
          const categoryProducts = products.filter((p: any) => p.category_id === category.id);
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="mb-10">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gradient-text">
                {category.name}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {categoryProducts.map((product: any) => (
                  <Card key={product.id} className="gradient-border-card overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold">{product.name}</h3>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <span className="text-lg font-bold text-primary ml-4">
                          R$ {Number(product.price).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={() => handleOrder(product.name, product.price)}
                      >
                        Pedir via WhatsApp
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border mt-8">
          <p className="text-sm text-muted-foreground">
            Horário: {company?.opening_hours || "Seg-Sex: 18h-23h | Sáb-Dom: 17h-00h"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Taxa de entrega: R$ {Number(company?.delivery_fee || 0).toFixed(2).replace('.', ',')} | Pedido mínimo: R$ {Number(company?.min_order_value || 0).toFixed(2).replace('.', ',')}
          </p>
        </footer>
      </div>
    </div>
  );
}
