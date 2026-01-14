-- Script para criar o primeiro Super Admin manualmente via SQL Editor
-- Substitua 'seu-email@exemplo.com' e 'sua-senha-segura' pelos dados desejados

-- 1. Criar o usuário na tabela de autenticação do Supabase
-- Nota: O Supabase gerencia a criptografia da senha automaticamente
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@detailsolucoes.com', -- ALTERE AQUI
  crypt('12345678', gen_salt('bf')), -- ALTERE AQUI (Senha)
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Super Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
RETURNING id;

-- 2. Após executar o comando acima, copie o ID gerado e use-o no comando abaixo
-- Ou use esta versão que faz tudo automaticamente para o primeiro usuário:

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Cria o usuário se não existir
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@detailsolucoes.com') THEN
    INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role)
    VALUES (
      'admin@detailsolucoes.com', 
      crypt('12345678', gen_salt('bf')), 
      now(), 
      '{"name":"Administrador Global"}', 
      '{"provider":"email","providers":["email"]}', 
      'authenticated', 
      'authenticated'
    )
    RETURNING id INTO new_user_id;

    -- Cria o perfil como super_admin
    INSERT INTO public.profiles (id, name, role)
    VALUES (new_user_id, 'Administrador Global', 'admin');
    
    RAISE NOTICE 'Usuário Super Admin criado com sucesso! ID: %', new_user_id;
  ELSE
    RAISE NOTICE 'Usuário já existe.';
  END IF;
END $$;
