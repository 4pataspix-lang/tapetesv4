/*
  # Adicionar colunas faltantes na tabela store_settings

  1. Novas Colunas
    - Cores de botões (primary, secondary, success, danger)
    - Cores de textos específicos (títulos, descrições, preços)
    - Cores de ícones específicos (carrinho, estrelas, busca, etc.)
    - Textos personalizáveis de botões
    - Efeitos visuais (sombras, bordas, animações)
    - Cores de fundo específicas
    - Tipografia específica
    - Espaçamentos e animações
    - Cores de status
    - Textos de mensagens
    - Cores de navegação

  2. Observações
    - Todas as colunas têm valores padrão apropriados
    - Compatível com o sistema de configurações existente
*/

-- Cores de botões
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_primary_bg_color text DEFAULT '#3b82f6';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_primary_text_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_primary_hover_bg_color text DEFAULT '#2563eb';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_primary_hover_text_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_secondary_bg_color text DEFAULT '#6b7280';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_secondary_text_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_secondary_hover_bg_color text DEFAULT '#4b5563';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_secondary_hover_text_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_success_bg_color text DEFAULT '#10b981';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_success_text_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_success_hover_bg_color text DEFAULT '#059669';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_success_hover_text_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_danger_bg_color text DEFAULT '#ef4444';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_danger_text_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_danger_hover_bg_color text DEFAULT '#dc2626';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_danger_hover_text_color text DEFAULT '#ffffff';

-- Cores de textos específicos
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_title_color text DEFAULT '#111827';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_description_color text DEFAULT '#6b7280';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_price_color text DEFAULT '#3b82f6';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS header_text_color text DEFAULT '#111827';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS footer_text_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS link_color text DEFAULT '#3b82f6';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS link_hover_color text DEFAULT '#2563eb';

-- Cores de ícones específicos
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS cart_icon_color text DEFAULT '#3b82f6';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS star_icon_color text DEFAULT '#fbbf24';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS search_icon_color text DEFAULT '#6b7280';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS menu_icon_color text DEFAULT '#374151';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS social_icon_color text DEFAULT '#6b7280';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS social_icon_hover_color text DEFAULT '#3b82f6';

-- Textos personalizáveis de botões
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_add_to_cart_text text DEFAULT 'Adicionar ao Carrinho';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_buy_now_text text DEFAULT 'Comprar Agora';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_view_product_text text DEFAULT 'Ver Produto';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_continue_shopping_text text DEFAULT 'Continuar Comprando';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_checkout_text text DEFAULT 'Finalizar Pedido';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_view_cart_text text DEFAULT 'Ver Carrinho';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_search_text text DEFAULT 'Buscar';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_filter_text text DEFAULT 'Filtrar';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_clear_filters_text text DEFAULT 'Limpar Filtros';

-- Efeitos visuais
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS card_shadow_color text DEFAULT 'rgba(0, 0, 0, 0.1)';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS card_shadow_hover_color text DEFAULT 'rgba(0, 0, 0, 0.15)';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS card_border_radius text DEFAULT '8px';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_border_radius text DEFAULT '6px';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS input_border_radius text DEFAULT '6px';

-- Cores de bordas
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS card_border_color text DEFAULT '#e5e7eb';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS input_border_color text DEFAULT '#d1d5db';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS input_focus_border_color text DEFAULT '#3b82f6';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_border_color text DEFAULT 'transparent';

-- Cores de fundo específicas
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS card_background_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS input_background_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS header_background_color text DEFAULT '#ffffff';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS footer_background_color text DEFAULT '#111827';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS sidebar_background_color text DEFAULT '#f9fafb';

-- Tipografia específica
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_title_font_size text DEFAULT '1.25rem';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_title_font_weight text DEFAULT '600';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_description_font_size text DEFAULT '0.875rem';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_description_font_weight text DEFAULT '400';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_price_font_size text DEFAULT '1.5rem';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS product_price_font_weight text DEFAULT '700';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_font_size text DEFAULT '0.875rem';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_font_weight text DEFAULT '500';

-- Espaçamentos
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS card_padding text DEFAULT '1rem';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_padding_x text DEFAULT '1rem';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_padding_y text DEFAULT '0.5rem';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS section_margin_y text DEFAULT '2rem';

-- Animações e transições
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS hover_transition_duration text DEFAULT '200ms';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS button_hover_scale text DEFAULT '1.02';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS card_hover_scale text DEFAULT '1.01';

-- Cores de status
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS success_color text DEFAULT '#10b981';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS warning_color text DEFAULT '#f59e0b';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS error_color text DEFAULT '#ef4444';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS info_color text DEFAULT '#3b82f6';

-- Textos de mensagens
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS message_success_text text DEFAULT 'Sucesso!';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS message_error_text text DEFAULT 'Erro!';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS message_loading_text text DEFAULT 'Carregando...';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS message_empty_cart_text text DEFAULT 'Seu carrinho está vazio';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS message_no_products_text text DEFAULT 'Nenhum produto encontrado';

-- Cores de navegação
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS nav_link_color text DEFAULT '#374151';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS nav_link_hover_color text DEFAULT '#3b82f6';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS nav_link_active_color text DEFAULT '#3b82f6';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS breadcrumb_color text DEFAULT '#6b7280';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS breadcrumb_separator_color text DEFAULT '#d1d5db';

-- URLs de mídia adicionais
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS about_image_url text DEFAULT '';

-- Configurações de layout adicionais
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS products_per_page integer DEFAULT 12;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_dark_mode boolean DEFAULT false;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS header_style text DEFAULT 'default';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS footer_style text DEFAULT 'default';

-- SEO e Analytics
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS meta_title text DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS meta_description text DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS meta_keywords text DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS google_analytics_id text DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS facebook_pixel_id text DEFAULT '';

-- Redes sociais adicionais
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS youtube_url text DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS linkedin_url text DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS tiktok_url text DEFAULT '';

-- Configurações de e-commerce
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS min_order_value numeric(10,2) DEFAULT 0;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS free_shipping_threshold numeric(10,2) DEFAULT 100;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS tax_rate numeric(5,2) DEFAULT 0;

-- Métodos de pagamento
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_credit_card boolean DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_debit_card boolean DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_pix boolean DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_boleto boolean DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_paypal boolean DEFAULT false;

-- Configurações de entrega
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS default_shipping_cost numeric(10,2) DEFAULT 10;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS estimated_delivery_days integer DEFAULT 7;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_local_pickup boolean DEFAULT false;

-- Textos personalizáveis adicionais
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS privacy_policy_url text DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS terms_of_service_url text DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS return_policy_text text DEFAULT '';

-- Funcionalidades
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_wishlist boolean DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_compare boolean DEFAULT true;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS enable_chat boolean DEFAULT false;