'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Award, Headphones, CheckCircle, Users, Package, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function AboutPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    if (language === 'ru') {
      document.title = 'О нас | Компьютерный магазин PcShop_uz';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', 'Узнайте больше о PcShop_uz. Мы предлагаем качественные комплектующие для ПК и готовые игровые сборки с гарантией в Ташкенте с 2019 года.');
      }
    } else {
      document.title = 'Biz haqimizda | PcShop_uz kompyuter do\'koni';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', 'PcShop_uz haqida ko\'proq ma\'lumot oling. Biz 2019 yildan beri Toshkentda kafolatli o\'yin kompyuterlari va butlovchi qismlarni taqdim etamiz.');
      }
    }
  }, [language]);

  const advantages = [
    {
      icon: Truck,
      title: language === 'ru' ? 'Быстрая доставка' : 'Tez yetkazib berish',
      description: language === 'ru'
        ? 'Доставляем по всему Узбекистану в кратчайшие сроки'
        : "O'zbekiston bo'ylab eng qisqa muddatlarda yetkazib beramiz",
    },
    {
      icon: Shield,
      title: language === 'ru' ? 'Гарантия качества' : 'Sifat kafolati',
      description: language === 'ru'
        ? 'Официальная гарантия на все товары от 12 месяцев'
        : 'Barcha mahsulotlarga 12 oydan kam bo\'lmagan rasmiy kafolat',
    },
    {
      icon: Award,
      title: language === 'ru' ? 'Лучшие цены' : 'Eng yaxshi narxlar',
      description: language === 'ru'
        ? 'Работаем напрямую с поставщиками без посредников'
        : 'Vositachilarsiz bevosita yetkazib beruvchilar bilan ishlaymiz',
    },
    {
      icon: Headphones,
      title: language === 'ru' ? 'Консультации' : 'Konsultatsiya',
      description: language === 'ru'
        ? 'Бесплатные консультации специалистов по подбору техники'
        : 'Texnikani tanlash bo\'yicha mutaxassis maslahatlari bepul',
    },
  ];

  const stats = [
    { icon: Users, value: '2000+', label: language === 'ru' ? 'Довольных клиентов' : 'Mamnun mijozlar' },
    { icon: Package, value: '5000+', label: language === 'ru' ? 'Выполненных заказов' : 'Yetkazilgan buyurtmalar' },
    { icon: Clock, value: '5+', label: language === 'ru' ? 'Лет на рынке' : 'Yildan beri bozorda' },
  ];

  const achievements = [
    language === 'ru' ? 'Официальный представитель ведущих брендов' : "Keng qamrovli markalarning rasmiy vakili",
    language === 'ru' ? 'Сертифицированные специалисты' : 'Malakali mutaxassislar',
    language === 'ru' ? 'Сервисный центр в Ташкенте' : "Toshkentda ishlar markazi",
    language === 'ru' ? 'Более 500 товаров в каталоге' : 'Katalogda 500 dan ortiq mahsulot',
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <span className="text-sm text-red-400">
              {language === 'ru' ? 'С 2019 года' : '2019 dan beri'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">{t.about.title}</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t.about.description}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-neutral-900 border border-gray-800"
            >
              <stat.icon className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Advantages */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white text-center mb-8"
          >
            {language === 'ru' ? 'Наши преимущества' : 'Bizning afzalliklarimiz'}
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-neutral-900 border border-gray-800 hover:border-red-500/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            {language === 'ru' ? 'Наши достижения' : 'Bizning muvaffaqiyatlarimiz'}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900 border border-gray-800"
              >
                <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-white">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Delivery info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600/20 to-neutral-900 rounded-2xl border border-red-500/20 p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {language === 'ru' ? 'Условия доставки' : 'Yetkazib berish shartlari'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">
                    {language === 'ru' ? 'Ташкент' : 'Toshkent'}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {language === 'ru'
                      ? 'Доставка в течение 1-2 дней. Стоимость от 50 000 сум.'
                      : "1-2 kun ichida yetkazib berish. Qiymati 50 000 so'mdan."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">
                    {language === 'ru' ? 'По Узбекистану' : "O'zbekiston bo'ylab"}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {language === 'ru'
                      ? 'Доставка транспортными компаниями 3-5 дней. Стоимость по тарифам перевозчика.'
                      : "Transport kompaniyalari orqali 3-5 kunda yetkazib berish. Qiymati tashuvchi tariflariga ko'ra."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">
                    {language === 'ru' ? 'Самовывоз' : 'Olib ketish'}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {language === 'ru'
                      ? 'Бесплатный самовывоз из нашего магазина на Лабзаке.'
                      : 'Labzakdagi do\'konimizdan bepul olib ketish.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/50 rounded-xl p-6">
              <h4 className="text-white font-medium mb-3">
                {language === 'ru' ? 'Гарантия' : 'Kafolat'}
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                  {language === 'ru'
                    ? 'Гарантия от 12 месяцев на все товары'
                    : 'Barcha mahsulotlarga 12 oydan kam kafolat'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                  {language === 'ru'
                    ? 'Бесплатный ремонт в гарантийный период'
                    : 'Kafolat davrida bepul ta\'mirlash'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                  {language === 'ru'
                    ? 'Обмен товара в течение 14 дней'
                    : '14 kun ichida mahsulotni almashtirish'}
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/catalog">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary text-lg px-8 py-4"
            >
              {language === 'ru' ? 'Перейти в каталог' : "Katalogga o'tish"}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
