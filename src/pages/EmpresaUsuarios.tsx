import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockCompanies } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserForm } from '@/components/forms/UserForm';
import type { User as UserType } from '@/types';

export default function EmpresaUsuarios() {
  const { user } = useAuth();
  const company = mockCompanies.find(c => c.id === user?.companyId) || mockCompanies[0];
  
  // Mock users for the company
  const [companyUsers, setCompanyUsers] = useState<UserType[]>([
    { id: '1', name: 'Admin Teste', email: 'admin@test.com', role: 'admin', companyId: company.id, createdAt: '2023-01-01' },
    { id: '2', name: 'Atendente 1', email: 'atendente1@test.com', role: 'attendant', companyId: company.id, createdAt: '2023-01-02' },
  ]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  const handleAddUser = (userData: any) => {
    const newUser: UserType = {
      id: `user-${Date.now()}`,
      companyId: company.id,
      createdAt: new Date().toISOString().split('T')[0],
      ...userData
    };
    setCompanyUsers(prev => [...prev, newUser]);
    setIsUserDialogOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold gradient-text">Usuários da Empresa</h1>
            <p className="text-muted-foreground">Gerencie os usuários que têm acesso ao painel da sua empresa</p>
          </div>
        </div>
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            </DialogHeader>
            <UserForm onClose={() => setIsUserDialogOpen(false)} onSubmit={handleAddUser} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="gradient-border-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Lista de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">{u.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {u.email}
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <Shield className="h-3.5 w-3.5" /> {u.role === 'admin' ? 'Administrador' : 'Atendente'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remover</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
