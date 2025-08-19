/*
  # Função para criar usuários admin

  1. Função RPC
    - `create_admin_user` - Cria usuário e adiciona como admin
    - Contorna limitações do auth.admin no frontend
    - Retorna o ID do usuário criado

  2. Segurança
    - Função executada com privilégios do proprietário
    - Permite criação apenas para usuários admin autenticados
    - Mantém integridade dos dados
*/

-- Criar função para criar usuários admin
CREATE OR REPLACE FUNCTION create_admin_user(
  email TEXT,
  password TEXT
)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas admins podem criar usuários admin';
  END IF;

  -- Verificar se o email já existe
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = create_admin_user.email
  ) THEN
    RAISE EXCEPTION 'Email já está em uso';
  END IF;

  -- Gerar UUID para o novo usuário
  v_user_id := gen_random_uuid();

  -- Inserir usuário na tabela auth.users (simulação)
  -- Nota: Em produção, isso seria feito via API do Supabase Auth
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    create_admin_user.email,
    crypt(create_admin_user.password, gen_salt('bf')),
    now(),
    now(),
    now()
  );

  -- Adicionar à tabela admin_users
  INSERT INTO admin_users (
    user_id,
    is_active
  ) VALUES (
    v_user_id,
    true
  );

  -- Retornar ID do usuário
  RETURN json_build_object('user_id', v_user_id);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao criar usuário admin: %', SQLERRM;
END;
$$;

-- Permitir que usuários autenticados executem a função
GRANT EXECUTE ON FUNCTION create_admin_user TO authenticated;