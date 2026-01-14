-- SCRIPT CORRIGIDO: Criação de Super Admin (suport.detail@gmail.com)
-- Execute este script no SQL Editor do Supabase

DO $$
DECLARE
  new_user_id UUID;
  target_email TEXT := 'suport.detail@gmail.com';
  target_password TEXT := 'suporte123'; -- Senha padrão
BEGIN
  -- 1. Criar o usuário na auth.users se não existir
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
  ELSE
    SELECT id INTO new_user_id FROM auth.users WHERE email = target_email;
    
    -- Se já existe, apenas garante que a senha e confirmação estão ok
    UPDATE auth.users 
    SET encrypted_password = crypt(target_password, gen_salt('bf')),
        email_confirmed_at = now()
    WHERE id = new_user_id;
  END IF;

  -- 2. Garantir que o perfil existe com a role super_admin
  INSERT INTO public.profiles (id, name, role, created_at)
  VALUES (new_user_id, 'Suporte Detail', 'super_admin', now())
  ON CONFLICT (id) DO UPDATE 
  SET role = 'super_admin', name = 'Suporte Detail';

  RAISE NOTICE 'Super Admin % configurado com sucesso!', target_email;
END $$;
