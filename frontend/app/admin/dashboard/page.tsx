'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name_ru: string;
  stock: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    growth: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const language = 'ru';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Fetch orders
        const ordersRes = await fetch(
          `${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc&limit=5`,
          { headers: { apikey: supabaseKey || '' } }
        );
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData || []);

        // Calculate stats from orders
        const totalRevenue = ordersData?.reduce((sum: number, o: Order) => sum + o.total, 0) || 0;
        const uniqueCustomers = new Set(ordersData?.map((o: Order) => o.customer_phone) || []).size;

        setStats({
          revenue: totalRevenue,
          orders: ordersData?.length || 0,
          customers: uniqueCustomers,
          growth: 18,
        });

        // Fetch low stock products
        const productsRes = await fetch(
          `${supabaseUrl}/rest/v1/products?select=id,name_ru,stock&stock=lte.5`,
          { headers: { apikey: supabaseKey || '' } }
        );
        const productsData = await productsRes.json();
        setLowStockProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' сум';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-500/10 text-blue-500',
      processing: 'bg-yellow-500/10 text-yellow-500',
      shipped: 'bg-purple-500/10 text-purple-500',
      delivered: 'bg-green-500/10 text-green-500',
      cancelled: 'bg-red-500/10 text-red-500',
    };
    const labels: Record<string, string> = {
      new: language === 'ru' ? 'Новый' : 'Yangi',
      processing: language === 'ru' ? 'В обработке' : 'Jarayonda',
      shipped: language === 'ru' ? 'Отправлен' : 'Yuborilgan',
      delivered: language === 'ru' ? 'Доставлен' : 'Yetkazilgan',
      cancelled: language === 'ru' ? 'Отменен' : 'Bekor qilingan',
    };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status] || styles.new}`}>
        {labels[status] || status}
      </span>
    );
  };

  const statCards = [
    { icon: DollarSign, value: formatPrice(stats.revenue), label: language === 'ru' ? 'Выручка' : 'Daromad', color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: ShoppingBag, value: stats.orders, label: language === 'ru' ? 'Заказов' : 'Buyurtmalar', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Users, value: stats.customers, label: language === 'ru' ? 'Клиентов' : 'Mijozlar', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: TrendingUp, value: `+${stats.growth}%`, label: language === 'ru' ? 'Рост' : 'O\'sish', color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-neutral-900 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-900 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">
        {language === 'ru' ? 'Дашборд' : 'Dashboard'}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl bg-neutral-900 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <ArrowUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-neutral-900 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {language === 'ru' ? 'Последние заказы' : 'So\'nggi buyurtmalar'}
            </h2>
            <Link href="/admin/orders" className="text-sm text-red-500 hover:text-red-400">
              {language === 'ru' ? 'Все заказы' : 'Barchasi'}
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                  <div>
                    <p className="text-white font-medium">#{order.id} - {order.customer_name}</p>
                    <p className="text-sm text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-white font-medium mt-1">{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                {language === 'ru' ? 'Нет заказов' : 'Buyurtmalar yo\'q'}
              </p>
            )}
          </div>
        </motion.div>

        {/* Low stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl bg-neutral-900 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {language === 'ru' ? 'Товары на исходе' : 'Tugab qolgan mahsulotlar'}
            </h2>
            <Link href="/admin/products" className="text-sm text-red-500 hover:text-red-400">
              {language === 'ru' ? 'Все товары' : 'Barchasi'}
            </Link>
          </div>

          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                  <div>
                    <p className="text-white font-medium">{product.name_ru}</p>
                    <p className="text-sm text-gray-400">ID: {product.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    product.stock === 0 ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {product.stock} {language === 'ru' ? 'шт' : 'dona'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                {language === 'ru' ? 'Все товары в наличии' : 'Barcha mahsulotlar mavjud'}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
