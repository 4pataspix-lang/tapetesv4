import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Store } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';

export const Header: React.FC = () => {
  const { getItemCount } = useCart();
  const { settings } = useStore();
  const itemCount = getItemCount();

  return (
    <>
      {/* Banner Personalizado */}
      {settings?.header_banner_url && (
        <div className="w-full flex justify-center items-center bg-white py-1 banner-outer" style={{overflow: 'hidden', padding: 0, margin: 0}}>
          <img
            src={settings.header_banner_url}
            alt="Banner do header"
            className="header-banner"
          />
        </div>
      )}

      <header className="shadow-md sticky top-0 z-40" style={{ backgroundColor: settings?.header_background_color || '#ffffff' }}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url} 
                alt={settings.store_name}
                className="h-8 sm:h-12 w-auto max-w-32 sm:max-w-48 object-contain"
              />
            ) : (
              <Store className="h-8 sm:h-12 w-8 sm:w-12" style={{ color: settings?.primary_color || '#3b82f6' }} />
            )}
            <span className="text-lg sm:text-xl font-bold" style={{ color: settings?.header_text_color || '#111827' }}>
              {settings?.store_name}
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: settings?.search_icon_color || '#6b7280' }} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ 
                  backgroundColor: settings?.input_background_color || '#ffffff',
                  borderColor: settings?.input_border_color || '#d1d5db',
                  borderRadius: settings?.input_border_radius || '6px'
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 transition-colors" style={{ color: '#061540' }}>
              <ShoppingCart 
                className="h-6 w-6" 
              />
              {itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  style={{ backgroundColor: '#061540' }}
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      </header>
    </>
  );
};