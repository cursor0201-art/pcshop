'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Search, ChevronDown } from 'lucide-react';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  comment: string;
  total: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

const statusOptions = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const language = 'ru';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      let query = `${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc`;
      if (statusFilter) {
        query += `&status=eq.${statusFilter}`;
      }

      const res = await fetch(query, { headers: { apikey: supabaseKey || '' } });
      const data = await res.json();
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: number) => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(
        `${supabaseUrl}/rest/v1/order_items?order_id=eq.${orderId}`,
        { headers: { apikey: supabaseKey || '' } }
      );
      const data = await res.json();
      setOrderItems(data || []);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey || '',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' сум';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-500/20 text-blue-400',
      processing: 'bg-yellow-500/20 text-yellow-400',
      shipped: 'bg-purple-500/20 text-purple-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    const labels: Record<string, string> = {
      new: 'Новый',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${styles[status] || styles.new}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredOrders = orders.filter(o =>
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone.includes(search)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">
        {language === 'ru' ? 'Заказы' : 'Buyurtmalar'}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ru' ? 'Поиск по имени или телефону...' : 'Ism yoki telefon...'}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-gray-800 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setTimeout(fetchOrders, 0);
            }}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-neutral-900 border border-gray-800 text-white focus:border-red-500 focus:outline-none"
          >
            <option value="">{language === 'ru' ? 'Все статусы' : 'Barcha statuslar'}</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {language === 'ru' ? status : status}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-900 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Клиент' : 'Mijoz'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Дата' : 'Sana'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Статус</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Сумма' : 'Summa'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-800 last:border-b-0 hover:bg-white/5">
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{order.customer_name}</p>
                    <p className="text-sm text-gray-400">{order.customer_phone}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`appearance-none px-3 py-1 rounded-lg text-xs font-medium border-0 focus:ring-0 cursor-pointer ${
                        order.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleViewOrder(order)}
                      className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              {language === 'ru' ? 'Заказы не найдены' : 'Buyurtmalar topilmadi'}
            </div>
          )}
        </div>
      )}

      {/* Order details modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-neutral-900 rounded-2xl border border-gray-800"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">
                  Заказ #{selectedOrder.id}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{language === 'ru' ? 'Клиент' : 'Mijoz'}</p>
                  <p className="text-white">{selectedOrder.customer_name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">{language === 'ru' ? 'Телефон' : 'Telefon'}</p>
                  <a href={`tel:${selectedOrder.customer_phone}`} className="text-red-500 hover:text-red-400">
                    {selectedOrder.customer_phone}
                  </a>
                </div>

                {selectedOrder.customer_address && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{language === 'ru' ? 'Адрес' : 'Manzil'}</p>
                    <p className="text-white">{selectedOrder.customer_address}</p>
                  </div>
                )}

                {selectedOrder.comment && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{language === 'ru' ? 'Комментарий' : 'Izoh'}</p>
                    <p className="text-white">{selectedOrder.comment}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-sm text-gray-400 mb-2">{language === 'ru' ? 'Товары' : 'Mahsulotlar'}</p>
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          Товар #{item.product_id} x{item.quantity}
                        </span>
                        <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-800">
                  <span className="text-gray-400">{language === 'ru' ? 'Итого' : 'Jami'}</span>
                  <span className="text-xl font-bold text-red-500">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
