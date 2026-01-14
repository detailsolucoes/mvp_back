-- SCRIPT DE RESET FORÇADO DE SENHA
-- Execute este script no SQL Editor do Supabase para garantir o acesso

DO $$
DECLARE
  target_email TEXT := 'suporte.detail@gmail.com';
  new_password TEXT := 'suporte123'; -- Defina aqui a senha que você deseja usar
BEGIN
  -- 1. Atualiza a senha na tabela de autenticação do Supabase
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_password, gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now(),
    last_sign_in_at = NULL -- Força uma nova sessão limpa
  WHERE email = target_email;

  -- 2. Garante que o perfil existe e tem a role correta
  UPDATE public.profiles
  SET role = 'super_admin'
  WHERE id = (SELECT id FROM auth.users WHERE email = target_email);

  RAISE NOTICE 'Senha para % resetada com sucesso para: %', target_email, new_password;
END $$;
