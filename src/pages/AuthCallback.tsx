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
        // 1. Tenta obter a sessão atual (o Supabase processa o hash da URL automaticamente)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        // Verifica se há indicação de convite na URL (hash ou query)
        const isInvite = window.location.hash.includes('type=invite') || 
                         window.location.search.includes('type=invite') ||
                         window.location.hash.includes('type=recovery') ||
                         window.location.search.includes('type=recovery');

        if (session) {
          const userId = session.user.id;
          
          // Busca o perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          // Se for um convite ou se o perfil não tiver nome, vai para completar cadastro
          if (isInvite || !profile?.name) {
            navigate('/complete-signup', { replace: true });
            return;
          }

          // Redirecionamento padrão por role
          if (profile.role === 'super_admin') {
            navigate('/admin-global/dashboard', { replace: true });
          } else if (profile.role === 'attendant') {
            navigate('/pedidos', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          // Se não houver sessão mas for um link de auth, aguarda um pouco ou vai para login
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error('Erro no callback:', error);
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
