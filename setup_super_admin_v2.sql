-- SCRIPT DE CONFIGURAÇÃO DO SUPER ADMIN (V2)
-- Execute este script APÓS o full_reset_db.sql

DO $$
DECLARE
  new_user_id UUID;
  target_email TEXT := 'suport.detail@gmail.com';
  target_password TEXT := 'suporte123';
  company_id UUID;
BEGIN
  -- 1. Criar Empresa Padrão (Detail Soluções)
  INSERT INTO public.companies (name, slug)
  VALUES ('Detail Soluções', 'detail-solucoes')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO company_id;

  -- 2. Criar Usuário na Auth
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
    UPDATE auth.users SET encrypted_password = crypt(target_password, gen_salt('bf')), email_confirmed_at = now() WHERE id = new_user_id;
  END IF;

  -- 3. Criar Perfil como Super Admin
  INSERT INTO public.profiles (id, company_id, name, role)
  VALUES (new_user_id, company_id, 'Suporte Detail', 'super_admin')
  ON CONFLICT (id) DO UPDATE 
  SET role = 'super_admin', company_id = EXCLUDED.company_id;

  RAISE NOTICE 'Banco resetado e Super Admin configurado com sucesso!';
END $$;
