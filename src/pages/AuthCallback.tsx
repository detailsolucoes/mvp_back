import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 1. Processa o código na URL para estabelecer a sessão
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (data.session) {
          const userId = data.session.user.id;
          
          // 2. Busca o perfil para decidir o redirecionamento
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (profileError) throw profileError;

          // 3. Redireciona baseado na role
          if (profile.role === 'super_admin') {
            navigate('/admin-global/dashboard', { replace: true });
          } else if (profile.role === 'attendant') {
            navigate('/pedidos', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          // Se não houver sessão, volta para o login
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Erro no callback de autenticação:', error);
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Autenticando...</h2>
          <p className="text-muted-foreground text-sm">Aguarde enquanto preparamos seu acesso.</p>
        </div>
      </div>
    </div>
  );
}
