import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Customer } from '@/types';
import { toast } from '@/hooks/use-toast';

// Esquema de validação com Zod para clientes
const customerFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z.string().regex(/^\d{11}$/, 'WhatsApp inválido (ex: 11999999999)'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerFormProps {
  customer?: Customer;
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => void;
}

export function CustomerForm({ customer, onClose, onSubmit }: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name || '',
      whatsapp: customer?.whatsapp || '',
      address: customer?.address || '',
      notes: customer?.notes || '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const handleFormSubmit = async (values: CustomerFormValues) => {
    onSubmit(values);
    toast({
      title: customer ? 'Cliente atualizado!' : 'Cliente criado!',
      description: `O cliente ${values.name} foi salvo com sucesso.`,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nome</FormLabel>
              <FormControl>
                <Input id="name" placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="whatsapp">WhatsApp</FormLabel>
              <FormControl>
                <Input id="whatsapp" placeholder="11999999999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="address">Endereço</FormLabel>
              <FormControl>
                <Input id="address" placeholder="Endereço completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="notes">Observações</FormLabel>
              <FormControl>
                <Textarea id="notes" placeholder="Observações sobre o cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1" type="button">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}