import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, RotateCcw, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserForm } from '@/components/forms/UserForm';
import { toast } from '@/hooks/use-toast';
import { mockCompanies } from '@/data/mockData';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: "1", nome: "Super Admin", email: "admin@detailsolucoes.com", role: "super_admin", empresa: "Sistema", status: "Ativo" },
    { id: "2", nome: "Empresa 1 Admin", email: "empresa1@test.com", role: "admin", empresa: "Detail Soluções", status: "Ativo" },
    { id: "3", nome: "Empresa 2 Admin", email: "empresa2@test.com", role: "admin", empresa: "Pizzaria do João", status: "Ativo" },
    { id: "4", nome: "Atendente 1", email: "atendente1@detail.com", role: "attendant", empresa: "Detail Soluções", status: "Bloqueado" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddUser = (data: any) => {
    const companyName = data.role === 'super_admin' 
      ? "Sistema" 
      : mockCompanies.find(c => c.id === data.companyId)?.name || "Manual";

    const newUser = {
      id: String(usuarios.length + 1),
      nome: data.name,
      email: data.email,
      role: data.role,
      empresa: companyName,
      status: "Ativo"
    };
    
    setUsuarios([...usuarios, newUser]);
    setIsDialogOpen(false);
    toast({ title: "Usuário criado!", description: `${data.name} foi adicionado com sucesso.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários Globais</h1>
          <p className="text-muted-foreground">Gerenciar todos os usuários do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Usuário</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>Cadastrar Novo Usuário Global</DialogTitle></DialogHeader>
            <UserForm 
              onClose={() => setIsDialogOpen(false)} 
              onSubmit={handleAddUser}
              companies={mockCompanies}
              showCompanySelect={true}
              showSuperAdminOption={true}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Buscar por nome ou email..." className="max-w-sm" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Total: {usuarios.length} usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{usuario.nome}</td>
                    <td className="py-3 px-4">{usuario.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        usuario.role === 'super_admin' 
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}>
                        {usuario.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">{usuario.empresa}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        usuario.status === "Ativo" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>{usuario.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm"><Lock className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><RotateCcw className="h-4 w-4" /></Button>
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
