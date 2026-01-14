import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { mockCustomers, mockProducts, MOCK_COMPANY_ID } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import type { Order, OrderItem } from '@/types';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Selecione um produto'),
  quantity: z.number().min(1, 'Mínimo 1'),
});

const orderFormSchema = z.object({
  customerId: z.string().min(1, 'Selecione um cliente'),
  items: z.array(orderItemSchema).min(1, 'Adicione pelo menos um item'),
  paymentMethod: z.enum(['pix', 'dinheiro', 'cartao', 'pendente']),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  onClose: () => void;
  onSubmit: (order: Order) => void;
}

export function OrderForm({ onClose, onSubmit }: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: '',
      items: [{ productId: '', quantity: 1 }],
      paymentMethod: 'pix',
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const handleFormSubmit = (values: OrderFormValues) => {
    const customer = mockCustomers.find(c => c.id === values.customerId);
    if (!customer) return;

    const orderItems: OrderItem[] = values.items.map((item, index) => {
      const product = mockProducts.find(p => p.id === item.productId);
      return {
        id: `item-${Date.now()}-${index}`,
        productId: item.productId,
        productName: product?.name || 'Produto',
        quantity: item.quantity,
        unitPrice: product?.price || 0,
        subtotal: (product?.price || 0) * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
    const deliveryFee = 8.00; // Mock delivery fee

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      companyId: MOCK_COMPANY_ID,
      customerId: customer.id,
      customerName: customer.name,
      customerWhatsapp: customer.whatsapp,
      items: orderItems,
      total: subtotal + deliveryFee,
      deliveryFee,
      status: 'recebido',
      paymentMethod: values.paymentMethod,
      notes: values.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newOrder);
    toast({
      title: 'Pedido criado!',
      description: `Pedido para ${customer.name} criado com sucesso.`,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockCustomers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Itens do Pedido</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name={`items.${index}.productId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Produto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockProducts.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-20">
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={() => append({ productId: '', quantity: 1 })}
          >
            <Plus className="h-4 w-4" /> Adicionar Item
          </Button>
        </div>

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: Sem cebola, troco para R$ 50..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1" type="button">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1">
            Criar Pedido
          </Button>
        </div>
      </form>
    </Form>
  );
}
