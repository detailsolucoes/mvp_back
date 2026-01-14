-- Script para criar o Super Admin: suporte.detail@gmail.com
-- Execute este script no SQL Editor do Supabase

DO $$
DECLARE
  new_user_id UUID;
  target_email TEXT := 'suporte.detail@gmail.com';
  target_password TEXT := 'suporte123'; -- Você pode alterar esta senha aqui
BEGIN
  -- 1. Verifica se o usuário já existe na tabela de autenticação
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = target_email) THEN
    
    -- 2. Insere o usuário na tabela auth.users
    INSERT INTO auth.users (
      email, 
      encrypted_password, 
      email_confirmed_at, 
      raw_user_meta_data, 
      raw_app_meta_data, 
      aud, 
      role,
      created_at,
      updated_at,
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
      now(),
      now(),
      '00000000-0000-0000-0000-000000000000'
    )
    RETURNING id INTO new_user_id;

    -- 3. Cria o perfil na tabela pública como admin
    INSERT INTO public.profiles (id, name, role, created_at)
    VALUES (new_user_id, 'Suporte Detail', 'admin', now());
    
    RAISE NOTICE 'Usuário Super Admin (%) criado com sucesso!', target_email;
  ELSE
    -- Se o usuário já existe, apenas garante que ele seja admin no perfil
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id = (SELECT id FROM auth.users WHERE email = target_email);
    
    RAISE NOTICE 'Usuário % já existia. Perfil atualizado para admin.', target_email;
  END IF;
END $$;
