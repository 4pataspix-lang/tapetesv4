import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockReviews } from '../lib/mockData';
import { useStore } from '../contexts/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { settings } = useStore();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    fetchProductRating();
  }, [product.id]);

  const fetchProductRating = async () => {
    if (!isSupabaseConfigured()) {
      // Use mock reviews data when Supabase is not configured
      const productReviews = mockReviews.filter(r => r.product_id === product.id);
      if (productReviews.length > 0) {
        const average = productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length;
        setAverageRating(average);
        setReviewCount(productReviews.length);
      } else {
        // Fallback to random data if no mock reviews
        const mockRating = 4 + Math.random();
        const mockCount = Math.floor(Math.random() * 10) + 5;
        setAverageRating(mockRating);
        setReviewCount(mockCount);
      }
      return;
    }

    try {
      const { data: reviews, error } = await supabase!
        .from('reviews')
        .select('rating')
        .eq('product_id', product.id);

      if (error) throw error;

      if (reviews && reviews.length > 0) {
        const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        setAverageRating(average);
        setReviewCount(reviews.length);
      } else {
        // Fallback to mock data if no reviews found
        const mockRating = 4 + Math.random();
        const mockCount = Math.floor(Math.random() * 10) + 5;
        setAverageRating(mockRating);
        setReviewCount(mockCount);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      const mockRating = 4 + Math.random();
      const mockCount = Math.floor(Math.random() * 10) + 5;
      setAverageRating(mockRating);
      setReviewCount(mockCount);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="custom-card overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg h-full flex flex-col">
        <div className="relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ borderRadius: 'var(--card-border-radius) var(--card-border-radius) 0 0' }}
          />
          {product.stock_quantity < 10 && (
            <span 
              className="absolute top-1 left-1 sm:top-2 sm:left-2 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs"
              style={{ backgroundColor: settings?.error_color || '#ef4444' }}
            >
              Últimas unidades
            </span>
          )}
        </div>
        
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 
            className="product-title title-display text-sm sm:text-base md:text-lg mb-2 group-hover:opacity-80 transition-colors line-clamp-2 flex-shrink-0"
          >
            {product.name}
          </h3>
          
          {/* Avaliações */}
          {reviewCount > 0 && (
            <div className="flex items-center space-x-1 mb-2 flex-shrink-0">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`star-icon h-3 w-3 sm:h-4 sm:w-4 ${
                      star <= averageRating
                        ? 'fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span 
                className="text-xs hidden sm:inline"
                style={{ color: settings?.product_description_color || '#6b7280' }}
              >
                {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
          )}
          
          <div className="mb-3 flex-shrink-0">
            <span 
              className="text-xs sm:text-sm"
              style={{ color: settings?.success_color || '#10b981' }}
            >
              ✓ Disponível
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-auto flex-shrink-0">
            <span className="product-price price-display text-base sm:text-lg md:text-xl">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            
            <button
              onClick={handleAddToCart}
              className="btn-primary p-2 flex-shrink-0"
              title={settings?.button_add_to_cart_text || 'Adicionar ao carrinho'}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: 'currentColor' }} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};