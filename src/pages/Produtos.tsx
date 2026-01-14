import { useState } from 'react';
import { mockProducts, mockCategories, MOCK_COMPANY_ID } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pizza } from 'lucide-react';
import type { Product } from '@/types';
import { ProductForm } from '@/components/forms/ProductForm';

export default function Produtos() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    return mockCategories.find((c) => c.id === categoryId)?.name || '-';
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedProduct(undefined);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (formData: Omit<Product, 'id' | 'companyId' | 'createdAt'>) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, ...formData } : p));
    } else {
      // Add new product
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        companyId: MOCK_COMPANY_ID,
        createdAt: new Date().toISOString().split('T')[0],
        ...formData,
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Pizza className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold gradient-text">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu cardápio</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {mockCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew}>Adicionar Produto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
              </DialogHeader>
              <ProductForm 
                product={selectedProduct} 
                categories={mockCategories} 
                onClose={() => setIsDialogOpen(false)} 
                onSubmit={handleFormSubmit} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories Summary */}
      <div className="flex flex-wrap gap-2">
        {mockCategories.map((category) => {
          const count = products.filter((p) => p.categoryId === category.id).length;
          return (
            <Button
              key={category.id}
              variant={categoryFilter === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(categoryFilter === category.id ? 'all' : category.id)}
            >
              {category.name} ({count})
            </Button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            className={`gradient-border-card ${!product.active ? 'opacity-60' : ''}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{product.name}</CardTitle>
                {!product.active && (
                  <span className="text-xs px-2 py-1 bg-muted rounded">Inativo</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.description && (
                <p className="text-sm text-muted-foreground">{product.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-muted rounded">
                  {getCategoryName(product.categoryId)}
                </span>
                <span className="text-lg font-bold text-primary">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleEdit(product)}
              >
                Editar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
}