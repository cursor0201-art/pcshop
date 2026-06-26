'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingCart, ArrowRight, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart, CartItem } from '@/hooks/useCart';
import { BASE_URL } from '@/lib/api';


export default function CartPage() {
  const { t, language } = useLanguage();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998',
    address: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500"></div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ' + t.currency;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      // 1. Save order to Django REST API
      const combinedComment = [
        formData.address ? `Адрес доставки: ${formData.address}` : '',
        formData.comment ? `Комментарий: ${formData.comment}` : ''
      ].filter(Boolean).join('\n');

      const orderPayload = {
        client_name: formData.name,
        client_phone: formData.phone,
        total_amount: getTotal(),
        comment: combinedComment || null,
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        }))
      };

      const orderRes = await fetch(`${BASE_URL}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to save order to Django database');
      }

      const newOrder = await orderRes.json();

      if (!newOrder || !newOrder.id) {
        throw new Error('No order ID returned from database');
      }

      // 2. Construct and trigger Telegram redirect
      const title = language === 'ru' ? '🆕 Новый заказ' : '🆕 Yangi buyurtma';
      const orderNum = `#${newOrder.id}`;
      const customerHeader = language === 'ru' ? '👤 Клиент:' : '👤 Mijoz:';
      const phoneHeader = language === 'ru' ? '📞 Телефон:' : '📞 Telefon:';
      const addressHeader = language === 'ru' ? '📍 Адрес доставки:' : '📍 Yetkazib berish manzili:';
      const commentHeader = language === 'ru' ? '📝 Комментарий:' : '📝 Izoh:';
      const itemsHeader = language === 'ru' ? '📦 Товары:' : '📦 Mahsulotlar:';

      const itemsText = items.map(item => {
        const name = language === 'ru' ? item.name_ru : item.name_uz;
        
        let imageUrl = item.image;
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://informal-rodina-bave-hub-2e898989.koyeb.app${imageUrl}`;
        }
        
        const productUrl = item.slug 
          ? `https://storepcshop.uz/product?slug=${item.slug}`
          : `https://storepcshop.uz/product/${item.id}`;
          
        const itemPhoto = imageUrl ? `\n🖼 Фото: ${imageUrl}` : '';
        const itemLink = `\n🔗 Товар: ${productUrl}`;
        
        return `— ${name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}${itemLink}${itemPhoto}`;
      }).join('\n\n');

      const totalText = language === 'ru' ? `💰 Итого: ${formatPrice(getTotal())}` : `💰 Jami: ${formatPrice(getTotal())}`;

      let message = `${title} ${orderNum}\n\n`;
      message += `${customerHeader} ${formData.name}\n`;
      message += `${phoneHeader} ${formData.phone}\n`;
      message += `${addressHeader} ${formData.address}\n`;
      if (formData.comment) {
        message += `${commentHeader} ${formData.comment}\n`;
      }
      message += `\n${itemsHeader}\n${itemsText}\n\n${totalText}`;

      const adminUsername = 'pcshop_uzz';
      const messageEncoded = encodeURIComponent(message);
      const telegramUrl = `https://telegram.me/${adminUsername}?text=${messageEncoded}`;
      const nativeUrl = `tg://resolve?domain=${adminUsername}&text=${messageEncoded}`;
      
      // Try opening the native app directly (works instantly without web proxy blocks)
      window.location.href = nativeUrl;
      
      // Also open the unblocked web link in a new tab as a fallback
      setTimeout(() => {
        window.open(telegramUrl, '_blank');
      }, 500);

      // 3. Update UI and clear cart
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(language === 'ru' 
        ? 'Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.' 
        : 'Buyurtma berishda xatolik yuz berdi. Iltimos, qaytadan urinib koʻring.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-900 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">{t.cart.empty}</h1>
          <Link href="/catalog">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              {t.cart.continue}
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">{t.cart.title}</h1>

        <AnimatePresence mode="wait">
          {orderSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <Send className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{t.checkout.success}</h2>
              <p className="text-gray-400">
                {language === 'ru'
                  ? 'Мы скоро с вами свяжемся'
                  : "Tez orada siz bilan bog'lanamiz"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row gap-4 p-4 bg-neutral-900 rounded-xl border border-gray-800"
                    >
                      <div className="flex gap-4 flex-1 min-w-0">
                        {/* Image */}
                        <Link href={item.slug ? `/product?slug=${item.slug}` : `/product/${item.id}`} className="flex-shrink-0">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-neutral-800">
                            {item.image ? (
                              <Image src={item.image} alt="" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <ShoppingCart className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={item.slug ? `/product?slug=${item.slug}` : `/product/${item.id}`}>
                            <h3 className="font-medium text-white hover:text-red-500 transition-colors line-clamp-2 text-sm sm:text-base">
                              {language === 'ru' ? item.name_ru : item.name_uz}
                            </h3>
                          </Link>
                          <p className="text-base sm:text-lg font-bold text-red-500 mt-1 sm:mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-800">
                        <div className="flex items-center gap-1 bg-neutral-800 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 sm:gap-0"
                        >
                          <X className="w-5 h-5" />
                          <span className="sm:hidden text-sm">{language === 'ru' ? 'Удалить' : 'O\'chirish'}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary / Checkout Form */}
              <div>
                <div className="sticky top-24 bg-neutral-900 rounded-xl border border-gray-800 p-4 sm:p-6">
                  {!showCheckout ? (
                    <>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {language === 'ru' ? 'Итого' : 'Jami'}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-400 text-sm sm:text-base">
                          <span>
                            {items.reduce((sum, item) => sum + item.quantity, 0)} {' '}
                            {language === 'ru' ? 'товаров' : 'ta mahsulot'}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg sm:text-xl font-bold flex-wrap gap-2">
                          <span className="text-white">{t.cart.total}:</span>
                          <span className="text-red-500">{formatPrice(getTotal())}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCheckout(true)}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                      >
                        {t.cart.checkout}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>

                      <Link href="/catalog">
                        <button className="w-full mt-3 btn-secondary">
                          {t.cart.continue}
                        </button>
                      </Link>
                    </>
                  ) : (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {t.checkout.title}
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          {t.checkout.name} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          {t.checkout.phone} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            let val = e.target.value;
                            // Keep only digits and '+'
                            val = val.replace(/[^\d+]/g, '');
                            // Ensure it starts with '+'
                            if (val.length > 0 && !val.startsWith('+')) {
                              val = '+' + val.replace(/\+/g, '');
                            }
                            // Prevent deleting the +998 prefix
                            if (val.length < 4) {
                              val = '+998';
                            }
                            setFormData({ ...formData, phone: val });
                          }}
                          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          {t.checkout.address} *
                        </label>
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          {t.checkout.comment}
                        </label>
                        <textarea
                          value={formData.comment}
                          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-base font-bold mb-4">
                          <span className="text-white">{t.cart.total}:</span>
                          <span className="text-red-500">{formatPrice(getTotal())}</span>
                        </div>

                        <div className="space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              language === 'ru' ? 'Отправка...' : 'Yuborilmoqda...'
                            ) : (
                              <>
                                {t.checkout.submit}
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </motion.button>

                          <button
                            type="button"
                            onClick={() => setShowCheckout(false)}
                            className="w-full btn-secondary"
                          >
                            {language === 'ru' ? 'Назад' : 'Orqaga'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { ArrowLeft } from 'lucide-react';
