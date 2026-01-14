import { mockProducts, mockCategories } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

function formatWhatsAppMessage(productName: string, price: number) {
  const message = `Olá! Gostaria de pedir:\n\n*${productName}* - R$ ${price.toFixed(2).replace('.', ',')}\n\nPode confirmar?`;
  return encodeURIComponent(message);
}

export default function MenuPublico() {
  const activeProducts = mockProducts.filter(p => p.active);
  const activeCategories = mockCategories.filter(c => c.active);

  const handleOrder = (productName: string, price: number, whatsapp: string = '5511999887766') => {
    const message = formatWhatsAppMessage(productName, price);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center">
          <img src={logo} alt="Detail Soluções" className="h-10 w-auto" />
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
          {activeCategories.map(category => (
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
        {activeCategories.map(category => {
          const categoryProducts = activeProducts.filter(p => p.categoryId === category.id);
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="mb-10">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gradient-text">
                {category.name}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {categoryProducts.map(product => (
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
                          R$ {product.price.toFixed(2).replace('.', ',')}
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
            Horário: Seg-Sex: 18h-23h | Sáb-Dom: 17h-00h
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Taxa de entrega: R$ 8,00 | Pedido mínimo: R$ 25,00
          </p>
        </footer>
      </div>
    </div>
  );
}