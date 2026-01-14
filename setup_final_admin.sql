-- SCRIPT FINAL: Ajuste de Roles e Criação de Super Admin
-- Execute este script no SQL Editor do Supabase

-- 1. Garantir que o tipo user_role existe (caso não tenha sido criado no schema inicial)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'attendant');
    END IF;
END $$;

-- 2. Criar/Atualizar o usuário Super Admin
DO $$
DECLARE
  new_user_id UUID;
  target_email TEXT := 'suporte.detail@gmail.com';
  target_password TEXT := 'suporte123'; -- Altere se desejar
BEGIN
  -- Verifica se o usuário já existe na auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = target_email) THEN
    INSERT INTO auth.users (
      email, 
      encrypted_password, 
      email_confirmed_at, 
      raw_user_meta_data, 
      raw_app_meta_data, 
      aud, 
      role,
      instance_id
    )
    VALUES (
      target_email, 
      crypt(target_password, gen_salt('bf')), 
      now(), 
      '{"name":"Suporte Detail"}', 
      '{"provider":"email","providers":["email"]}', 
      'authenticated', 
      'authenticated',
      '00000000-0000-0000-0000-000000000000'
    )
    RETURNING id INTO new_user_id;
    
    RAISE NOTICE 'Usuário auth criado com ID: %', new_user_id;
  ELSE
    SELECT id INTO new_user_id FROM auth.users WHERE email = target_email;
    RAISE NOTICE 'Usuário auth já existia com ID: %', new_user_id;
  END IF;

  -- 3. Garantir que o perfil existe e tem a role correta
  -- Usamos 'super_admin' para garantir o redirecionamento correto no frontend
  INSERT INTO public.profiles (id, name, role, created_at)
  VALUES (new_user_id, 'Suporte Detail', 'super_admin', now())
  ON CONFLICT (id) DO UPDATE 
  SET role = 'super_admin', name = 'Suporte Detail';

  RAISE NOTICE 'Perfil Super Admin configurado com sucesso!';
END $$;
