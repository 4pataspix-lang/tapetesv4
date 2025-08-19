/*
  # Sistema completo de configurações da loja

  1. Nova tabela store_settings expandida
    - Informações básicas da loja
    - Configurações visuais avançadas
    - Configurações de funcionalidades
    - Configurações de SEO
    - Configurações de contato
    - Configurações de redes sociais
    - Configurações de pagamento
    - Configurações de entrega

  2. Segurança
    - RLS habilitado
    - Políticas para leitura pública e escrita admin
*/

-- Remover tabela existente se houver
DROP TABLE IF EXISTS store_settings CASCADE;

-- Criar nova tabela completa de configurações
CREATE TABLE store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  store_name text NOT NULL DEFAULT 'TechStore',
  store_description text NOT NULL DEFAULT 'Os melhores produtos com qualidade garantida',
  store_slogan text DEFAULT 'Qualidade e confiança em cada compra',
  
  -- URLs de mídia
  logo_url text DEFAULT '',
  favicon_url text DEFAULT '',
  banner_url text DEFAULT '',
  about_image_url text DEFAULT '',
  
  -- Cores e tema
  primary_color text NOT NULL DEFAULT '#3b82f6',
  secondary_color text NOT NULL DEFAULT '#10b981',
  accent_color text DEFAULT '#f59e0b',
  background_color text DEFAULT '#f9fafb',
  text_color text DEFAULT '#111827',
  
  -- Tipografia
  font_family text DEFAULT 'Roboto',
  heading_font text DEFAULT 'Roboto',
  
  -- Configurações regionais
  currency text NOT NULL DEFAULT 'BRL',
  currency_symbol text DEFAULT 'R$',
  language text NOT NULL DEFAULT 'pt-BR',
  timezone text DEFAULT 'America/Sao_Paulo',
  
  -- Funcionalidades
  enable_reviews boolean NOT NULL DEFAULT true,
  enable_notifications boolean NOT NULL DEFAULT true,
  enable_wishlist boolean DEFAULT true,
  enable_compare boolean DEFAULT true,
  enable_chat boolean DEFAULT false,
  maintenance_mode boolean NOT NULL DEFAULT false,
  
  -- SEO
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  google_analytics_id text DEFAULT '',
  facebook_pixel_id text DEFAULT '',
  
  -- Contato
  contact_email text DEFAULT '',
  contact_phone text DEFAULT '',
  contact_whatsapp text DEFAULT '',
  contact_address text DEFAULT '',
  
  -- Redes sociais
  facebook_url text DEFAULT '',
  instagram_url text DEFAULT '',
  twitter_url text DEFAULT '',
  youtube_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  tiktok_url text DEFAULT '',
  
  -- Configurações de e-commerce
  min_order_value numeric(10,2) DEFAULT 0,
  free_shipping_threshold numeric(10,2) DEFAULT 100,
  tax_rate numeric(5,2) DEFAULT 0,
  
  -- Métodos de pagamento
  enable_credit_card boolean DEFAULT true,
  enable_debit_card boolean DEFAULT true,
  enable_pix boolean DEFAULT true,
  enable_boleto boolean DEFAULT true,
  enable_paypal boolean DEFAULT false,
  
  -- Configurações de entrega
  default_shipping_cost numeric(10,2) DEFAULT 10,
  estimated_delivery_days integer DEFAULT 7,
  enable_local_pickup boolean DEFAULT false,
  
  -- Textos personalizáveis
  welcome_message text DEFAULT 'Bem-vindo à nossa loja!',
  footer_text text DEFAULT 'Todos os direitos reservados.',
  privacy_policy_url text DEFAULT '',
  terms_of_service_url text DEFAULT '',
  return_policy_text text DEFAULT '',
  
  -- Configurações de layout
  products_per_page integer DEFAULT 12,
  enable_dark_mode boolean DEFAULT false,
  header_style text DEFAULT 'default', -- default, minimal, centered
  footer_style text DEFAULT 'default', -- default, minimal, extended
  
  -- Timestamps
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

-- Política para admins gerenciarem
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
  store_slogan,
  primary_color,
  secondary_color,
  accent_color,
  welcome_message,
  footer_text
) VALUES (
  'TechStore',
  'Os melhores produtos com qualidade garantida',
  'Tecnologia que transforma sua vida',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  'Descubra produtos incríveis com a melhor qualidade do mercado!',
  '© 2024 TechStore. Todos os direitos reservados.'
);