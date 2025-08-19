/*
  # Corrigir função de criação de usuário admin

  1. Função Corrigida
    - Remove referência ambígua à coluna "email"
    - Usa aliases corretos para as tabelas
    - Melhora o tratamento de erros
*/

-- Remover função existente se houver
DROP FUNCTION IF EXISTS create_admin_user(text, text);

-- Criar função corrigida para criar usuário admin
CREATE OR REPLACE FUNCTION create_admin_user(
  p_email text,
  p_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  admin_record record;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.user_id = auth.uid() 
    AND au.is_active = true
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem criar novos admins';
  END IF;

  -- Verificar se o email já existe
  IF EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.email = p_email
  ) THEN
    RAISE EXCEPTION 'Email já está em uso';
  END IF;

  -- Criar usuário usando auth.users diretamente
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Criar registro na tabela admin_users
  INSERT INTO admin_users (user_id, is_active)
  VALUES (new_user_id, true);

  -- Retornar sucesso
  RETURN json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'Usuário admin criado com sucesso'
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Retornar erro
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;