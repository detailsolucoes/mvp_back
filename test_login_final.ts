import { createClient } from '@supabase/supabase-js';

// Nota: Como não tenho as chaves reais, este script serve para você validar no seu ambiente.
// Substitua as strings abaixo pelas suas chaves reais do Supabase.
const supabaseUrl = 'SUA_URL_DO_SUPABASE';
const supabaseAnonKey = 'SUA_ANON_KEY_DO_SUPABASE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFinalLogin() {
  console.log('🧪 Testando login final para: suporte.detail@gmail.com');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'suporte.detail@gmail.com',
    password: 'suporte123',
  });

  if (error) {
    console.log('❌ Falha no login (esperado se as chaves não forem fornecidas):', error.message);
  } else {
    console.log('✅ Login realizado com sucesso!');
    console.log('🆔 User ID:', data.user?.id);
  }
}

testFinalLogin();
