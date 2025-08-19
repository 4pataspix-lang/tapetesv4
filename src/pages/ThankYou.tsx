import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, Home, ShoppingBag, Star, Shield, Award, Headphones } from 'lucide-react';
import { checkPaymentStatus } from '../lib/nivusPay';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useStore } from '../contexts/StoreContext';

export const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings } = useStore();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'checking' | 'paid' | 'pending' | 'failed'>('checking');

  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    verifyPaymentAndOrder();
    
    // Verificar pagamento a cada 5 segundos se estiver pendente
    const interval = setInterval(() => {
      if (paymentStatus === 'pending' || paymentStatus === 'checking') {
        verifyPaymentAndOrder();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, paymentId]);

  const verifyPaymentAndOrder = async () => {
    try {
      console.log('🔄 Verificando pagamento e pedido...');
      
      // Buscar dados do pedido
      if (isSupabaseConfigured() && supabase) {
        const { data: order, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              product:products(*)
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrderData(order);

        // Se tem payment_id, verificar status do pagamento
        if (paymentId && order.payment_id) {
          try {
            const paymentStatusData = await checkPaymentStatus(order.payment_id);
            console.log('💳 Status do pagamento:', paymentStatusData);

            // Verificar se foi aprovado
            if (paymentStatusData.status === 'approved' || paymentStatusData.status === 'paid') {
              setPaymentVerified(true);
              setPaymentStatus('paid');
              
              // Atualizar status do pedido para confirmado
              await supabase
                .from('orders')
                .update({ 
                  status: 'confirmed',
                  payment_status: 'paid'
                })
                .eq('id', orderId);
                
              console.log('✅ Pagamento aprovado e pedido confirmado!');
            } else if (paymentStatusData.status === 'pending') {
              setPaymentStatus('pending');
            } else {
              setPaymentStatus('failed');
            }
          } catch (paymentError) {
            console.warn('⚠️ Erro ao verificar pagamento:', paymentError);
            setPaymentStatus('pending');
          }
        } else {
          // Se não tem payment_id, considerar como pendente
          setPaymentStatus('pending');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar pedido:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificando seu pagamento...</h2>
          <p className="text-gray-600">Aguarde enquanto confirmamos seu pedido</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido não encontrado</h2>
          <p className="text-gray-600 mb-6">Não foi possível encontrar os dados do seu pedido.</p>
          <Link
            to="/"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar à Loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de Sucesso */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ backgroundColor: `${settings?.success_color || '#10b981'}20` }}>
            <CheckCircle className="h-16 w-16" style={{ color: settings?.success_color || '#10b981' }} />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: settings?.text_color || '#111827' }}>
            {paymentVerified ? '🎉 Pagamento Aprovado!' : '📋 Pedido Recebido!'}
          </h1>
          <p className="text-xl" style={{ color: settings?.product_description_color || '#6b7280' }}>
            {paymentVerified 
              ? 'Seu pagamento foi processado com sucesso e seu pedido está confirmado.'
              : 'Recebemos seu pedido e você receberá atualizações por email.'
            }
          </p>
        </div>

        {/* Seções de Confiança e Autoridade */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${settings?.success_color || '#10b981'}20` }}>
              <Shield className="h-8 w-8" style={{ color: settings?.success_color || '#10b981' }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: settings?.text_color || '#111827' }}>100% Seguro</h3>
            <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>
              Seus dados estão protegidos com criptografia SSL
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${settings?.primary_color || '#3b82f6'}20` }}>
              <Award className="h-8 w-8" style={{ color: settings?.primary_color || '#3b82f6' }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: settings?.text_color || '#111827' }}>Qualidade Garantida</h3>
            <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>
              Produtos de alta qualidade com garantia de satisfação
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${settings?.secondary_color || '#10b981'}20` }}>
              <Truck className="h-8 w-8" style={{ color: settings?.secondary_color || '#10b981' }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: settings?.text_color || '#111827' }}>Entrega Rápida</h3>
            <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>
              Receba em até {settings?.estimated_delivery_days || 7} dias úteis
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${settings?.accent_color || '#f59e0b'}20` }}>
              <Headphones className="h-8 w-8" style={{ color: settings?.accent_color || '#f59e0b' }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: settings?.text_color || '#111827' }}>Suporte 24/7</h3>
            <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>
              Estamos aqui para ajudar sempre que precisar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Pedido */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Package className="h-6 w-6" style={{ color: settings?.primary_color || '#3b82f6' }} />
                <h2 className="text-2xl font-bold" style={{ color: settings?.text_color || '#111827' }}>Detalhes do Pedido</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium" style={{ color: settings?.product_description_color || '#6b7280' }}>Número do Pedido</p>
                  <p className="text-2xl font-bold" style={{ color: settings?.text_color || '#111827' }}>#{orderData.id.slice(-8)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium" style={{ color: settings?.product_description_color || '#6b7280' }}>Data do Pedido</p>
                  <p className="text-lg font-semibold" style={{ color: settings?.text_color || '#111827' }}>
                    {new Date(orderData.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium" style={{ color: settings?.product_description_color || '#6b7280' }}>Status</p>
                  <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${
                    paymentVerified 
                      ? 'text-white' 
                      : 'text-white'
                  }`} style={{ 
                    backgroundColor: paymentVerified 
                      ? settings?.success_color || '#10b981'
                      : settings?.warning_color || '#f59e0b'
                  }}>
                    {paymentVerified ? '✅ Confirmado' : '⏳ Aguardando Pagamento'}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium" style={{ color: settings?.product_description_color || '#6b7280' }}>Total</p>
                  <p className="text-2xl font-bold" style={{ color: settings?.product_price_color || '#3b82f6' }}>
                    R$ {Number(orderData.total_amount).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4" style={{ color: settings?.text_color || '#111827' }}>Informações de Entrega</h3>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                  <p className="font-bold text-lg" style={{ color: settings?.text_color || '#111827' }}>{orderData.customer_name}</p>
                  <p className="text-gray-600 mb-2">{orderData.customer_email}</p>
                  <p className="text-gray-600">{orderData.customer_address}</p>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: settings?.text_color || '#111827' }}>Itens do Pedido</h2>
              <div className="space-y-4">
                {orderData.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="h-20 w-20 rounded-lg object-cover shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg" style={{ color: settings?.product_title_color || '#111827' }}>{item.product?.name}</h4>
                      <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Quantidade: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl" style={{ color: settings?.product_price_color || '#3b82f6' }}>
                        R$ {(item.quantity * Number(item.price)).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar com Próximos Passos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-6" style={{ color: settings?.text_color || '#111827' }}>Próximos Passos</h3>
              
              <div className="space-y-6">
                {paymentVerified ? (
                  <>
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: settings?.success_color || '#10b981' }}>
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: settings?.text_color || '#111827' }}>Pagamento Confirmado</p>
                        <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Seu pagamento foi processado com sucesso</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}>
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: settings?.text_color || '#111827' }}>Preparando Pedido</p>
                        <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Seu pedido está sendo preparado para envio</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: settings?.secondary_color || '#10b981' }}>
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: settings?.text_color || '#111827' }}>Envio</p>
                        <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Você receberá o código de rastreamento em breve</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: settings?.warning_color || '#f59e0b' }}>
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold" style={{ color: settings?.text_color || '#111827' }}>Aguardando Pagamento</p>
                      <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Complete o pagamento para confirmar seu pedido</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Estimativa de Entrega */}
              <div className="mt-6 p-6 rounded-lg" style={{ backgroundColor: `${settings?.primary_color || '#3b82f6'}10` }}>
                <div className="flex items-center space-x-2 mb-3">
                  <Truck className="h-6 w-6" style={{ color: settings?.primary_color || '#3b82f6' }} />
                  <span className="font-bold" style={{ color: settings?.text_color || '#111827' }}>Entrega Estimada</span>
                </div>
                <p className="text-sm font-medium" style={{ color: settings?.product_description_color || '#6b7280' }}>
                  {paymentVerified 
                    ? `${settings?.estimated_delivery_days || 7} dias úteis após a confirmação`
                    : 'Após a confirmação do pagamento'
                  }
                </p>
              </div>

              {/* Ações */}
              <div className="mt-6 space-y-4">
                <Link
                  to="/"
                  className="w-full py-4 px-6 rounded-lg font-bold text-center block transition-all hover:scale-105 shadow-lg"
                  style={{ 
                    backgroundColor: settings?.button_primary_bg_color || '#3b82f6',
                    color: settings?.button_primary_text_color || '#ffffff'
                  }}
                >
                  🏠 Voltar à Loja
                </Link>
                
                <Link
                  to="/products"
                  className="w-full py-4 px-6 rounded-lg font-bold text-center block transition-all hover:scale-105 shadow-lg"
                  style={{ 
                    backgroundColor: settings?.button_secondary_bg_color || '#6b7280',
                    color: settings?.button_secondary_text_color || '#ffffff'
                  }}
                >
                  🛍️ Continuar Comprando
                </Link>
              </div>

              {/* Garantias */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5" style={{ color: settings?.success_color || '#10b981' }} />
                  <span className="text-sm font-medium" style={{ color: settings?.text_color || '#111827' }}>Garantia de 30 dias</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5" style={{ color: settings?.primary_color || '#3b82f6' }} />
                  <span className="text-sm font-medium" style={{ color: settings?.text_color || '#111827' }}>Compra 100% segura</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Headphones className="h-5 w-5" style={{ color: settings?.secondary_color || '#10b981' }} />
                  <span className="text-sm font-medium" style={{ color: settings?.text_color || '#111827' }}>Suporte especializado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Autoridade */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4" style={{ color: settings?.text_color || '#111827' }}>
              Por que escolher {settings?.store_name}?
            </h3>
            <p className="text-lg" style={{ color: settings?.product_description_color || '#6b7280' }}>
              Somos referência em qualidade e atendimento
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: settings?.primary_color || '#3b82f6' }}>10k+</div>
              <p className="font-semibold" style={{ color: settings?.text_color || '#111827' }}>Clientes Satisfeitos</p>
              <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Mais de 10 mil pessoas confiam em nós</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: settings?.success_color || '#10b981' }}>99%</div>
              <p className="font-semibold" style={{ color: settings?.text_color || '#111827' }}>Taxa de Satisfação</p>
              <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Avaliação média de 4.9 estrelas</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: settings?.accent_color || '#f59e0b' }}>5 anos</div>
              <p className="font-semibold" style={{ color: settings?.text_color || '#111827' }}>No Mercado</p>
              <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>Experiência e tradição em vendas</p>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6" style={{ color: settings?.text_color || '#111827' }}>Informações Importantes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: settings?.primary_color || '#3b82f6' }}>
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: settings?.text_color || '#111827' }}>📧 Confirmação por Email</h4>
                  <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>
                    Enviamos um email de confirmação para <strong>{orderData.customer_email}</strong> 
                    com todos os detalhes do seu pedido.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: settings?.secondary_color || '#10b981' }}>
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: settings?.text_color || '#111827' }}>📱 Acompanhamento</h4>
                  <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>
                    Você receberá atualizações sobre o status do seu pedido por email e SMS.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: settings?.accent_color || '#f59e0b' }}>
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: settings?.text_color || '#111827' }}>🚚 Entrega</h4>
                  <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>
                    Frete grátis para todo Brasil. Prazo de entrega: {settings?.estimated_delivery_days || 7} dias úteis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: settings?.success_color || '#10b981' }}>
                  <Headphones className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: settings?.text_color || '#111827' }}>💬 Suporte</h4>
                  <p className="text-sm" style={{ color: settings?.product_description_color || '#6b7280' }}>
                    Dúvidas? Entre em contato: {settings?.contact_email || settings?.contact_phone || 'suporte@loja.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer da Página */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r rounded-lg" style={{ 
          background: `linear-gradient(135deg, ${settings?.primary_color || '#3b82f6'}20, ${settings?.secondary_color || '#10b981'}20)`
        }}>
          <h3 className="text-2xl font-bold mb-2" style={{ color: settings?.text_color || '#111827' }}>
            Obrigado por escolher {settings?.store_name}! 🎉
          </h3>
          <p className="text-lg" style={{ color: settings?.product_description_color || '#6b7280' }}>
            Sua confiança é nosso maior prêmio
          </p>
        </div>
      </div>
    </div>
  );
};