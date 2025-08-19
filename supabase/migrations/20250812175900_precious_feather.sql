/*
  # Adicionar usuário admin à tabela admin_users

  1. Inserir usuário admin
    - Busca o usuário admin@loja.com na tabela auth.users
    - Adiciona ele à tabela admin_users como ativo
  
  2. Segurança
    - Verifica se o usuário existe antes de inserir
    - Define como ativo por padrão
*/

-- Inserir o usuário admin@loja.com na tabela admin_users
INSERT INTO admin_users (user_id, is_active)
SELECT id, true
FROM auth.users 
WHERE email = 'admin@loja.com'
AND NOT EXISTS (
  SELECT 1 FROM admin_users WHERE user_id = auth.users.id
);