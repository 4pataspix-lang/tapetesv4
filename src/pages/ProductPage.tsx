import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { supabase, Product, Review, isSupabaseConfigured } from '../lib/supabase';
import { mockProducts, mockReviews } from '../lib/mockData';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    if (product && !selectedImage) {
      setSelectedImage(product.image_url);
    }
  }, [product, selectedImage]);
  const fetchProduct = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using mock product data.');
      const mockProduct = mockProducts.find(p => p.id === id);
      if (mockProduct) {
        setProduct(mockProduct);
      }
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
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
      setSelectedImage(data.image_url);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using mock reviews data.');
      const productReviews = mockReviews.filter(r => r.product_id === id);
      setReviews(productReviews);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setQuantity(1);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Produto não encontrado</h2>
          <p className="text-gray-600 mt-2">O produto que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Imagem do Produto */}
            <div className="space-y-4">
              {/* Layout: Imagem grande à esquerda, 2 pequenas à direita */}
              <div className="flex space-x-4">
                {/* Imagem Principal Grande */}
                <div className="flex-1">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
                
                {/* Imagens Pequenas Empilhadas */}
                <div className="flex flex-col space-y-2 w-32">
                  <button
                    onClick={() => setSelectedImage(product.image_url)}
                    className={`w-full h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedImage === product.image_url ? 'border-blue-500 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  
                  {/* Primeira imagem adicional */}
                  {product.gallery_images?.[0] && (
                    <button
                      onClick={() => setSelectedImage(product.gallery_images[0])}
                      className={`w-full h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedImage === product.gallery_images[0] ? 'border-blue-500 shadow-md' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={product.gallery_images[0]}
                        alt={`${product.name} - 2`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                  
                  {/* Segunda imagem adicional */}
                  {product.gallery_images?.[1] && (
                    <button
                      onClick={() => setSelectedImage(product.gallery_images[1])}
                      className={`w-full h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedImage === product.gallery_images[1] ? 'border-blue-500 shadow-md' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={product.gallery_images[1]}
                        alt={`${product.name} - 3`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Detalhes do Produto */}
            <div className="space-y-6">
              <div>
                <h1 className="product-title text-3xl mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= averageRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {averageRating.toFixed(1)} ({reviews.length} avaliações)
                  </span>
                </div>

                <div className="mb-6">
                  <span className="product-price text-4xl">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓ Em estoque</span>
                <span className="text-gray-500">({product.stock_quantity} unidades)</span>
              </div>

              {/* Controle de Quantidade */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantidade:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Botões */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    addToCart(product);
                    navigate('/checkout');
                  }}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Comprar Agora
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>

              {/* Descrição do Produto */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição do Produto</h3>
                <p className="product-description leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Seções de Confiança */}
          <div className="border-t bg-gray-50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${settings?.success_color || '#10b981'}20` }}>
                  <svg className="w-8 h-8" style={{ color: settings?.success_color || '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: settings?.text_color || '#111827' }}>Garantia de Qualidade</h4>
                <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Produtos testados e aprovados com garantia de 1 ano</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${settings?.primary_color || '#3b82f6'}20` }}>
                  <svg className="w-8 h-8" style={{ color: settings?.primary_color || '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: settings?.text_color || '#111827' }}>Entrega Rápida</h4>
                <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Frete grátis para todo Brasil em até 7 dias úteis</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${settings?.secondary_color || '#10b981'}20` }}>
                  <svg className="w-8 h-8" style={{ color: settings?.secondary_color || '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: settings?.text_color || '#111827' }}>Compra Segura</h4>
                <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Pagamento 100% seguro com criptografia SSL</p>
              </div>
            </div>
          </div>

          {/* Avaliações */}
          <div className="border-t p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Avaliações dos Clientes
            </h3>
            
            {reviews.length === 0 ? (
              <p className="text-gray-500">Nenhuma avaliação ainda.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {review.customer_name}
                      </h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600">{review.comment}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};