import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../contexts/StoreContext';

export const Products: React.FC = () => {
  const { products, categories, loading } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter((p: any) =>
    (selectedCategory === 'all' || p.category_id === selectedCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-700 text-xl">Carregando produtos...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">Todos os Produtos</h1>
        <p className="text-lg text-blue-800 mb-8 text-center">Encontre o tapete perfeito para seu ambiente</p>

        {/* Filtros modernos */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none w-full md:w-80 bg-white shadow-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            <button
              className={`px-5 py-2 rounded-xl font-semibold border transition-all whitespace-nowrap ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                className={`px-5 py-2 rounded-xl font-semibold border transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de produtos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-blue-700 text-lg">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}