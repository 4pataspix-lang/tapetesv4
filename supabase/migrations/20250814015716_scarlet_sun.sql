-- Migração completa para configurações da loja
-- Execute este código no Supabase Dashboard → SQL Editor

-- Adicionar colunas de cores de botões
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_primary_bg_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_primary_bg_color text DEFAULT '#3b82f6';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_primary_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_primary_text_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_primary_hover_bg_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_primary_hover_bg_color text DEFAULT '#2563eb';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_primary_hover_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_primary_hover_text_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_secondary_bg_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_secondary_bg_color text DEFAULT '#6b7280';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_secondary_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_secondary_text_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_secondary_hover_bg_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_secondary_hover_bg_color text DEFAULT '#4b5563';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_secondary_hover_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_secondary_hover_text_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_success_bg_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_success_bg_color text DEFAULT '#10b981';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_success_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_success_text_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_success_hover_bg_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_success_hover_bg_color text DEFAULT '#059669';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_success_hover_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_success_hover_text_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_danger_bg_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_danger_bg_color text DEFAULT '#ef4444';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_danger_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_danger_text_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_danger_hover_bg_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_danger_hover_bg_color text DEFAULT '#dc2626';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_danger_hover_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_danger_hover_text_color text DEFAULT '#ffffff';
  END IF;
END $$;

-- Adicionar colunas de cores específicas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_title_color') THEN
    ALTER TABLE store_settings ADD COLUMN product_title_color text DEFAULT '#111827';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_description_color') THEN
    ALTER TABLE store_settings ADD COLUMN product_description_color text DEFAULT '#6b7280';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_price_color') THEN
    ALTER TABLE store_settings ADD COLUMN product_price_color text DEFAULT '#3b82f6';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'header_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN header_text_color text DEFAULT '#111827';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'footer_text_color') THEN
    ALTER TABLE store_settings ADD COLUMN footer_text_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'link_color') THEN
    ALTER TABLE store_settings ADD COLUMN link_color text DEFAULT '#3b82f6';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'link_hover_color') THEN
    ALTER TABLE store_settings ADD COLUMN link_hover_color text DEFAULT '#2563eb';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'cart_icon_color') THEN
    ALTER TABLE store_settings ADD COLUMN cart_icon_color text DEFAULT '#3b82f6';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'star_icon_color') THEN
    ALTER TABLE store_settings ADD COLUMN star_icon_color text DEFAULT '#fbbf24';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'search_icon_color') THEN
    ALTER TABLE store_settings ADD COLUMN search_icon_color text DEFAULT '#6b7280';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'menu_icon_color') THEN
    ALTER TABLE store_settings ADD COLUMN menu_icon_color text DEFAULT '#374151';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'social_icon_color') THEN
    ALTER TABLE store_settings ADD COLUMN social_icon_color text DEFAULT '#6b7280';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'social_icon_hover_color') THEN
    ALTER TABLE store_settings ADD COLUMN social_icon_hover_color text DEFAULT '#3b82f6';
  END IF;
END $$;

-- Adicionar colunas de cores de fundo
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'card_background_color') THEN
    ALTER TABLE store_settings ADD COLUMN card_background_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'input_background_color') THEN
    ALTER TABLE store_settings ADD COLUMN input_background_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'header_background_color') THEN
    ALTER TABLE store_settings ADD COLUMN header_background_color text DEFAULT '#ffffff';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'footer_background_color') THEN
    ALTER TABLE store_settings ADD COLUMN footer_background_color text DEFAULT '#111827';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'sidebar_background_color') THEN
    ALTER TABLE store_settings ADD COLUMN sidebar_background_color text DEFAULT '#f9fafb';
  END IF;
END $$;

-- Adicionar colunas de tipografia
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_title_font_size') THEN
    ALTER TABLE store_settings ADD COLUMN product_title_font_size text DEFAULT '1.25rem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_title_font_weight') THEN
    ALTER TABLE store_settings ADD COLUMN product_title_font_weight text DEFAULT '600';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_description_font_size') THEN
    ALTER TABLE store_settings ADD COLUMN product_description_font_size text DEFAULT '0.875rem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_description_font_weight') THEN
    ALTER TABLE store_settings ADD COLUMN product_description_font_weight text DEFAULT '400';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_price_font_size') THEN
    ALTER TABLE store_settings ADD COLUMN product_price_font_size text DEFAULT '1.5rem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'product_price_font_weight') THEN
    ALTER TABLE store_settings ADD COLUMN product_price_font_weight text DEFAULT '700';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_font_size') THEN
    ALTER TABLE store_settings ADD COLUMN button_font_size text DEFAULT '0.875rem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_font_weight') THEN
    ALTER TABLE store_settings ADD COLUMN button_font_weight text DEFAULT '500';
  END IF;
END $$;

-- Adicionar colunas de efeitos visuais
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'card_shadow_color') THEN
    ALTER TABLE store_settings ADD COLUMN card_shadow_color text DEFAULT 'rgba(0, 0, 0, 0.1)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'card_shadow_hover_color') THEN
    ALTER TABLE store_settings ADD COLUMN card_shadow_hover_color text DEFAULT 'rgba(0, 0, 0, 0.15)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'card_border_radius') THEN
    ALTER TABLE store_settings ADD COLUMN card_border_radius text DEFAULT '8px';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_border_radius') THEN
    ALTER TABLE store_settings ADD COLUMN button_border_radius text DEFAULT '6px';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'input_border_radius') THEN
    ALTER TABLE store_settings ADD COLUMN input_border_radius text DEFAULT '6px';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'card_border_color') THEN
    ALTER TABLE store_settings ADD COLUMN card_border_color text DEFAULT '#e5e7eb';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'input_border_color') THEN
    ALTER TABLE store_settings ADD COLUMN input_border_color text DEFAULT '#d1d5db';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'input_focus_border_color') THEN
    ALTER TABLE store_settings ADD COLUMN input_focus_border_color text DEFAULT '#3b82f6';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_border_color') THEN
    ALTER TABLE store_settings ADD COLUMN button_border_color text DEFAULT 'transparent';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'card_padding') THEN
    ALTER TABLE store_settings ADD COLUMN card_padding text DEFAULT '1rem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_padding_x') THEN
    ALTER TABLE store_settings ADD COLUMN button_padding_x text DEFAULT '1rem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_padding_y') THEN
    ALTER TABLE store_settings ADD COLUMN button_padding_y text DEFAULT '0.5rem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'section_margin_y') THEN
    ALTER TABLE store_settings ADD COLUMN section_margin_y text DEFAULT '2rem';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'hover_transition_duration') THEN
    ALTER TABLE store_settings ADD COLUMN hover_transition_duration text DEFAULT '200ms';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_hover_scale') THEN
    ALTER TABLE store_settings ADD COLUMN button_hover_scale text DEFAULT '1.02';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'card_hover_scale') THEN
    ALTER TABLE store_settings ADD COLUMN card_hover_scale text DEFAULT '1.01';
  END IF;
END $$;

-- Adicionar colunas de cores de status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'success_color') THEN
    ALTER TABLE store_settings ADD COLUMN success_color text DEFAULT '#10b981';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'warning_color') THEN
    ALTER TABLE store_settings ADD COLUMN warning_color text DEFAULT '#f59e0b';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'error_color') THEN
    ALTER TABLE store_settings ADD COLUMN error_color text DEFAULT '#ef4444';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'info_color') THEN
    ALTER TABLE store_settings ADD COLUMN info_color text DEFAULT '#3b82f6';
  END IF;
END $$;

-- Adicionar colunas de textos personalizáveis
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_add_to_cart_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_add_to_cart_text text DEFAULT 'Adicionar ao Carrinho';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_buy_now_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_buy_now_text text DEFAULT 'Comprar Agora';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_view_product_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_view_product_text text DEFAULT 'Ver Produto';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_continue_shopping_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_continue_shopping_text text DEFAULT 'Continuar Comprando';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_checkout_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_checkout_text text DEFAULT 'Finalizar Pedido';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_view_cart_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_view_cart_text text DEFAULT 'Ver Carrinho';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_search_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_search_text text DEFAULT 'Buscar';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_filter_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_filter_text text DEFAULT 'Filtrar';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'button_clear_filters_text') THEN
    ALTER TABLE store_settings ADD COLUMN button_clear_filters_text text DEFAULT 'Limpar Filtros';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'message_success_text') THEN
    ALTER TABLE store_settings ADD COLUMN message_success_text text DEFAULT 'Sucesso!';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'message_error_text') THEN
    ALTER TABLE store_settings ADD COLUMN message_error_text text DEFAULT 'Erro!';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'message_loading_text') THEN
    ALTER TABLE store_settings ADD COLUMN message_loading_text text DEFAULT 'Carregando...';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'message_empty_cart_text') THEN
    ALTER TABLE store_settings ADD COLUMN message_empty_cart_text text DEFAULT 'Seu carrinho está vazio';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'message_no_products_text') THEN
    ALTER TABLE store_settings ADD COLUMN message_no_products_text text DEFAULT 'Nenhum produto encontrado';
  END IF;
END $$;

-- Verificar se já existe um registro e criar se necessário
DO $$
BEGIN
  -- Se não existe nenhum registro, criar um com UUID gerado
  IF NOT EXISTS (SELECT 1 FROM store_settings LIMIT 1) THEN
    INSERT INTO store_settings (id) VALUES (gen_random_uuid());
  END IF;
  
  -- Atualizar timestamp do primeiro registro
  UPDATE store_settings SET updated_at = now() WHERE id = (SELECT id FROM store_settings LIMIT 1);
END $$;