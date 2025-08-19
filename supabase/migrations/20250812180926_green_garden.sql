/*
  # Criar tabela de configurações da loja

  1. Nova Tabela
    - `store_settings`
      - `id` (uuid, primary key)
      - `store_name` (text)
      - `store_description` (text)
      - `logo_url` (text)
      - `banner_url` (text)
      - `primary_color` (text)
      - `secondary_color` (text)
      - `currency` (text)
      - `language` (text)
      - `enable_reviews` (boolean)
      - `enable_notifications` (boolean)
      - `maintenance_mode` (boolean)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS na tabela `store_settings`
    - Adicionar políticas para admins gerenciarem configurações
    - Qualquer um pode ler as configurações públicas
*/

CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text DEFAULT 'TechStore',
  store_description text DEFAULT 'Os melhores produtos com qualidade garantida',
  logo_url text DEFAULT '',
  banner_url text DEFAULT '',
  primary_color text DEFAULT '#3b82f6',
  secondary_color text DEFAULT '#10b981',
  currency text DEFAULT 'BRL',
  language text DEFAULT 'pt-BR',
  enable_reviews boolean DEFAULT true,
  enable_notifications boolean DEFAULT true,
  maintenance_mode boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Política para admins gerenciarem configurações
CREATE POLICY "Admins podem gerenciar configurações"
  ON store_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- Política para qualquer um ler configurações
CREATE POLICY "Qualquer um pode ler configurações"
  ON store_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Inserir configurações padrão
INSERT INTO store_settings (store_name, store_description) 
VALUES ('TechStore', 'Os melhores produtos com qualidade garantida')
ON CONFLICT DO NOTHING;