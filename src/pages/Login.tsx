import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.jpeg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Crown, Building2, ArrowRight, UserCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface UserPreset {
  name: string;
  email: string;
  password: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const userPresets: UserPreset[] = [
  {
    name: 'Administrador Global',
    email: 'admin@detailsolucoes.com',
    password: '123456',
    role: 'super_admin',
    description: 'Acesso total ao sistema e gerenciamento de todas as empresas',
    icon: <Crown className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Empresa - Detail Soluções',
    email: 'empresa1@test.com',
    password: '123456',
    role: 'admin',
    description: 'Acesso ao painel da empresa com personalização de logo e nome',
    icon: <Building2 className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Atendente - Detail Soluções',
    email: 'atendente@test.com',
    password: '123456',
    role: 'attendant',
    description: 'Acesso operacional para atendimento e gestão de pedidos',
    icon: <UserCircle className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-500',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [selectedPreset, setSelectedPreset] = useState<UserPreset | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: selectedPreset?.email || '',
      password: selectedPreset?.password || '',
    },
  });

  const { handleSubmit, formState: { isSubmitting }, setValue } = form;

  const handlePresetSelect = (preset: UserPreset) => {
    setSelectedPreset(preset);
    setValue('email', preset.email);
    setValue('password', preset.password);
  };

  const onSubmit = async (values: LoginFormValues) => {
    const success = await login(values.email, values.password);

    if (success) {
      toast({
        title: 'Login bem-sucedido!',
        description: 'Redirecionando para o dashboard.',
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: 'Erro de Login',
        description: 'E-mail ou senha inválidos.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-4xl"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Painel de Seleção de Usuários */}
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold gradient-text mb-2">Escolha o tipo de acesso</h2>
              <p className="text-muted-foreground">Selecione um dos usuários de teste para explorar o sistema</p>
            </div>

            <div className="space-y-3">
              {userPresets.map((preset, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePresetSelect(preset)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPreset?.email === preset.email
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`bg-gradient-to-br ${preset.color} p-2 rounded-lg text-white mt-1`}>
                        {preset.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{preset.name}</h3>
                        <p className="text-sm text-muted-foreground">{preset.description}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-mono text-muted-foreground">
                            <span className="text-primary">Email:</span> {preset.email}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground">
                            <span className="text-primary">Senha:</span> {preset.password}
                          </p>
                        </div>
                      </div>
                    </div>
                    {selectedPreset?.email === preset.email && (
                      <ArrowRight className="w-5 h-5 text-primary mt-1" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Formulário de Login */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="gradient-border-card h-full flex flex-col">
              <CardHeader className="text-center space-y-4">
                <motion.img 
                  src={logo} 
                  alt="Detail Soluções" 
                  className="h-16 w-auto mx-auto rounded-lg"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                />
                <div>
                  <CardTitle className="text-xl">Acesse sua conta</CardTitle>
                  {selectedPreset && (
                    <CardDescription className="mt-2">
                      Entrando como <span className="font-semibold text-foreground">{selectedPreset.name}</span>
                    </CardDescription>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              placeholder="seu@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">Senha</FormLabel>
                          <FormControl>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting || !selectedPreset}
                    >
                      {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground border border-muted">
                  <p className="font-medium mb-2 text-foreground">💡 Dica:</p>
                  <p>Selecione um dos usuários à esquerda para testar as diferentes visualizações do sistema.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
