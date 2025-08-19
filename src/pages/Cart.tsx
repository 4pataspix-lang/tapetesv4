import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';

export const Cart: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const { settings } = useStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-blue-200 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2">
            {settings?.message_empty_cart_text || 'Seu carrinho está vazio'}
          </h2>
          <p className="text-blue-800 mb-6">Adicione alguns produtos para começar suas compras!</p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition-all"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">Seu Carrinho</h1>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="divide-y divide-blue-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex items-center gap-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-blue-100"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-900 line-clamp-2">{item.name}</h3>
                  <p className="text-blue-700 font-semibold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-blue-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-900">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 p-6 border-t border-blue-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-blue-900">Total:</span>
              <span className="text-2xl font-extrabold text-blue-700">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-white border border-blue-600 text-blue-700 font-bold px-6 py-3 rounded-xl shadow hover:bg-blue-50 text-lg text-center flex-1"
              >
                {settings?.button_continue_shopping_text || 'Continuar Comprando'}
              </Link>
              <Link
                to="/checkout"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow text-lg text-center flex-1"
              >
                {settings?.button_checkout_text || 'Finalizar Pedido'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};