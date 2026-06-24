'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Shield, Award, Headphones, CheckCircle, Users, Package, Clock, Cpu, Heart } from 'lucide-react';
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

  const stats = [
    { icon: Users, value: '2000+', label: language === 'ru' ? 'Довольных клиентов' : 'Mamnun mijozlar' },
    { icon: Package, value: '5000+', label: language === 'ru' ? 'Выполненных заказов' : 'Yetkazilgan buyurtmalar' },
    { icon: Clock, value: '10+', label: language === 'ru' ? 'Лет на рынке' : 'yillik tajriba' },
  ];

  const whyChooseUs = [
    {
      icon: Clock,
      text_ru: 'Более 10 лет опыта в сфере компьютерной техники',
      text_uz: 'Kompyuter texnikasi sohasida 10 yildan ortiq tajriba',
    },
    {
      icon: Cpu,
      text_ru: 'Профессиональная сборка ПК под любые задачи и бюджет',
      text_uz: 'Har qanday vazifa va byudjet uchun professional PK yig\'ish',
    },
    {
      icon: Package,
      text_ru: 'Большой выбор комплектующих, ноутбуков и периферии',
      text_uz: 'Butlovchi qismlar, noutbuklar va periferiyaning keng tanlovi',
    },
    {
      icon: Award,
      text_ru: 'Техника и аксессуары от популярных и надежных брендов',
      text_uz: 'Mashhur va ishonchli brendlarning texnikasi va aksessuarlari',
    },
    {
      icon: Shield,
      text_ru: 'Гарантия качества на товары и сборки',
      text_uz: 'Mahsulotlar va yig\'malarga sifat kafolati',
    },
    {
      icon: Heart,
      text_ru: 'Доступные цены и честный подход без навязывания лишнего',
      text_uz: 'Ortiqcha narsalarni majburlamasdan hamyonbop narxlar va halol yondashuv',
    },
    {
      icon: Headphones,
      text_ru: 'Помощь с подбором, консультацией и выбором оптимального решения',
      text_uz: 'Tanlashda yordam, konsultatsiya va eng maqbul yechimni tanlash',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {language === 'ru' ? 'О нас' : 'Biz haqimizda'}
          </h1>
        </motion.div>

        {/* Main Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8 mb-16"
        >
          <div className="lg:col-span-2 space-y-6 text-gray-300 leading-relaxed text-base text-justify">
            <p>
              {language === 'ru'
                ? 'Мы — магазин компьютерной техники с более чем 10-летним опытом работы. За это время мы помогли сотням клиентов подобрать надежные решения для дома, учебы, офиса, игр, работы с графикой, монтажа, программирования и других задач.'
                : 'Biz — kompyuter texnikasi sohasida 10 yildan ortiq tajribaga ega do\'konmiz. Shu vaqt ichida biz yuzlab mijozlarga uy, o\'qish, idora, o\'yinlar, grafika bilan ishlash, montaj, dasturlash va boshqa vazifalar uchun ishonchli yechimlarni tanlashda yordam berdik.'}
            </p>
            <p>
              {language === 'ru'
                ? 'Наша главная специализация — подбор и сборка компьютеров под любой бюджет и любые цели. Мы знаем, как собрать оптимальную конфигурацию без переплат: от недорогого домашнего ПК до мощной игровой или профессиональной станции. Каждая сборка продумывается с учетом задач клиента, совместимости комплектующих, производительности и дальнейшего апгрейда.'
                : 'Bizning asosiy ixtisosligimiz — har qanday byudjet va maqsadlar uchun kompyuterlarni tanlash va yig\'ishdir. Biz ortiqcha to\'lovlar va ortiqcha xarajatlarsiz maqbul konfiguratsiyani qanday yig\'ishni bilamiz: arzon uy shaxsiy kompyuteridan tortib, kuchli o\'yin yoki professional stansiyagacha. Har bir yig\'ma mijozning vazifalari, butlovchi qismlarning mosligi, unumdorligi va keyinchalik yangilanishi (upgrade) imkoniyatlarini hisobga olgan holda puxta o\'ylab chiqiladi.'}
            </p>
            <p>
              {language === 'ru'
                ? 'В нашем ассортименте вы найдете не только комплектующие и готовые ПК, но и ноутбуки, мониторы, периферию, аксессуары и технику от известных мировых брендов. Мы внимательно подходим к выбору товаров, поэтому предлагаем только проверенные решения с гарантией качества.'
                : 'Assortimentimizda nafaqat butlovchi qismlar va tayyor shaxsiy kompyuterlar, balki noutbuklar, monitorlar, periferiya qurilmalari, aksessuarlar va dunyoga mashhur brendlarning texnikasini ham topishingiz mumkin. Biz mahsulotlarni tanlashga juda ehtiyotkorlik bilan yondashamiz, shuning uchun faqat sifat kafolatiga ega ishonchli yechimlarni taklif etamiz.'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 rounded-2xl border border-red-500/20 flex flex-col justify-center relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
            <p className="text-lg font-semibold text-white mb-4 relative z-10">
              {language === 'ru'
                ? 'Надежная техника, грамотный подбор и честный сервис — основа нашей работы.'
                : 'Ishonchli texnika, malakali tanlov va halol xizmat — ishimizning asosidir.'}
            </p>
            <p className="text-sm text-gray-400 relative z-10 leading-relaxed">
              {language === 'ru'
                ? 'Мы стремимся сделать покупку техники простой и понятной: объясняем, подбираем, собираем, проверяем и помогаем выбрать именно то, что действительно подойдет вам.'
                : 'Biz texnika sotib olishni oson va tushunarli qilishga intilamiz: tushuntiramiz, tanlaymiz, yig\'amiz, tekshiramiz va sizga haqiqatan ham mos keladigan narsani tanlashda yordam beramiz.'}
            </p>
          </div>
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
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            {language === 'ru' ? 'Почему выбирают нас' : 'Nima uchun bizni tanlashadi'}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-5 rounded-2xl bg-neutral-900 border border-gray-800 hover:border-red-500/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed self-center">
                    {language === 'ru' ? item.text_ru : item.text_uz}
                  </p>
                </motion.div>
              );
            })}
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
                      ? 'Доставка в течение 1-2 дней.'
                      : "1-2 kun ichida yetkazib berish."}
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
