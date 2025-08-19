import React, { useState } from 'react';
import Stepper from '../components/Stepper';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, User, Calendar, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { createPayment, createCardToken, validateCPF, formatCPF, formatPhone } from '../lib/nivusPay';

export const Checkout: React.FC = () => {
  const steps = ['Dados', 'Entrega', 'Pagamento', 'Confirmação'];
  const [currentStep, setCurrentStep] = useState(0);
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerCpf: '',
    customerPhone: '',
    // Endereço separado
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'PIX',
  });
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardCvv: '',
    cardExpirationMonth: '',
    cardExpirationYear: '',
    holderName: '',
    installments: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Formatação automática para CPF e telefone
    if (name === 'customerCpf') {
      const formatted = formatCPF(value);
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    if (name === 'customerPhone') {
      const formatted = formatPhone(value);
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    if (name === 'zipCode') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    if (name === 'paymentMethod') {
      setShowCardForm(value === 'CREDIT_CARD');
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatação do número do cartão
    if (name === 'cardNumber') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      setCardData({ ...cardData, [name]: formatted });
      return;
    }
    
    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('🚀 Iniciando processo de checkout...');

    if (!isSupabaseConfigured()) {
      alert('Sistema de pagamento não configurado. Entre em contato com o suporte.');
      setLoading(false);
      return;
    }

    try {
      // Validar CPF
      if (!validateCPF(formData.customerCpf)) {
        throw new Error('CPF inválido');
      }
      
      console.log('📝 Dados do formulário:', formData);
      console.log('🛒 Itens do carrinho:', items);
      console.log('💰 Total:', total);
      
      // Verificar se Supabase está configurado
      if (!supabase) {
        throw new Error('Supabase não está configurado');
      }

      console.log('📦 Criando pedido no Supabase...');
      
      // Montar endereço completo
      const fullAddress = `${formData.street}, ${formData.number}${formData.complement ? ', ' + formData.complement : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, CEP: ${formData.zipCode}`;
      
      // Criar pedido primeiro
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          customer_cpf: formData.customerCpf,
          customer_address: fullAddress,
          shipping_cost: 0,
          total_amount: total,
          payment_method: formData.paymentMethod.toLowerCase(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('❌ Erro ao criar pedido:', orderError);
        throw new Error(`Erro ao criar pedido: ${orderError.message}`);
      }

      console.log('✅ Pedido criado com ID:', orderData.id);

      // Criar itens do pedido separadamente
      const orderItemsData = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      }));

      console.log('📦 Criando itens do pedido:', orderItemsData);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) {
        console.error('❌ Erro ao criar itens do pedido:', itemsError);
        // Tentar excluir o pedido criado se houver erro nos itens
        await supabase.from('orders').delete().eq('id', orderData.id).select();
        throw new Error(`Erro ao criar itens do pedido: ${itemsError.message}`);
      }

      console.log('✅ Itens do pedido criados com sucesso');

      // Processar pagamento com Nivus Pay
      console.log('💳 Processando pagamento com Nivus Pay...');
      
      let creditCardToken = undefined;
      
      // Se for cartão de crédito, criar token primeiro
      if (formData.paymentMethod === 'CREDIT_CARD') {
        console.log('🔐 Criando token do cartão...');
        
        const tokenResult = await createCardToken({
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          cardCvv: cardData.cardCvv,
          cardExpirationMonth: cardData.cardExpirationMonth,
          cardExpirationYear: cardData.cardExpirationYear,
          holderName: cardData.holderName || formData.customerName,
          holderDocument: formData.customerCpf.replace(/\D/g, ''),
        });
        
        if (!tokenResult.success) {
          throw new Error(tokenResult.error || 'Erro ao processar dados do cartão');
        }
        
        creditCardToken = tokenResult.token;
        console.log('✅ Token do cartão criado');
      }
      
      const paymentData = {
        amount: total,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerCpf: formData.customerCpf.replace(/\D/g, ''),
        customerPhone: formData.customerPhone.replace(/\D/g, ''),
        orderId: orderData.id,
        items: items,
        paymentMethod: formData.paymentMethod as 'PIX' | 'CREDIT_CARD' | 'BILLET',
        creditCardToken,
        installments: cardData.installments,
      };

      const paymentResult = await createPayment(paymentData);
      console.log('Resultado do pagamento:', paymentResult);

      if (paymentResult.success) {
        console.log('✅ Pagamento criado com sucesso!');
        
        // Limpar carrinho
        clearCart();
        
        // Atualizar pedido com ID do pagamento
        if (paymentResult.paymentId) {
          await supabase
            .from('orders')
            .update({
              payment_id: paymentResult.paymentId,
              payment_method: formData.paymentMethod.toLowerCase()
            })
            .eq('id', orderData.id);
        }
        
        // Redirecionar para página de confirmação
        console.log('🔄 Redirecionando para confirmação com pedido:', orderData.id);
        // Se for PIX, ir para página de confirmação com QR Code
        if (formData.paymentMethod === 'PIX') {
          navigate('/order-confirmation', { 
            state: { 
              orderId: orderData.id,
              pixCode: paymentResult.pixCode,
              pixQrCode: paymentResult.pixQrCode,
              paymentId: paymentResult.paymentId,
              paymentMethod: formData.paymentMethod,
              expiresAt: paymentResult.expiresAt
            } 
          });
        } else {
          // Para outros métodos, ir direto para página de obrigado
          navigate('/thank-you', {
            search: `?orderId=${orderData.id}&paymentId=${paymentResult.paymentId}`
          });
        }
        return;
      } else {
        const errorMsg = paymentResult.error || 'Erro ao processar pagamento';
        console.error('❌ Erro no pagamento:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('❌ Erro completo no checkout:', {
        message: error.message,
        stack: error.stack
      });
      alert(`Erro ao finalizar pedido: ${error.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-4 text-center tracking-tight">Checkout</h1>
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100 animate-fade-in">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Dados Pessoais */}
                {currentStep === 0 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Dados Pessoais</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Nome Completo</label>
                        <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 text-blue-900 font-semibold" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Email</label>
                        <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} required className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 text-blue-900 font-semibold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">CPF</label>
                        <input type="text" name="customerCpf" value={formData.customerCpf} onChange={handleInputChange} required placeholder="000.000.000-00" maxLength={14} className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 text-blue-900 font-semibold" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">Telefone</label>
                        <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} required placeholder="(11) 99999-9999" className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 text-blue-900 font-semibold" />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <button type="button" onClick={() => setCurrentStep(1)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all text-lg">Próximo</button>
                    </div>
                  </div>
                )}

                {/* Step 2: Endereço de Entrega */}
                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Endereço de Entrega</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ...inputs de endereço, igual antes... */}
                      {/* ...existing code... */}
                    </div>
                    <div className="flex justify-between mt-6">
                      <button type="button" onClick={() => setCurrentStep(0)} className="bg-gray-200 hover:bg-gray-300 text-blue-900 font-bold py-3 px-8 rounded-xl shadow transition-all text-lg">Voltar</button>
                      <button type="button" onClick={() => setCurrentStep(2)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all text-lg">Próximo</button>
                    </div>
                  </div>
                )}

                {/* Step 3: Pagamento */}
                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center space-x-2 mb-4">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Pagamento</h3>
                    </div>
                    {/* ...opções de pagamento e formulário de cartão, igual antes... */}
                    {/* ...existing code... */}
                    <div className="flex justify-between mt-6">
                      <button type="button" onClick={() => setCurrentStep(1)} className="bg-gray-200 hover:bg-gray-300 text-blue-900 font-bold py-3 px-8 rounded-xl shadow transition-all text-lg">Voltar</button>
                      <button type="button" onClick={() => setCurrentStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all text-lg">Próximo</button>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmação */}
                {currentStep === 3 && (
                  <div className="animate-fade-in text-center">
                    <div className="flex flex-col items-center justify-center mb-6">
                      <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <h3 className="text-2xl font-bold text-green-700 mb-2">Pedido pronto para finalizar!</h3>
                      <p className="text-blue-900 mb-4">Confira seus dados e clique para concluir seu pedido.</p>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-400 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-green-500 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      {loading ? 'Processando...' : 'Finalizar Pedido'}
                    </button>
                  </div>
                )}

                {/* Pagamento */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Método de Pagamento</h3>
                  </div>
                  
                  <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PIX */}
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === 'PIX' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, paymentMethod: 'PIX' })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">PIX</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">PIX</h4>
                            <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          formData.paymentMethod === 'PIX' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {formData.paymentMethod === 'PIX' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Cartão de Crédito */}
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === 'CREDIT_CARD' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, paymentMethod: 'CREDIT_CARD' })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-800 rounded flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Cartão de Crédito</h4>
                            <p className="text-sm text-gray-600">Pague em até 12x</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          formData.paymentMethod === 'CREDIT_CARD' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {formData.paymentMethod === 'CREDIT_CARD' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informações sobre o método de pagamento */}
                  {formData.paymentMethod === 'PIX' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800">Vantagens do PIX</span>
                      </div>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Pagamento instantâneo 24h por dia</li>
                        <li>• Sem taxas adicionais</li>
                        <li>• Frete grátis para todo Brasil</li>
                        <li>• Confirmação imediata</li>
                        <li>• Seguro e prático</li>
                      </ul>
                    </div>
                  )}
                  {formData.paymentMethod === 'CREDIT_CARD' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">Vantagens do Cartão de Crédito</span>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Pague em até 12x</li>
                        <li>• Processamento seguro</li>
                        <li>• Aprovação rápida</li>
                        <li>• Aceita as principais bandeiras</li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      {formData.paymentMethod === 'PIX' ? (
                        <>
                          <div className="w-6 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-xs">PIX</span>
                          </div>
                          <span className="font-semibold">Finalizar Pedido com PIX</span>
                        </>
                      ) : (
                        <>
                          <div className="w-6 h-4 bg-gradient-to-r from-blue-500 to-blue-800 rounded flex items-center justify-center mr-2">
                            <CreditCard className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold">Finalizar Pedido com Cartão</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Resumo do Pedido Fixo */}
          <div className="lg:col-span-1 sticky top-8 h-fit">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-xl p-6 border border-blue-200 animate-fade-in">
              <h3 className="text-xl font-extrabold text-blue-900 mb-4 text-center tracking-tight">Resumo do Pedido</h3>
              <div className="divide-y divide-blue-200 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-base font-semibold text-blue-900">{item.name}</p>
                      <p className="text-xs text-blue-600">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-base font-bold text-blue-800">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-900">Total:</span>
                  <span className="text-2xl font-extrabold text-green-600 drop-shadow price-display">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};