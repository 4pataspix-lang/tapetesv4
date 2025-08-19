import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Zap, Heart, Star, Phone } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../contexts/StoreContext';

export const Home: React.FC = () => {
  const { settings, products } = useStore();
  // Exibe apenas produtos em destaque
  const filteredProducts = products?.filter((p: any) => p.featured) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* HERO NOVO */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-green-400 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center z-10 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg animate-fade-in">Transforme seu ambiente com tapetes exclusivos</h1>
          <p className="text-lg md:text-2xl mb-6 opacity-90 max-w-2xl mx-auto animate-fade-in delay-100">Descubra conforto, estilo e praticidade para sua casa. Frete grátis para todo Brasil e pagamento seguro!</p>
          <Link to="/products" className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 transition-all text-lg animate-bounce-once">Ver Produtos</Link>
        </div>
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-green-400 bg-opacity-30 rounded-full blur-2xl -z-1 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-400 bg-opacity-20 rounded-full blur-2xl -z-1 animate-pulse" />
      </section>

      {/* VANTAGENS */}
      <section className="py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center border border-blue-100 animate-fade-in">
            <Award className="h-10 w-10 text-green-500 mb-2" />
            <h3 className="font-bold text-blue-900 mb-1">Garantia de Qualidade</h3>
            <p className="text-blue-800 text-sm">Produtos testados, aprovados e com 1 ano de garantia.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center border border-blue-100 animate-fade-in delay-100">
            <Zap className="h-10 w-10 text-blue-500 mb-2" />
            <h3 className="font-bold text-blue-900 mb-1">Entrega Rápida & Frete Grátis</h3>
            <p className="text-blue-800 text-sm">Receba em casa, sem custo, em até 7 dias úteis para todo Brasil.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center border border-blue-100 animate-fade-in delay-200">
            <Heart className="h-10 w-10 text-pink-500 mb-2" />
            <h3 className="font-bold text-blue-900 mb-1">Atendimento Humanizado</h3>
            <p className="text-blue-800 text-sm">Suporte rápido via WhatsApp e satisfação garantida.</p>
          </div>
        </div>
      </section>

      {/* GRID DE PRODUTOS */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight animate-fade-in">Produtos em Destaque</h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-blue-700">Nenhum produto em destaque.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredProducts.slice(0, 9).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">O que nossos clientes dizem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 animate-fade-in">
              <div className="flex items-center mb-2"><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /></div>
              <p className="text-blue-900 text-sm mb-2">“Amei o tapete, chegou super rápido e é muito confortável!”</p>
              <span className="text-xs text-blue-700 font-bold">— Juliana, SP</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 animate-fade-in delay-100">
              <div className="flex items-center mb-2"><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /></div>
              <p className="text-blue-900 text-sm mb-2">“Ótimo atendimento e produto de qualidade, recomendo!”</p>
              <span className="text-xs text-blue-700 font-bold">— Carlos, RJ</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 animate-fade-in delay-200">
              <div className="flex items-center mb-2"><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /><Star className="h-5 w-5 text-yellow-400" /></div>
              <p className="text-blue-900 text-sm mb-2">“Superou minhas expectativas, voltarei a comprar!”</p>
              <span className="text-xs text-blue-700 font-bold">— Fernanda, MG</span>
            </div>
          </div>
        </div>
      </section>

      {/* SELO DE SEGURANÇA E WHATSAPP */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4">
            <img src="/public/lock.svg" alt="Selo de Segurança" className="h-10 w-10" />
            <span className="text-blue-900 font-bold text-lg">Ambiente 100% Seguro</span>
          </div>
          <a href="https://wa.me/SEUNUMEROAQUI" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg transition-all animate-bounce-once">
            <Phone className="h-5 w-5" /> Fale com um especialista no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};