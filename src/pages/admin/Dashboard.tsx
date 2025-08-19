import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, Calendar, Filter } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface DashboardMetrics {
  totalOrders: number;
  paidOrders: number;
  monthSales: number;
  periodSales: number;
  pendingOrders: number;
  totalProducts: number;
}

type PeriodFilter = 'today' | 'yesterday' | 'week' | 'month' | 'custom';
export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    paidOrders: 0,
    monthSales: 0,
    periodSales: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('today');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchMetrics();
    fetchSalesData();
  }, [periodFilter, customDateRange]);

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    switch (periodFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        break;
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'custom':
        if (customDateRange.startDate && customDateRange.endDate) {
          startDate = new Date(customDateRange.startDate);
          endDate = new Date(customDateRange.endDate + 'T23:59:59');
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return { startDate, endDate };
  };
  const fetchMetrics = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using default metrics.');
      setLoading(false);
      return;
    }

    try {
      const { startDate, endDate } = getDateRange();

      // Total de pedidos
      const { count: totalOrders } = await supabase!
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Pedidos pagos (confirmados, enviados, entregues)
      const { count: paidOrders } = await supabase!
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['confirmed', 'shipped', 'delivered']);

      // Vendas do mês (apenas pedidos confirmados)
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      const { data: monthSalesData } = await supabase!
        .from('orders')
        .select('total_amount')
        .in('status', ['confirmed', 'shipped', 'delivered'])
        .gte('created_at', firstDayOfMonth.toISOString());

      const monthSales = monthSalesData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

      // Vendas do período selecionado (apenas pedidos confirmados)
      const { data: periodSalesData } = await supabase!
        .from('orders')
        .select('total_amount')
        .in('status', ['confirmed', 'shipped', 'delivered'])
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const periodSales = periodSalesData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

      // Pedidos pendentes
      const { count: pendingOrders } = await supabase!
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Total de produtos
      const { count: totalProducts } = await supabase!
        .from('products')
        .select('*', { count: 'exact', head: true });

      setMetrics({
        totalOrders: totalOrders || 0,
        paidOrders: paidOrders || 0,
        monthSales,
        periodSales,
        pendingOrders: pendingOrders || 0,
        totalProducts: totalProducts || 0,
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = () => {
    switch (periodFilter) {
      case 'today': return 'Hoje';
      case 'yesterday': return 'Ontem';
      case 'week': return 'Últimos 7 dias';
      case 'month': return 'Este mês';
      case 'custom': return 'Período personalizado';
      default: return 'Hoje';
    }
  };
  const fetchSalesData = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Using empty sales data.');
      return;
    }

    try {
      const { data } = await supabase!
        .from('orders')
        .select('created_at, total_amount')
        .in('status', ['confirmed', 'shipped', 'delivered'])
        .order('created_at', { ascending: true })
        .limit(30);

      if (data) {
        const salesByDay = data.reduce((acc: any, order) => {
          const date = new Date(order.created_at).toLocaleDateString('pt-BR');
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += Number(order.total_amount);
          return acc;
        }, {});

        const chartData = Object.entries(salesByDay).map(([date, amount]) => ({
          date,
          vendas: amount,
        }));

        setSalesData(chartData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados de vendas:', error);
    }
  };

  const metricCards = [
    {
      title: 'Total de Pedidos',
      value: metrics.totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pedidos Pagos',
      value: metrics.paidOrders,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${metrics.monthSales.toFixed(2).replace('.', ',')}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: `Receita ${getPeriodLabel()}`,
      value: `R$ ${metrics.periodSales.toFixed(2).replace('.', ',')}`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Pedidos Pendentes',
      value: metrics.pendingOrders,
      icon: Package,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Total de Produtos',
      value: metrics.totalProducts,
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral das métricas da sua loja</p>
      </div>

      {/* Filtros de Período */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtrar por Período</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: 'today', label: 'Hoje' },
            { key: 'yesterday', label: 'Ontem' },
            { key: 'week', label: 'Últimos 7 dias' },
            { key: 'month', label: 'Este mês' },
            { key: 'custom', label: 'Personalizado' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setPeriodFilter(period.key as PeriodFilter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodFilter === period.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {periodFilter === 'custom' && (
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <input
                type="date"
                value={customDateRange.startDate}
                onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <input
                type="date"
                value={customDateRange.endDate}
                onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`${metric.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico de Vendas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas Recentes</h3>
        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`R$ ${value.toFixed(2).replace('.', ',')}`, 'Vendas']}
              />
              <Line type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Nenhum dado de vendas disponível
          </div>
        )}
      </div>
    </div>
  );
};