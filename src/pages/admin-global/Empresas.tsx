import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit, ToggleRight, Plus, Key, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const empresaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  segmento: z.string().min(2, 'Segmento é obrigatório'),
  whatsapp: z.string().regex(/^\d{11}$/, 'WhatsApp inválido (11 dígitos)'),
  apiKey: z.string().min(10, 'API Key deve ter pelo menos 10 caracteres'),
});

type EmpresaFormValues = z.infer<typeof empresaSchema>;

function EmpresaForm({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: EmpresaFormValues) => void }) {
  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return 'sk_' + Array.from({ length: 24 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: { nome: '', segmento: '', whatsapp: '', apiKey: generateKey() },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem><FormLabel>Nome da Empresa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="segmento" render={({ field }) => (
          <FormItem><FormLabel>Segmento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="whatsapp" render={({ field }) => (
          <FormItem><FormLabel>WhatsApp (apenas números)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="apiKey" render={({ field }) => (
          <FormItem>
            <FormLabel>API Key</FormLabel>
            <div className="flex gap-2">
              <FormControl><Input {...field} readOnly className="bg-muted font-mono text-xs" /></FormControl>
              <Button type="button" variant="outline" size="icon" onClick={() => {
                const newKey = generateKey();
                form.setValue('apiKey', newKey);
              }} title="Gerar nova chave">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1" type="button">Cancelar</Button>
          <Button type="submit" className="flex-1">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}

import { RotateCcw } from "lucide-react";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([
    { id: "1", nome: "Detail Soluções", segmento: "Pizza", whatsapp: "11999999999", status: "Ativa", apiKey: "sk_DetailSolucoes2024Key" },
    { id: "2", nome: "Pizzaria do João", segmento: "Pizza", whatsapp: "11888888888", status: "Ativa", apiKey: "sk_PizzariaJoao8888Key" },
    { id: "3", nome: "Burger House", segmento: "Hamburger", whatsapp: "11777777777", status: "Inativa", apiKey: "sk_BurgerHouse7777Key" },
    { id: "4", nome: "Sushi Express", segmento: "Sushi", whatsapp: "11666666666", status: "Ativa", apiKey: "sk_SushiExpress6666Key" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddEmpresa = (data: EmpresaFormValues) => {
    const newEmpresa = {
      id: String(empresas.length + 1),
      ...data,
      status: "Ativa",
    };
    setEmpresas([...empresas, newEmpresa]);
    setIsDialogOpen(false);
    toast({ title: "Empresa cadastrada!", description: `${data.nome} foi adicionada com sucesso.` });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copiado!", description: "API Key copiada para a área de transferência." });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">Gerenciar todas as empresas cadastradas no sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Empresa</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>Cadastrar Nova Empresa</DialogTitle></DialogHeader>
            <EmpresaForm onClose={() => setIsDialogOpen(false)} onSubmit={handleAddEmpresa} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Buscar empresa por nome ou WhatsApp..." className="max-w-sm" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>Total: {empresas.length} empresas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold">Segmento</th>
                  <th className="text-left py-3 px-4 font-semibold">WhatsApp</th>
                  <th className="text-left py-3 px-4 font-semibold">API Key</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{empresa.nome}</td>
                    <td className="py-3 px-4">{empresa.segmento}</td>
                    <td className="py-3 px-4">{empresa.whatsapp}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-[10px] font-mono">
                          {empresa.apiKey.substring(0, 8)}...
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(empresa.apiKey, empresa.id)}
                        >
                          {copiedId === empresa.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        empresa.status === "Ativa" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>{empresa.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" title="Ver detalhes"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" title="Editar"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" title="Ativar/Inativar"><ToggleRight className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
