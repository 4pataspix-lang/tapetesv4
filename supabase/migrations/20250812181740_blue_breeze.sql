/*
  # Refazer sistema de configurações da loja

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
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS na tabela `store_settings`
    - Políticas para leitura pública e escrita apenas para admins

  3. Dados Iniciais
    - Inserir configurações padrão
*/

-- Remover tabela existente se houver
DROP TABLE IF EXISTS store_settings;

-- Criar nova tabela de configurações
CREATE TABLE store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL DEFAULT 'TechStore',
  store_description text NOT NULL DEFAULT 'Os melhores produtos com qualidade garantida',
  logo_url text DEFAULT '',
  banner_url text DEFAULT '',
  primary_color text NOT NULL DEFAULT '#3b82f6',
  secondary_color text NOT NULL DEFAULT '#10b981',
  currency text NOT NULL DEFAULT 'BRL',
  language text NOT NULL DEFAULT 'pt-BR',
  enable_reviews boolean NOT NULL DEFAULT true,
  enable_notifications boolean NOT NULL DEFAULT true,
  maintenance_mode boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública
CREATE POLICY "Qualquer um pode ler configurações da loja"
  ON store_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Política para admins gerenciarem configurações
CREATE POLICY "Admins podem gerenciar configurações da loja"
  ON store_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Inserir configurações padrão
INSERT INTO store_settings (
  store_name,
  store_description,
  logo_url,
  banner_url,
  primary_color,
  secondary_color,
  currency,
  language,
  enable_reviews,
  enable_notifications,
  maintenance_mode
) VALUES (
  'TechStore',
  'Os melhores produtos com qualidade garantida',
  '',
  '',
  '#3b82f6',
  '#10b981',
  'BRL',
  'pt-BR',
  true,
  true,
  false
);