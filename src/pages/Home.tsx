import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Phone, Mail, ChevronLeft, ChevronRight, Star, Award, Heart, Zap } from 'lucide-react';
import { supabase, Product, Category, isSupabaseConfigured, getSupabaseStatus } from '../lib/supabase';
import { mockProducts, mockCategories } from '../lib/mockData';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../contexts/StoreContext';

export const Home: React.FC = () => {
  const { settings } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    // Debug Supabase configuration in development
    if (import.meta.env.DEV) {
      console.log('🔧 Supabase Status:', getSupabaseStatus());
      if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase não configurado. Usando dados de demonstração.');
        console.info('📖 Veja SUPABASE_INTEGRATION.md para instruções de configuração.');
      }
    }
  }, []);

  const fetchProducts = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using mock product data.');
      setProducts(mockProducts);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Fallback para dados mock em caso de erro
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using mock category data.');
      setCategories(mockCategories);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Fallback para dados mock em caso de erro
      setCategories(mockCategories);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category_id === selectedCategory);

  const scrollContainer = (containerId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="text-white py-8 sm:py-12 md:py-20 hero-banner"
        style={{
          background: settings?.banner_url 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${settings.banner_url})`
            : `linear-gradient(to right, ${settings?.primary_color || '#3b82f6'}, ${settings?.secondary_color || '#10b981'})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hero-content">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            {settings?.welcome_message || `Bem-vindo à ${settings?.store_name}`}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 opacity-90 max-w-4xl mx-auto leading-relaxed">
            {settings?.store_description}
          </p>
          {settings?.store_slogan && (
            <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-80 italic max-w-3xl mx-auto">
              "{settings.store_slogan}"
            </p>
          )}
          <Link 
            to="/products"
            className="bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            style={{ color: settings?.primary_color || '#3b82f6' }}
          >
            Ver Produtos
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="categories-container">
            <div className="categories-scroll">
              <button
                onClick={() => setSelectedCategory('all')}
                className="category-button"
                style={
                  selectedCategory === 'all'
                    ? { backgroundColor: settings?.primary_color || '#3b82f6', color: 'white' }
                    : { backgroundColor: '#e5e7eb', color: '#374151' }
                }
              >
                Todos os Produtos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="category-button"
                  style={
                    selectedCategory === category.id
                      ? { backgroundColor: settings?.primary_color || '#3b82f6', color: 'white' }
                      : { backgroundColor: '#e5e7eb', color: '#374151' }
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Produtos em Destaque
          </h2>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum produto em destaque.</p>
            </div>
          ) : (
            <>
              {/* Primeira linha - 4 produtos */}
              <div className="product-section mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Mais Vendidos</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => scrollContainer('products-line-1', 'left')}
                      className="scroll-button"
                      style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => scrollContainer('products-line-1', 'right')}
                      className="scroll-button"
                      style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div id="products-line-1" className="product-line">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <div key={product.id} className="product-card-wrapper">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Segunda linha - 3 produtos */}
              {filteredProducts.length > 4 && (
                <div className="product-section">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Novidades</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => scrollContainer('products-line-2', 'left')}
                        className="scroll-button"
                        style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => scrollContainer('products-line-2', 'right')}
                        className="scroll-button"
                        style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div id="products-line-2" className="product-line">
                    {filteredProducts.slice(4, 10).map((product) => (
                      <div key={product.id} className="product-card-wrapper">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="text-white px-8 py-3 rounded-lg transition-colors inline-block"
              style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Por que nossos produtos são especiais */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que nossos produtos são especiais?</h2>
            <p className="text-lg text-gray-600">Cada produto é cuidadosamente selecionado para oferecer a melhor experiência</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110" style={{ backgroundColor: `${settings?.primary_color || '#3b82f6'}20` }}>
                <Award className="h-10 w-10" style={{ color: settings?.primary_color || '#3b82f6' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: settings?.text_color || '#111827' }}>Qualidade Premium</h3>
              <p className="text-gray-600">Produtos rigorosamente testados e aprovados por nossa equipe de especialistas</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110" style={{ backgroundColor: `${settings?.secondary_color || '#10b981'}20` }}>
                <Zap className="h-10 w-10" style={{ color: settings?.secondary_color || '#10b981' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: settings?.text_color || '#111827' }}>Inovação Constante</h3>
              <p className="text-gray-600">Sempre em busca das últimas tendências e tecnologias do mercado</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110" style={{ backgroundColor: `${settings?.accent_color || '#f59e0b'}20` }}>
                <Heart className="h-10 w-10" style={{ color: settings?.accent_color || '#f59e0b' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: settings?.text_color || '#111827' }}>Feito com Amor</h3>
              <p className="text-gray-600">Cada produto é escolhido pensando na satisfação e felicidade dos nossos clientes</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110" style={{ backgroundColor: `${settings?.success_color || '#10b981'}20` }}>
                <Star className="h-10 w-10" style={{ color: settings?.success_color || '#10b981' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: settings?.text_color || '#111827' }}>Avaliação 5 Estrelas</h3>
              <p className="text-gray-600">Mais de 95% dos nossos clientes avaliam nossos produtos com 5 estrelas</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção de Depoimentos */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">O que nossos clientes dizem</h2>
            <p className="text-lg text-gray-600">Mais de 10.000 clientes satisfeitos em todo o Brasil</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Produtos de excelente qualidade! Compro sempre aqui e nunca me decepcionei. Entrega rápida e atendimento nota 10."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">AS</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Ana Silva</p>
                  <p className="text-sm text-gray-500">Cliente há 2 anos</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Melhor loja online que já comprei! Produtos originais, preços justos e entrega super rápida. Recomendo de olhos fechados!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold">JS</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">João Santos</p>
                  <p className="text-sm text-gray-500">Cliente há 3 anos</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Atendimento excepcional e produtos de primeira linha. Já indiquei para toda minha família e amigos!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">MC</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Maria Costa</p>
                  <p className="text-sm text-gray-500">Cliente há 1 ano</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção de Números e Estatísticas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Números que falam por si</h2>
            <p className="text-lg text-gray-600">Nossa trajetória de sucesso em números</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: settings?.primary_color || '#3b82f6' }}>10k+</div>
              <p className="font-semibold text-gray-900">Clientes Satisfeitos</p>
              <p className="text-sm text-gray-600">Em todo o Brasil</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: settings?.success_color || '#10b981' }}>99%</div>
              <p className="font-semibold text-gray-900">Taxa de Satisfação</p>
              <p className="text-sm text-gray-600">Avaliação média 4.9★</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: settings?.accent_color || '#f59e0b' }}>5 anos</div>
              <p className="font-semibold text-gray-900">No Mercado</p>
              <p className="text-sm text-gray-600">Experiência comprovada</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: settings?.secondary_color || '#10b981' }}>24h</div>
              <p className="font-semibold text-gray-900">Suporte</p>
              <p className="text-sm text-gray-600">Atendimento contínuo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="text-white py-12 mt-16"
        style={{ backgroundColor: settings?.text_color || '#111827' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Informações da Loja */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                {settings?.logo_url ? (
                  <img 
                    src={settings.logo_url} 
                    alt={settings.store_name}
                    className="h-8 sm:h-12 w-auto max-w-32 sm:max-w-48 object-contain"
                  />
                ) : (
                  <Store className="h-8 w-8" style={{ color: settings?.primary_color || '#3b82f6' }} />
                )}
                <span className="text-xl font-bold">{settings?.store_name}</span>
              </div>
              <p className="text-gray-300 mb-4">{settings?.store_description}</p>
              {settings?.contact_address && (
                <p className="text-gray-400 text-sm">{settings.contact_address}</p>
              )}
            </div>

            {/* Contato */}
            {(settings?.contact_phone || settings?.contact_email || settings?.contact_whatsapp) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
                <div className="space-y-2 text-gray-300">
                  {settings?.contact_phone && (
                    <p className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{settings.contact_phone}</span>
                    </p>
                  )}
                  {settings?.contact_email && (
                    <p className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{settings.contact_email}</span>
                    </p>
                  )}
                  {settings?.contact_whatsapp && (
                    <p className="text-sm">WhatsApp: {settings.contact_whatsapp}</p>
                  )}
                </div>
              </div>
            )}

            {/* Redes Sociais */}
            {(settings?.facebook_url || settings?.instagram_url || settings?.twitter_url) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Siga-nos</h3>
                <div className="flex space-x-4">
                  {settings?.facebook_url && (
                    <a 
                      href={settings.facebook_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                  {settings?.instagram_url && (
                    <a 
                      href={settings.instagram_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {settings?.twitter_url && (
                    <a 
                      href={settings.twitter_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">{settings?.footer_text}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};