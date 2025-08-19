import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, StoreSettings, isSupabaseConfigured } from '../lib/supabase';

interface StoreSettings {
  id: string;
  // Informações básicas
  store_name: string;
  store_description: string;
  store_slogan: string;
  
  // URLs de mídia
  logo_url: string;
  favicon_url: string;
  banner_url: string;
  header_banner_url: string;
  about_image_url: string;
  
  // Cores e tema
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  
  // Cores de botões
  button_primary_bg_color: string;
  button_primary_text_color: string;
  button_primary_hover_bg_color: string;
  button_primary_hover_text_color: string;
  button_secondary_bg_color: string;
  button_secondary_text_color: string;
  button_secondary_hover_bg_color: string;
  button_secondary_hover_text_color: string;
  button_success_bg_color: string;
  button_success_text_color: string;
  button_success_hover_bg_color: string;
  button_success_hover_text_color: string;
  button_danger_bg_color: string;
  button_danger_text_color: string;
  button_danger_hover_bg_color: string;
  button_danger_hover_text_color: string;

  // Cores de textos específicos
  product_title_color: string;
  product_description_color: string;
  product_price_color: string;
  header_text_color: string;
  footer_text_color: string;
  link_color: string;
  link_hover_color: string;

  // Cores de ícones específicos
  cart_icon_color: string;
  star_icon_color: string;
  search_icon_color: string;
  menu_icon_color: string;
  social_icon_color: string;
  social_icon_hover_color: string;

  // Textos personalizáveis de botões
  button_add_to_cart_text: string;
  button_buy_now_text: string;
  button_view_product_text: string;
  button_continue_shopping_text: string;
  button_checkout_text: string;
  button_view_cart_text: string;
  button_search_text: string;
  button_filter_text: string;
  button_clear_filters_text: string;

  // Efeitos visuais
  card_shadow_color: string;
  card_shadow_hover_color: string;
  card_border_radius: string;
  button_border_radius: string;
  input_border_radius: string;

  // Cores de bordas
  card_border_color: string;
  input_border_color: string;
  input_focus_border_color: string;
  button_border_color: string;

  // Cores de fundo específicas
  card_background_color: string;
  input_background_color: string;
  header_background_color: string;
  footer_background_color: string;
  sidebar_background_color: string;

  // Tipografia específica
  product_title_font_size: string;
  product_title_font_weight: string;
  product_description_font_size: string;
  product_description_font_weight: string;
  product_price_font_size: string;
  product_price_font_weight: string;
  button_font_size: string;
  button_font_weight: string;

  // Espaçamentos
  card_padding: string;
  button_padding_x: string;
  button_padding_y: string;
  section_margin_y: string;

  // Animações e transições
  hover_transition_duration: string;
  button_hover_scale: string;
  card_hover_scale: string;

  // Cores de status
  success_color: string;
  warning_color: string;
  error_color: string;
  info_color: string;

  // Textos de mensagens
  message_success_text: string;
  message_error_text: string;
  message_loading_text: string;
  message_empty_cart_text: string;
  message_no_products_text: string;

  // Cores de navegação
  nav_link_color: string;
  nav_link_hover_color: string;
  nav_link_active_color: string;
  breadcrumb_color: string;
  breadcrumb_separator_color: string;

  // Tipografia
  font_family: string;
  heading_font: string;
  
  // Configurações regionais
  currency: string;
  currency_symbol: string;
  language: string;
  timezone: string;
  
  // Funcionalidades
  enable_reviews: boolean;
  enable_notifications: boolean;
  enable_wishlist: boolean;
  enable_compare: boolean;
  enable_chat: boolean;
  maintenance_mode: boolean;
  
  // SEO
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  google_analytics_id: string;
  facebook_pixel_id: string;
  
  // Contato
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  
  // Redes sociais
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  linkedin_url: string;
  tiktok_url: string;
  
  // Configurações de e-commerce
  min_order_value: number;
  free_shipping_threshold: number;
  tax_rate: number;
  
  // Métodos de pagamento
  enable_credit_card: boolean;
  enable_debit_card: boolean;
  enable_pix: boolean;
  enable_boleto: boolean;
  enable_paypal: boolean;
  
  // Configurações de entrega
  default_shipping_cost: number;
  estimated_delivery_days: number;
  enable_local_pickup: boolean;
  
  // Textos personalizáveis
  welcome_message: string;
  footer_text: string;
  
  // SEO
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  meta_author: string;
  meta_robots: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  schema_type: string;
  schema_description: string;
  
  // Integrações
  google_analytics_id: string;
  google_tag_manager_id: string;
  facebook_pixel_id: string;
  google_ads_conversion_id: string;
  google_ads_conversion_label: string;
  hotjar_id: string;
  microsoft_clarity_id: string;
  tiktok_pixel_id: string;
  pinterest_tag_id: string;
  snapchat_pixel_id: string;
  custom_head_scripts: string;
  custom_body_scripts: string;
  custom_footer_scripts: string;
  privacy_policy_url: string;
  terms_of_service_url: string;
  return_policy_text: string;
  
  // Configurações de layout
  products_per_page: number;
  enable_dark_mode: boolean;
  header_style: string;
  footer_style: string;
  
  created_at: string;
  updated_at: string;
}

interface StoreContextType {
  settings: StoreSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};

// Configurações padrão para quando Supabase não estiver configurado
const defaultSettings: StoreSettings = {
  id: 'default',
  store_name: 'TechStore',
  store_description: 'Os melhores produtos com qualidade garantida',
  store_slogan: 'Tecnologia que transforma sua vida',
  logo_url: '',
  favicon_url: '',
  banner_url: '',
  header_banner_url: '',
  about_image_url: '',
  primary_color: '#3b82f6',
  secondary_color: '#10b981',
  accent_color: '#f59e0b',
  background_color: '#f9fafb',
  text_color: '#111827',
  
  // Cores de botões
  button_primary_bg_color: '#3b82f6',
  button_primary_text_color: '#ffffff',
  button_primary_hover_bg_color: '#2563eb',
  button_primary_hover_text_color: '#ffffff',
  button_secondary_bg_color: '#6b7280',
  button_secondary_text_color: '#ffffff',
  button_secondary_hover_bg_color: '#4b5563',
  button_secondary_hover_text_color: '#ffffff',
  button_success_bg_color: '#10b981',
  button_success_text_color: '#ffffff',
  button_success_hover_bg_color: '#059669',
  button_success_hover_text_color: '#ffffff',
  button_danger_bg_color: '#ef4444',
  button_danger_text_color: '#ffffff',
  button_danger_hover_bg_color: '#dc2626',
  button_danger_hover_text_color: '#ffffff',

  // Cores de textos específicos
  product_title_color: '#111827',
  product_description_color: '#6b7280',
  product_price_color: '#3b82f6',
  header_text_color: '#111827',
  footer_text_color: '#ffffff',
  link_color: '#3b82f6',
  link_hover_color: '#2563eb',

  // Cores de ícones específicos
  cart_icon_color: '#3b82f6',
  star_icon_color: '#fbbf24',
  search_icon_color: '#6b7280',
  menu_icon_color: '#374151',
  social_icon_color: '#6b7280',
  social_icon_hover_color: '#3b82f6',

  // Textos personalizáveis de botões
  button_add_to_cart_text: 'Adicionar ao Carrinho',
  button_buy_now_text: 'Comprar Agora',
  button_view_product_text: 'Ver Produto',
  button_continue_shopping_text: 'Continuar Comprando',
  button_checkout_text: 'Finalizar Pedido',
  button_view_cart_text: 'Ver Carrinho',
  button_search_text: 'Buscar',
  button_filter_text: 'Filtrar',
  button_clear_filters_text: 'Limpar Filtros',

  // Efeitos visuais
  card_shadow_color: 'rgba(0, 0, 0, 0.1)',
  card_shadow_hover_color: 'rgba(0, 0, 0, 0.15)',
  card_border_radius: '8px',
  button_border_radius: '6px',
  input_border_radius: '6px',

  // Cores de bordas
  card_border_color: '#e5e7eb',
  input_border_color: '#d1d5db',
  input_focus_border_color: '#3b82f6',
  button_border_color: 'transparent',

  // Cores de fundo específicas
  card_background_color: '#ffffff',
  input_background_color: '#ffffff',
  header_background_color: '#ffffff',
  footer_background_color: '#111827',
  sidebar_background_color: '#f9fafb',

  // Tipografia específica
  product_title_font_size: '1.25rem',
  product_title_font_weight: '600',
  product_description_font_size: '0.875rem',
  product_description_font_weight: '400',
  product_price_font_size: '1.5rem',
  product_price_font_weight: '700',
  button_font_size: '0.875rem',
  button_font_weight: '500',

  // Espaçamentos
  card_padding: '1rem',
  button_padding_x: '1rem',
  button_padding_y: '0.5rem',
  section_margin_y: '2rem',

  // Animações e transições
  hover_transition_duration: '200ms',
  button_hover_scale: '1.02',
  card_hover_scale: '1.01',

  // Cores de status
  success_color: '#10b981',
  warning_color: '#f59e0b',
  error_color: '#ef4444',
  info_color: '#3b82f6',

  // Textos de mensagens
  message_success_text: 'Sucesso!',
  message_error_text: 'Erro!',
  message_loading_text: 'Carregando...',
  message_empty_cart_text: 'Seu carrinho está vazio',
  message_no_products_text: 'Nenhum produto encontrado',

  // Cores de navegação
  nav_link_color: '#374151',
  nav_link_hover_color: '#3b82f6',
  nav_link_active_color: '#3b82f6',
  breadcrumb_color: '#6b7280',
  breadcrumb_separator_color: '#d1d5db',

  font_family: 'Roboto',
  heading_font: 'Montserrat',
  heading_font: 'Montserrat',
  currency: 'BRL',
  currency_symbol: 'R$',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  enable_reviews: true,
  enable_notifications: true,
  enable_wishlist: true,
  enable_compare: true,
  enable_chat: false,
  maintenance_mode: false,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  google_analytics_id: '',
  facebook_pixel_id: '',
  contact_email: '',
  contact_phone: '',
  contact_whatsapp: '',
  contact_address: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  linkedin_url: '',
  tiktok_url: '',
  min_order_value: 0,
  free_shipping_threshold: 100,
  tax_rate: 0,
  enable_credit_card: true,
  enable_debit_card: true,
  enable_pix: true,
  enable_boleto: true,
  enable_paypal: false,
  default_shipping_cost: 10,
  estimated_delivery_days: 7,
  enable_local_pickup: false,
  welcome_message: 'Descubra produtos incríveis com a melhor qualidade do mercado!',
  footer_text: '© 2024 TechStore. Todos os direitos reservados.',
  
  // SEO
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  meta_author: '',
  meta_robots: 'index,follow',
  canonical_url: '',
  og_title: '',
  og_description: '',
  og_image: '',
  og_type: 'website',
  twitter_card: 'summary_large_image',
  twitter_title: '',
  twitter_description: '',
  twitter_image: '',
  schema_type: 'Store',
  schema_description: '',
  
  // Integrações
  google_analytics_id: '',
  google_tag_manager_id: '',
  facebook_pixel_id: '',
  google_ads_conversion_id: '',
  google_ads_conversion_label: '',
  hotjar_id: '',
  microsoft_clarity_id: '',
  tiktok_pixel_id: '',
  pinterest_tag_id: '',
  snapchat_pixel_id: '',
  custom_head_scripts: '',
  custom_body_scripts: '',
  custom_footer_scripts: '',
  privacy_policy_url: '',
  terms_of_service_url: '',
  return_policy_text: '',
  products_per_page: 12,
  enable_dark_mode: false,
  header_style: 'default',
  footer_style: 'default',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    // Se Supabase não estiver configurado, usar configurações padrão
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using default settings.');
      setSettings(defaultSettings);
      applyThemeSettings(defaultSettings);
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Buscando configurações da loja...');
      const { data, error } = await supabase!
        .from('store_settings')
        .select('*')
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.warn('❌ Erro ao buscar configurações:', error.message);
        setSettings(defaultSettings);
        applyThemeSettings(defaultSettings);
      } else if (data && data.length > 0) {
        console.log('✅ Configurações carregadas:', data[0]);
        setSettings(data[0]);
        applyThemeSettings(data[0]);
      } else {
        console.log('📋 Nenhuma configuração encontrada, usando padrão');
        setSettings(defaultSettings);
        applyThemeSettings(defaultSettings);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar configurações:', error);
      setSettings(defaultSettings);
      applyThemeSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const applyThemeSettings = (settings: StoreSettings) => {
    const root = document.documentElement;
    
    // Aplicar configurações críticas imediatamente no HTML para evitar flash
    const style = document.createElement('style');
    style.id = 'critical-theme-styles';
    style.innerHTML = `
      :root {
        --primary-color: ${settings.primary_color};
        --secondary-color: ${settings.secondary_color};
        --accent-color: ${settings.accent_color};
        --background-color: ${settings.background_color};
        --text-color: ${settings.text_color};
        --product-title-color: ${settings.product_title_color};
        --product-description-color: ${settings.product_description_color};
        --product-price-color: ${settings.product_price_color};
        --font-family: ${settings.font_family};
        --heading-font: ${settings.heading_font};
      }
      
      body {
        font-family: var(--font-family), sans-serif !important;
        background-color: var(--background-color) !important;
        color: var(--text-color) !important;
      }
      
      .product-price {
        color: var(--product-price-color) !important;
      }
      
      .product-title {
        color: var(--product-title-color) !important;
      }
      
      .product-description {
        color: var(--product-description-color) !important;
      }
    `;
    
    // Remove estilo anterior se existir
    const existingStyle = document.getElementById('critical-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Adiciona o novo estilo no head
    document.head.appendChild(style);
    
    // Aplicar cores personalizadas
    root.style.setProperty('--primary-color', settings.primary_color);
    root.style.setProperty('--secondary-color', settings.secondary_color);
    root.style.setProperty('--accent-color', settings.accent_color);
    root.style.setProperty('--background-color', settings.background_color);
    root.style.setProperty('--text-color', settings.text_color);
    
    // Aplicar cores de botões
    root.style.setProperty('--button-primary-bg', settings.button_primary_bg_color);
    root.style.setProperty('--button-primary-text', settings.button_primary_text_color);
    root.style.setProperty('--button-primary-hover-bg', settings.button_primary_hover_bg_color);
    root.style.setProperty('--button-primary-hover-text', settings.button_primary_hover_text_color);
    root.style.setProperty('--button-secondary-bg', settings.button_secondary_bg_color);
    root.style.setProperty('--button-secondary-text', settings.button_secondary_text_color);
    root.style.setProperty('--button-secondary-hover-bg', settings.button_secondary_hover_bg_color);
    root.style.setProperty('--button-secondary-hover-text', settings.button_secondary_hover_text_color);
    root.style.setProperty('--button-success-bg', settings.button_success_bg_color);
    root.style.setProperty('--button-success-text', settings.button_success_text_color);
    root.style.setProperty('--button-success-hover-bg', settings.button_success_hover_bg_color);
    root.style.setProperty('--button-success-hover-text', settings.button_success_hover_text_color);
    root.style.setProperty('--button-danger-bg', settings.button_danger_bg_color);
    root.style.setProperty('--button-danger-text', settings.button_danger_text_color);
    root.style.setProperty('--button-danger-hover-bg', settings.button_danger_hover_bg_color);
    root.style.setProperty('--button-danger-hover-text', settings.button_danger_hover_text_color);

    // Aplicar cores de textos específicos
    root.style.setProperty('--product-title-color', settings.product_title_color);
    root.style.setProperty('--product-description-color', settings.product_description_color);
    root.style.setProperty('--product-price-color', settings.product_price_color);
    root.style.setProperty('--header-text-color', settings.header_text_color);
    root.style.setProperty('--footer-text-color', settings.footer_text_color);
    root.style.setProperty('--link-color', settings.link_color);
    root.style.setProperty('--link-hover-color', settings.link_hover_color);

    // Aplicar cores de ícones
    root.style.setProperty('--cart-icon-color', settings.cart_icon_color);
    root.style.setProperty('--star-icon-color', settings.star_icon_color);
    root.style.setProperty('--search-icon-color', settings.search_icon_color);
    root.style.setProperty('--menu-icon-color', settings.menu_icon_color);
    root.style.setProperty('--social-icon-color', settings.social_icon_color);
    root.style.setProperty('--social-icon-hover-color', settings.social_icon_hover_color);

    // Aplicar efeitos visuais
    root.style.setProperty('--card-shadow', `0 4px 6px -1px ${settings.card_shadow_color}`);
    root.style.setProperty('--card-shadow-hover', `0 10px 15px -3px ${settings.card_shadow_hover_color}`);
    root.style.setProperty('--card-border-radius', settings.card_border_radius);
    root.style.setProperty('--button-border-radius', settings.button_border_radius);
    root.style.setProperty('--input-border-radius', settings.input_border_radius);

    // Aplicar cores de bordas
    root.style.setProperty('--card-border-color', settings.card_border_color);
    root.style.setProperty('--input-border-color', settings.input_border_color);
    root.style.setProperty('--input-focus-border-color', settings.input_focus_border_color);
    root.style.setProperty('--button-border-color', settings.button_border_color);

    // Aplicar cores de fundo específicas
    root.style.setProperty('--card-background-color', settings.card_background_color);
    root.style.setProperty('--input-background-color', settings.input_background_color);
    root.style.setProperty('--header-background-color', settings.header_background_color);
    root.style.setProperty('--footer-background-color', settings.footer_background_color);
    root.style.setProperty('--sidebar-background-color', settings.sidebar_background_color);

    // Aplicar tipografia específica
    root.style.setProperty('--product-title-font-size', settings.product_title_font_size);
    root.style.setProperty('--product-title-font-weight', settings.product_title_font_weight);
    root.style.setProperty('--product-description-font-size', settings.product_description_font_size);
    root.style.setProperty('--product-description-font-weight', settings.product_description_font_weight);
    root.style.setProperty('--product-price-font-size', settings.product_price_font_size);
    root.style.setProperty('--product-price-font-weight', settings.product_price_font_weight);
    root.style.setProperty('--button-font-size', settings.button_font_size);
    root.style.setProperty('--button-font-weight', settings.button_font_weight);

    // Aplicar espaçamentos
    root.style.setProperty('--card-padding', settings.card_padding);
    root.style.setProperty('--button-padding-x', settings.button_padding_x);
    root.style.setProperty('--button-padding-y', settings.button_padding_y);
    root.style.setProperty('--section-margin-y', settings.section_margin_y);

    // Aplicar animações
    root.style.setProperty('--hover-transition-duration', settings.hover_transition_duration);
    root.style.setProperty('--button-hover-scale', settings.button_hover_scale);
    root.style.setProperty('--card-hover-scale', settings.card_hover_scale);

    // Aplicar cores de status
    root.style.setProperty('--success-color', settings.success_color);
    root.style.setProperty('--warning-color', settings.warning_color);
    root.style.setProperty('--error-color', settings.error_color);
    root.style.setProperty('--info-color', settings.info_color);

    // Aplicar cores de navegação
    root.style.setProperty('--nav-link-color', settings.nav_link_color);
    root.style.setProperty('--nav-link-hover-color', settings.nav_link_hover_color);
    root.style.setProperty('--nav-link-active-color', settings.nav_link_active_color);
    root.style.setProperty('--breadcrumb-color', settings.breadcrumb_color);
    root.style.setProperty('--breadcrumb-separator-color', settings.breadcrumb_separator_color);

    // Aplicar fontes
    root.style.setProperty('--font-family', settings.font_family);
    root.style.setProperty('--heading-font', settings.heading_font);
    
    // Atualizar título da página
    const title = settings.meta_title || `${settings.store_name} - ${settings.store_description}`;
    document.title = title;
    
    // Atualizar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const description = settings.meta_description || settings.store_description;
      metaDescription.setAttribute('content', description);
    }
    
    // Atualizar meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    if (settings.meta_keywords) {
      metaKeywords.setAttribute('content', settings.meta_keywords);
    }
    
    // Atualizar meta author
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
      metaAuthor = document.createElement('meta');
      metaAuthor.setAttribute('name', 'author');
      document.head.appendChild(metaAuthor);
    }
    if (settings.meta_author) {
      metaAuthor.setAttribute('content', settings.meta_author);
    }
    
    // Atualizar meta robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', settings.meta_robots);
    
    // Atualizar canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    if (settings.canonical_url) {
      canonical.setAttribute('href', settings.canonical_url);
    }
    
    // Open Graph tags
    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      if (content) {
        meta.setAttribute('content', content);
      }
    };
    
    updateMetaProperty('og:title', settings.og_title || settings.store_name);
    updateMetaProperty('og:description', settings.og_description || settings.store_description);
    updateMetaProperty('og:image', settings.og_image);
    updateMetaProperty('og:type', settings.og_type);
    updateMetaProperty('og:url', settings.canonical_url || window.location.href);
    
    // Twitter Card tags
    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      if (content) {
        meta.setAttribute('content', content);
      }
    };
    
    updateMetaName('twitter:card', settings.twitter_card);
    updateMetaName('twitter:title', settings.twitter_title || settings.og_title || settings.store_name);
    updateMetaName('twitter:description', settings.twitter_description || settings.og_description || settings.store_description);
    updateMetaName('twitter:image', settings.twitter_image || settings.og_image);
    
    // Schema markup
    if (settings.schema_type) {
      let schemaScript = document.querySelector('#schema-markup');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('id', 'schema-markup');
        document.head.appendChild(schemaScript);
      }
      
      const schemaData = {
        "@context": "https://schema.org",
        "@type": settings.schema_type,
        "name": settings.store_name,
        "description": settings.schema_description || settings.store_description,
        "url": settings.canonical_url || window.location.origin,
        "logo": settings.logo_url,
        "image": settings.og_image,
        "telephone": settings.contact_phone,
        "email": settings.contact_email,
        "address": settings.contact_address
      };
      
      schemaScript.textContent = JSON.stringify(schemaData);
    }
    
    // Integração Google Tag Manager
    if (settings.google_tag_manager_id && !document.querySelector('#gtm-script')) {
      const gtmScript = document.createElement('script');
      gtmScript.id = 'gtm-script';
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
      `;
      document.head.appendChild(gtmScript);
      
      // GTM noscript
      const gtmNoscript = document.createElement('noscript');
      gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(gtmNoscript, document.body.firstChild);
    }
    
    // Integração Google Analytics 4
    if (settings.google_analytics_id && !document.querySelector('#ga4-script')) {
      const ga4Script = document.createElement('script');
      ga4Script.id = 'ga4-script';
      ga4Script.async = true;
      ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
      document.head.appendChild(ga4Script);
      
      const ga4Config = document.createElement('script');
      ga4Config.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.google_analytics_id}', {
          page_title: document.title,
          page_location: window.location.href
        });
      `;
      document.head.appendChild(ga4Config);
    }
    
    // Integração Facebook Pixel
    if (settings.facebook_pixel_id && !document.querySelector('#fb-pixel-script')) {
      const fbScript = document.createElement('script');
      fbScript.id = 'fb-pixel-script';
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebook_pixel_id}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
    }
    
    // Integração Hotjar
    if (settings.hotjar_id && !document.querySelector('#hotjar-script')) {
      const hotjarScript = document.createElement('script');
      hotjarScript.id = 'hotjar-script';
      hotjarScript.innerHTML = `
        (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${settings.hotjar_id},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
      document.head.appendChild(hotjarScript);
    }
    
    // Scripts personalizados
    if (settings.custom_head_scripts) {
      let customHeadScript = document.querySelector('#custom-head-scripts');
      if (!customHeadScript) {
        customHeadScript = document.createElement('div');
        customHeadScript.id = 'custom-head-scripts';
        document.head.appendChild(customHeadScript);
      }
      customHeadScript.innerHTML = settings.custom_head_scripts;
    }
    
    if (settings.custom_body_scripts) {
      let customBodyScript = document.querySelector('#custom-body-scripts');
      if (!customBodyScript) {
        customBodyScript = document.createElement('div');
        customBodyScript.id = 'custom-body-scripts';
        document.body.insertBefore(customBodyScript, document.body.firstChild);
      }
      customBodyScript.innerHTML = settings.custom_body_scripts;
    }
    
    if (settings.custom_footer_scripts) {
      let customFooterScript = document.querySelector('#custom-footer-scripts');
      if (!customFooterScript) {
        customFooterScript = document.createElement('div');
        customFooterScript.id = 'custom-footer-scripts';
        document.body.appendChild(customFooterScript);
      }
      customFooterScript.innerHTML = settings.custom_footer_scripts;
    }
    
    // Atualizar favicon se configurado
    if (settings.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = settings.favicon_url;
      }
    }
    
    // Aplicar modo escuro se habilitado
    if (settings.enable_dark_mode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    // Aplicar configurações críticas imediatamente
    if (settings) {
      applyThemeSettings(settings);
    }
    
    fetchSettings();

    // Escutar mudanças em tempo real apenas se Supabase estiver configurado
    if (isSupabaseConfigured()) {
      const subscription = supabase!
        .channel('store_settings_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'store_settings' },
          () => {
            fetchSettings();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [settings]);

  const value = {
    settings,
    loading,
    refreshSettings,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};