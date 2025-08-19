import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar se as variáveis de ambiente estão configuradas
const isConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  supabaseUrl.includes('supabase.co')
);

// Check if Supabase environment variables are available
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return isConfigured && !!supabase;
};

// Helper function to show configuration status
export const getSupabaseStatus = () => {
  if (!supabaseUrl) return '❌ VITE_SUPABASE_URL não configurada';
  if (!supabaseAnonKey) return '❌ VITE_SUPABASE_ANON_KEY não configurada';
  if (supabaseUrl === 'your_supabase_project_url') return '❌ Configure VITE_SUPABASE_URL no arquivo .env';
  if (supabaseAnonKey === 'your_supabase_anon_key') return '❌ Configure VITE_SUPABASE_ANON_KEY no arquivo .env';
  if (!supabaseUrl.includes('supabase.co')) return '❌ URL do Supabase inválida';
  return '✅ Supabase configurado corretamente';
};

// Helper function for development debugging
export const debugSupabaseConfig = () => {
  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') return 'VITE_SUPABASE_URL não configurada';
  if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') return 'VITE_SUPABASE_ANON_KEY não configurada';
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    isConfigured: isSupabaseConfigured(),
    status: getSupabaseStatus()
  });
  return getSupabaseStatus();
};

// Tipos do banco de dados
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  image_url: string;
  created_at: string;
  category?: Category;
  gallery_images?: string[];
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_cpf?: string;
  customer_address: string;
  total_amount: number;
  shipping_cost?: number;
  payment_id?: string;
  payment_method?: string;
  payment_status?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total_price: number;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
}

export interface StoreSettings {
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
export interface CartItem extends Product {
  quantity: number;
}