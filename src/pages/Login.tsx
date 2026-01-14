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
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
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

  const onForgotPasswordSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSendingReset(false);
    if (error) {
      toast({
        title: 'Erro ao enviar e-mail',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      setIsForgotPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="gradient-border-card shadow-xl">
          <CardHeader className="text-center space-y-4">
            <motion.img 
              src={logo} 
              alt="Detail Soluções" 
              className="h-20 w-auto mx-auto rounded-xl shadow-sm"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <AnimatePresence mode="wait">
              {!isForgotPassword ? (
                <motion.div
                  key="login-header"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
                  <CardDescription>Acesse sua conta para gerenciar seus pedidos</CardDescription>
                </motion.div>
              ) : (
                <motion.div
                  key="forgot-header"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CardTitle className="text-2xl font-bold">Recuperar senha</CardTitle>
                  <CardDescription>Enviaremos um link para o seu e-mail</CardDescription>
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!isForgotPassword ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} className="bg-muted/30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Senha</FormLabel>
                              <Button 
                                type="button" 
                                variant="link" 
                                className="px-0 font-normal text-xs"
                                onClick={() => setIsForgotPassword(true)}
                              >
                                Esqueceu a senha?
                              </Button>
                            </div>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="bg-muted/30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full h-11 font-semibold shadow-lg shadow-primary/20" 
                        disabled={loginForm.formState.isSubmitting}
                      >
                        {loginForm.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div
                  key="forgot-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Form {...forgotPasswordForm}>
                    <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={forgotPasswordForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail cadastrado</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} className="bg-muted/30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <Button 
                          type="submit" 
                          className="w-full h-11 font-semibold shadow-lg shadow-primary/20" 
                          disabled={isSendingReset}
                        >
                          {isSendingReset ? 'Enviando...' : 'Enviar link de recuperação'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="w-full"
                          onClick={() => setIsForgotPassword(false)}
                        >
                          Voltar para o login
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
