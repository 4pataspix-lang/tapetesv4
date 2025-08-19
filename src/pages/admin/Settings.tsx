import React, { useState, useEffect } from 'react';
import { Save, Palette, Type, Layout, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Eye, Monitor, Smartphone } from 'lucide-react';
import { supabase, StoreSettings, isSupabaseConfigured } from '../../lib/supabase';
import { useStore } from '../../contexts/StoreContext';

export const AdminSettings: React.FC = () => {
  const { settings, refreshSettings } = useStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [formData, setFormData] = useState<Partial<StoreSettings>>({});

  // Inicializar formData apenas uma vez quando settings carregarem
  useEffect(() => {
    if (settings && Object.keys(formData).length === 0) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isSupabaseConfigured()) {
      alert('Supabase não está configurado. Verifique as variáveis de ambiente.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase!
        .from('store_settings')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings?.id);

      if (error) throw error;

      await refreshSettings();
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Básico', icon: Globe },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'typography', label: 'Tipografia', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'contact', label: 'Contato', icon: Phone },
    { id: 'social', label: 'Redes Sociais', icon: Facebook },
    { id: 'seo', label: 'SEO & Analytics', icon: Globe },
    { id: 'advanced', label: 'Avançado', icon: Monitor }
  ];

  const renderBasicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Loja</label>
          <input
            type="text"
            name="store_name"
            value={formData.store_name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
          <input
            type="text"
            name="store_slogan"
            value={formData.store_slogan || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da Loja</label>
        <textarea
          name="store_description"
          value={formData.store_description || ''}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem de Boas-vindas</label>
        <textarea
          name="welcome_message"
          value={formData.welcome_message || ''}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL do Logo</label>
          <input
            type="url"
            name="logo_url"
            value={formData.logo_url || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL do Banner do Header</label>
          <input
            type="url"
            name="header_banner_url"
            value={formData.header_banner_url || ''}
            onChange={handleInputChange}
            placeholder="https://exemplo.com/header-banner.jpg (1000x50px recomendado)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Banner que aparecerá acima do header. Tamanho recomendado: 1000x50px
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL do Banner da Homepage</label>
          <input
            type="url"
            name="banner_url"
            value={formData.banner_url || ''}
            onChange={handleInputChange}
            placeholder="https://exemplo.com/hero-banner.jpg (1920x600px recomendado)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Banner de fundo da seção hero da homepage. Tamanho recomendado: 1920x600px
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo do Header</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="header_background_color"
              value={formData.header_background_color || '#ffffff'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="header_background_color"
              value={formData.header_background_color || '#ffffff'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto do Header</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="header_text_color"
              value={formData.header_text_color || '#111827'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="header_text_color"
              value={formData.header_text_color || '#111827'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesignTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Cores Principais</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="primary_color"
              value={formData.primary_color || '#3b82f6'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="primary_color"
              value={formData.primary_color || '#3b82f6'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="secondary_color"
              value={formData.secondary_color || '#10b981'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="secondary_color"
              value={formData.secondary_color || '#10b981'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Destaque</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="accent_color"
              value={formData.accent_color || '#f59e0b'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="accent_color"
              value={formData.accent_color || '#f59e0b'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-8">Cores de Produtos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Título</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="product_title_color"
              value={formData.product_title_color || '#111827'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="product_title_color"
              value={formData.product_title_color || '#111827'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor da Descrição</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="product_description_color"
              value={formData.product_description_color || '#6b7280'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="product_description_color"
              value={formData.product_description_color || '#6b7280'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Preço</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="product_price_color"
              value={formData.product_price_color || '#3b82f6'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="product_price_color"
              value={formData.product_price_color || '#3b82f6'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-8">Cores de Botões</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Botão Primário - Fundo</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="button_primary_bg_color"
              value={formData.button_primary_bg_color || '#3b82f6'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="button_primary_bg_color"
              value={formData.button_primary_bg_color || '#3b82f6'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Botão Primário - Texto</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="button_primary_text_color"
              value={formData.button_primary_text_color || '#ffffff'}
              onChange={handleInputChange}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="button_primary_text_color"
              value={formData.button_primary_text_color || '#ffffff'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypographyTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fonte Principal</label>
          <select
            name="font_family"
            value={formData.font_family || 'Roboto'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Roboto">Roboto</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Nunito">Nunito</option>
            <option value="Source Sans Pro">Source Sans Pro</option>
            <option value="Raleway">Raleway</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Oswald">Oswald</option>
            <option value="Ubuntu">Ubuntu</option>
            <option value="Fira Sans">Fira Sans</option>
            <option value="Work Sans">Work Sans</option>
            <option value="DM Sans">DM Sans</option>
            <option value="Space Grotesk">Space Grotesk</option>
            <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
            <option value="Manrope">Manrope</option>
            <option value="Lexend">Lexend</option>
            <option value="Outfit">Outfit</option>
            <option value="Satoshi">Satoshi</option>
            <option value="Clash Display">Clash Display</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fonte dos Títulos</label>
          <select
            name="heading_font"
            value={formData.heading_font || 'Montserrat'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Montserrat">Montserrat</option>
            <option value="Roboto">Roboto</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Nunito">Nunito</option>
            <option value="Source Sans Pro">Source Sans Pro</option>
            <option value="Raleway">Raleway</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Oswald">Oswald</option>
            <option value="Ubuntu">Ubuntu</option>
            <option value="Fira Sans">Fira Sans</option>
            <option value="Work Sans">Work Sans</option>
            <option value="DM Sans">DM Sans</option>
            <option value="Space Grotesk">Space Grotesk</option>
            <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
            <option value="Manrope">Manrope</option>
            <option value="Lexend">Lexend</option>
            <option value="Outfit">Outfit</option>
            <option value="Satoshi">Satoshi</option>
            <option value="Clash Display">Clash Display</option>
          </select>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900">Tamanhos de Fonte</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título do Produto</label>
          <input
            type="text"
            name="product_title_font_size"
            value={formData.product_title_font_size || '1.25rem'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Produto</label>
          <input
            type="text"
            name="product_description_font_size"
            value={formData.product_description_font_size || '0.875rem'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preço do Produto</label>
          <input
            type="text"
            name="product_price_font_size"
            value={formData.product_price_font_size || '1.5rem'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Raio da Borda dos Cards</label>
          <input
            type="text"
            name="card_border_radius"
            value={formData.card_border_radius || '8px'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Raio da Borda dos Botões</label>
          <input
            type="text"
            name="button_border_radius"
            value={formData.button_border_radius || '6px'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Padding dos Cards</label>
          <input
            type="text"
            name="card_padding"
            value={formData.card_padding || '1rem'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Padding X dos Botões</label>
          <input
            type="text"
            name="button_padding_x"
            value={formData.button_padding_x || '1rem'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Padding Y dos Botões</label>
          <input
            type="text"
            name="button_padding_y"
            value={formData.button_padding_y || '0.5rem'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900">Animações</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duração da Transição</label>
          <input
            type="text"
            name="hover_transition_duration"
            value={formData.hover_transition_duration || '200ms'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Escala do Hover dos Botões</label>
          <input
            type="text"
            name="button_hover_scale"
            value={formData.button_hover_scale || '1.02'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Escala do Hover dos Cards</label>
          <input
            type="text"
            name="card_hover_scale"
            value={formData.card_hover_scale || '1.01'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contato</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
          <input
            type="tel"
            name="contact_phone"
            value={formData.contact_phone || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
          <input
            type="tel"
            name="contact_whatsapp"
            value={formData.contact_whatsapp || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
        <textarea
          name="contact_address"
          value={formData.contact_address || ''}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
          <input
            type="url"
            name="facebook_url"
            value={formData.facebook_url || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
          <input
            type="url"
            name="instagram_url"
            value={formData.instagram_url || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
          <input
            type="url"
            name="twitter_url"
            value={formData.twitter_url || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
          <input
            type="url"
            name="youtube_url"
            value={formData.youtube_url || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSeoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
          <input
            type="text"
            name="meta_title"
            value={formData.meta_title || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
          <input
            type="text"
            name="meta_keywords"
            value={formData.meta_keywords || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
        <textarea
          name="meta_description"
          value={formData.meta_description || ''}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
          <input
            type="text"
            name="google_analytics_id"
            value={formData.google_analytics_id || ''}
            onChange={handleInputChange}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
          <input
            type="text"
            name="facebook_pixel_id"
            value={formData.facebook_pixel_id || ''}
            onChange={handleInputChange}
            placeholder="123456789012345"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Textos Personalizados</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão "Adicionar ao Carrinho"</label>
          <input
            type="text"
            name="button_add_to_cart_text"
            value={formData.button_add_to_cart_text || 'Adicionar ao Carrinho'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão "Comprar Agora"</label>
          <input
            type="text"
            name="button_buy_now_text"
            value={formData.button_buy_now_text || 'Comprar Agora'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem de Carrinho Vazio</label>
          <input
            type="text"
            name="message_empty_cart_text"
            value={formData.message_empty_cart_text || 'Seu carrinho está vazio'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem de Nenhum Produto</label>
          <input
            type="text"
            name="message_no_products_text"
            value={formData.message_no_products_text || 'Nenhum produto encontrado'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Rodapé</label>
        <textarea
          name="footer_text"
          value={formData.footer_text || ''}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-8">Funcionalidades</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="enable_reviews"
            checked={formData.enable_reviews || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Habilitar Avaliações</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="enable_wishlist"
            checked={formData.enable_wishlist || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Habilitar Lista de Desejos</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="enable_dark_mode"
            checked={formData.enable_dark_mode || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Modo Escuro</label>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className={`bg-white rounded-lg shadow-lg ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
        <div 
          className="p-4 text-white rounded-t-lg"
          style={{ backgroundColor: formData.primary_color || '#3b82f6' }}
        >
          <h4 className="text-lg font-semibold">{formData.store_name || 'Nome da Loja'}</h4>
          <p className="text-sm opacity-90">{formData.store_slogan || 'Slogan da loja'}</p>
        </div>
        
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 
              className="font-semibold mb-2"
              style={{ 
                color: formData.product_title_color || '#111827',
                fontSize: formData.product_title_font_size || '1.25rem'
              }}
            >
              Produto de Exemplo
            </h5>
            <p 
              className="text-sm mb-2"
              style={{ 
                color: formData.product_description_color || '#6b7280',
                fontSize: formData.product_description_font_size || '0.875rem'
              }}
            >
              Descrição do produto de exemplo para visualização
            </p>
            <p 
              className="font-bold"
              style={{ 
                color: formData.product_price_color || '#3b82f6',
                fontSize: formData.product_price_font_size || '1.5rem'
              }}
            >
              R$ 99,90
            </p>
          </div>
          
          <button
            className="w-full py-2 px-4 rounded font-medium transition-all"
            style={{
              backgroundColor: formData.button_primary_bg_color || '#3b82f6',
              color: formData.button_primary_text_color || '#ffffff',
              borderRadius: formData.button_border_radius || '6px',
              padding: `${formData.button_padding_y || '0.5rem'} ${formData.button_padding_x || '1rem'}`
            }}
          >
            {formData.button_add_to_cart_text || 'Adicionar ao Carrinho'}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações da Loja</h1>
        <p className="text-gray-600 mt-2">Personalize completamente a aparência e funcionalidades da sua loja</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Preview */}
          <div className="mt-6">
            {renderPreview()}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'basic' && renderBasicTab()}
            {activeTab === 'design' && renderDesignTab()}
            {activeTab === 'typography' && renderTypographyTab()}
            {activeTab === 'layout' && renderLayoutTab()}
            {activeTab === 'contact' && renderContactTab()}
            {activeTab === 'social' && renderSocialTab()}
            {activeTab === 'seo' && renderSeoTab()}
            {activeTab === 'advanced' && renderAdvancedTab()}

            <div className="mt-8 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{loading ? 'Salvando...' : 'Salvar Configurações'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};