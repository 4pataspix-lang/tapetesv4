import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import { checkPaymentStatus } from '../lib/nivusPay';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [message, setMessage] = useState('Verificando status do pagamento...');

  const paymentId = searchParams.get('paymentId');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!paymentId || !orderId) {
      setStatus('failed');
      setMessage('Informações de pagamento inválidas');
      return;
    }

    checkPayment();
  }, [paymentId, orderId]);

  const checkPayment = async () => {
    try {
      const paymentStatus = await checkPaymentStatus(paymentId!);
      
      // Atualizar status do pedido no Supabase
      if (isSupabaseConfigured()) {
        let orderStatus = 'pending';
        
        switch (paymentStatus.status) {
          case 'approved':
          case 'paid':
            orderStatus = 'confirmed';
            setStatus('success');
            setMessage('Pagamento aprovado com sucesso!');
            break;
          case 'rejected':
          case 'failed':
            orderStatus = 'cancelled';
            setStatus('failed');
            setMessage('Pagamento rejeitado. Tente novamente.');
            break;
          default:
            orderStatus = 'pending';
            setStatus('pending');
            setMessage('Pagamento pendente. Aguarde a confirmação.');
        }

        await supabase
          .from('orders')
          .update({ status: orderStatus })
          .eq('id', orderId);
      }

      // Redirecionar após 3 segundos
      setTimeout(() => {
        if (status === 'success') {
          navigate('/thank-you', { 
            state: { orderId },
            search: `?orderId=${orderId}&paymentId=${paymentId}&verified=true`
          });
        } else {
          navigate('/cart');
        }
      }, 3000);

    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      setStatus('failed');
      setMessage('Erro ao verificar status do pagamento');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader className="h-16 w-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {getIcon()}
        
        <h1 className={`text-2xl font-bold mt-4 mb-2 ${getStatusColor()}`}>
          {status === 'loading' && 'Verificando Pagamento'}
          {status === 'success' && 'Pagamento Aprovado!'}
          {status === 'failed' && 'Pagamento Rejeitado'}
          {status === 'pending' && 'Pagamento Pendente'}
        </h1>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        {status !== 'loading' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/order-confirmation', { state: { orderId } })}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Detalhes do Pedido
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Voltar à Loja
            </button>
          </div>
        )}
      </div>
    </div>
  );
};