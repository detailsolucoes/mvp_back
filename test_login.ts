import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente se existirem
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anon';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🚀 Iniciando teste de login...');
  console.log(`🔗 URL: ${supabaseUrl}`);

  // Tenta fazer login com as credenciais padrão do script de criação
  const email = 'admin@detailsolucoes.com';
  const password = '12345678';

  console.log(`📧 Testando com: ${email}`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ Erro no login:', error.message);
    if (error.message.includes('Invalid login credentials')) {
      console.log('💡 Dica: Certifique-se de que você executou o script SQL no painel do Supabase primeiro.');
    }
  } else {
    console.log('✅ Login bem-sucedido!');
    console.log('👤 Usuário ID:', data.user?.id);
    console.log('🔑 Sessão ativa:', !!data.session);
    
    // Testa busca de perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();
      
    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError.message);
    } else {
      console.log('📋 Perfil encontrado:', profile.name, `(${profile.role})`);
    }
  }
}

testLogin();
