'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cpu, Monitor, Headphones, Zap, Truck, Shield, Clock, ChevronRight, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { getCategories, getProducts } from '@/lib/api';


// Stats counter component
function StatCounter({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-white mb-2"
      >
        {count.toLocaleString()}+
      </motion.div>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}

// Category card component
function CategoryCard({ category, index, productCount }: { category: { id: number; name_ru: string; name_uz: string; slug: string }; index: number; productCount: number }) {
  const { language } = useLanguage();
  const name = language === 'ru' ? category.name_ru : category.name_uz;

  const categoryIcons: Record<string, React.ReactNode> = {
    'ready-pc': <Monitor className="w-8 h-8" />,
    'processors': <Cpu className="w-8 h-8" />,
    'videocards': <Zap className="w-8 h-8" />,
    'motherboards': <Cpu className="w-8 h-8" />,
    'ram': <Cpu className="w-8 h-8" />,
    'ssd': <Cpu className="w-8 h-8" />,
    'hdd': <Cpu className="w-8 h-8" />,
    'psu': <Zap className="w-8 h-8" />,
    'cases': <Monitor className="w-8 h-8" />,
    'coolers': <Cpu className="w-8 h-8" />,
    'monitors': <Monitor className="w-8 h-8" />,
    'keyboards': <Headphones className="w-8 h-8" />,
    'mice': <Headphones className="w-8 h-8" />,
    'headphones': <Headphones className="w-8 h-8" />,
  };

  const getCountText = (count: number) => {
    if (language !== 'ru') return `${count} ta mahsulot`;
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) {
      return `${count} товар`;
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return `${count} товара`;
    }
    return `${count} товаров`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Link href={`/catalog?category=${category.slug}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative bg-neutral-900 rounded-2xl p-6 border border-gray-800 hover:border-red-500/50 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center text-red-500 group-hover:from-red-500/30 group-hover:to-red-600/20 transition-all">
              {categoryIcons[category.slug] || <Cpu className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-red-500 transition-colors">{name}</h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                {getCountText(productCount)}
              </p>
            </div>
          </div>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Product card component
function ProductCard({ product, index }: { product: any; index: number }) {
  const { language, t } = useLanguage();
  const { addItem, addToCompare, compareItems } = useCart();
  const name = language === 'ru' ? product.name_ru : product.name_uz;
  const isInCompare = compareItems.includes(product.id);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ' + t.currency;
  };

  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/product?slug=${product.slug}`}>
        <motion.div
          whileHover={{ y: -5 }}
          className="group bg-neutral-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all duration-300"
        >
          {/* Image */}
          <div className="relative aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <Monitor className="w-16 h-16" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_new && (
                <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg">
                  NEW
                </span>
              )}
              {discount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  addToCompare(product.id);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isInCompare ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3h5v5M8 3H3v5M21 3l-7 7M3 3l7 7M16 21h5v-5M8 21H3v-5M21 21l-7-7M3 21l7-7" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
            <h3 className="font-medium text-white line-clamp-2 group-hover:text-red-500 transition-colors mb-3">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg font-bold text-red-500">
                  {formatPrice(product.price)}
                  {product.price_usd && (
                    <span className="text-xs text-gray-400 font-normal block">
                      ~ {Number(product.price_usd).toLocaleString('en-US')} $
                    </span>
                  )}
                </p>
                {product.old_price && (
                  <p className="text-sm text-gray-500 line-through">{formatPrice(product.old_price)}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    id: product.id,
                    name_ru: product.name_ru,
                    name_uz: product.name_uz,
                    price: product.price,
                    image: product.images?.[0] || '',
                    slug: product.slug,
                  });
                }}
                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
              </motion.button>
            </div>

            {/* Stock */}
            <div className="mt-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400">
                {product.stock > 0 ? t.product.inStock : t.product.outOfStock}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-800 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-3 text-white font-medium hover:text-red-500 transition-colors"
      >
        <span>{question}</span>
        <span className="text-xl text-red-500 ml-4">{isOpen ? '−' : '+'}</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden text-gray-400 text-sm leading-relaxed"
      >
        <p className="py-2">{answer}</p>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [tgLink, setTgLink] = useState('https://telegram.me/pcshop_uzz');
  const heroRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'weekly' | 'today_discounts'>('weekly');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      setTgLink('tg://resolve?domain=pcshop_uzz');
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    getCategories().then(setCategories);
    getProducts().then((data) => {
      setAllProducts(data || []);
    });
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const difference = nextMidnight.getTime() - now.getTime();

      let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((difference / 1000 / 60) % 60);
      let seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const discountedProducts = useMemo(() => {
    const withDiscount = allProducts.filter((p: any) => p.old_price && Number(p.old_price) > Number(p.price));
    if (withDiscount.length > 0) return withDiscount.slice(0, 8);
    
    // Fallback: if no products have discount in the database, simulate discount for the first 8 products for demo/visual richness
    return allProducts.slice(0, 8).map(p => ({
      ...p,
      old_price: Math.round(p.price * 1.15)
    }));
  }, [allProducts]);

  const weeklyProducts = useMemo(() => {
    const weekly = allProducts.filter((p: any) => p.is_weekly_offer);
    if (weekly.length > 0) return weekly;
    // Fallback: show first 4 discounted products if none explicitly marked
    return discountedProducts.slice(0, 4);
  }, [allProducts, discountedProducts]);

  const displayedProducts = useMemo(() => {
    if (activeTab === 'weekly') return weeklyProducts;
    return discountedProducts;
  }, [activeTab, weeklyProducts, discountedProducts]);

  useEffect(() => {
    if (language === 'ru') {
      document.title = 'Компьютерный магазин PcShop_uz | Купить компьютер, игровые ПК, комплектующие в Ташкенте';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', 'PcShop_uz — ведущий компьютерный магазин в Ташкенте. Сборка игровых ПК, процессоры, видеокарты RTX, SSD, мониторы по низким ценам. Гарантия и доставка по Узбекистану.');
      }
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) {
        keywordsMeta.setAttribute('content', 'купить компьютер в Ташкенте, игровой компьютер Ташкент, видеокарта Ташкент, RTX Ташкент, процессор Ташкент, сборка ПК Ташкент, компьютерный магазин Узбекистан, комплектующие для ПК Узбекистан');
      }
    } else {
      document.title = 'PcShop_uz kompyuter do\'koni | Toshkentda kompyuterlar, o\'yin PC, butlovchi qismlar sotib olish';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', 'PcShop_uz — Toshkentdagi yetakchi kompyuter do\'koni. O\'yin kompyuterlarini yig\'ish, protsessorlar, RTX videokartalar, SSD, monitorlar arzon narxlarda. Kafolat va O\'zbekiston bo\'ylab yetkazib berish.');
      }
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) {
        keywordsMeta.setAttribute('content', 'o\'yin kompyuteri sotib olish, kompyuter do\'koni, videokarta sotib olish, RTX videokarta, protsessor sotib olish, SSD sotib olish, gaming PC, kompyuter qismlari');
      }
    }
  }, [language]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,57,53,0.15)_0%,_transparent_70%)]" />

          {/* Animated grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(229,57,53,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(229,57,53,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }} />
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6"
              >
                <Zap className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-400">Новые поступления</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              >
                {t.hero.title.split(' ').map((word, i) => (
                  <span key={i}>
                    {word === 'выгодным' || word === 'arzon' ? (
                      <span className="text-red-500">{word} </span>
                    ) : (
                      <span>{word} </span>
                    )}
                  </span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-400 mb-8"
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/catalog">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-shadow"
                  >
                    {t.hero.catalogBtn}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/catalog?category=ready-pc">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-neutral-800 border border-gray-700 text-white font-semibold hover:bg-neutral-700 transition-colors"
                  >
                    {t.hero.buildBtn}
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-6 mt-10"
              >
                {[
                  { icon: Truck, text: 'Доставка' },
                  { icon: Shield, text: 'Гарантия' },
                  { icon: Clock, text: '24/7' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-gray-500">
                    <item.icon className="w-5 h-5 text-red-500" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10"
                >
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 border border-gray-800 shadow-2xl">
                    <Image
                      src="/hero-pc.png"
                      alt="Gaming PC"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Glowing border */}
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 rounded-3xl ring-2 ring-inset ring-red-500/50 pointer-events-none"
                    />
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-4 rounded-full border border-dashed border-red-500/20"
                />
                <motion.div
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -inset-8 rounded-full bg-gradient-to-r from-red-500/20 via-red-500/5 to-transparent blur-3xl"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-red-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-neutral-900/50 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={500} label={t.stats.products} />
            <StatCounter value={2000} label={t.stats.customers} />
            <StatCounter value={3500} label={t.stats.orders} />
            <StatCounter value={5} label={t.stats.years} />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {t.nav.catalog}
              </h2>
              <p className="text-gray-400">Выберите категорию товаров</p>
            </div>
            <Link href="/catalog">
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
              >
                {language === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <CategoryCard 
                key={cat.id || cat.slug} 
                category={cat} 
                index={index} 
                productCount={allProducts.filter(p => p.category_id === cat.id || p.category_slug === cat.slug).length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Discount Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-gray-800 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
          >
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                {language === 'ru' ? 'Предложение недели' : 'Haftalik taklif'}
              </span>

              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                {language === 'ru' ? (
                  <>ПРЕДЛОЖЕНИЯ НЕДЕЛИ <span className="text-red-500">С КРУТЫМИ СКИДКАМИ</span></>
                ) : (
                  <>HAFTALIK TAKLIFLAR <span className="text-red-500">KATTA CHEGIRMALAR BILAN</span></>
                )}
              </h2>

              <p className="text-gray-400 max-w-lg text-base md:text-lg">
                {language === 'ru'
                  ? 'Обновите свой ПК по лучшим ценам в Узбекистане. Специальные цены на этой неделе на игровые видеокарты, процессоры и готовые сборки!'
                  : 'O\'zbekistondagi eng yaxshi narxlarda shaxsiy kompyuteringizni yangilang. Ushbu haftada o\'yin videokartalari, protsessorlar va tayyor kompyuterlarga maxsus narxlar!'}
              </p>

              {/* Countdown timer */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="text-center">
                  <div className="bg-neutral-800 border border-gray-700 text-white rounded-xl w-14 h-14 flex items-center justify-center text-xl font-bold shadow-md">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {language === 'ru' ? 'часов' : 'soat'}
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-600">:</span>
                <div className="text-center">
                  <div className="bg-neutral-800 border border-gray-700 text-white rounded-xl w-14 h-14 flex items-center justify-center text-xl font-bold shadow-md">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {language === 'ru' ? 'минут' : 'daqiqa'}
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-600">:</span>
                <div className="text-center">
                  <div className="bg-neutral-800 border border-gray-700 text-white rounded-xl w-14 h-14 flex items-center justify-center text-xl font-bold shadow-md text-red-500">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {language === 'ru' ? 'секунд' : 'soniya'}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-end">
              <Link href="/catalog?discount=true">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-600/35 hover:shadow-red-600/50 flex items-center gap-2"
                >
                  {language === 'ru' ? 'Смотреть скидки' : 'Chegirmalarni ko\'rish'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {language === 'ru' ? 'Специальные предложения' : 'Maxsus takliflar'}
              </h2>
              <p className="text-gray-400">
                {language === 'ru' ? 'Лучшие предложения и скидки на комплектующие и ПК' : 'Komponentlar va shaxsiy kompyuterlar uchun eng yaxshi takliflar va chegirmalar'}
              </p>
            </div>

            {/* Tabs Trigger */}
            <div className="flex bg-neutral-900 border border-gray-800 rounded-xl p-1 overflow-x-auto self-start md:self-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'weekly'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                {language === 'ru' ? 'Предложения недели' : 'Haftalik takliflar'}
              </button>

              <button
                onClick={() => setActiveTab('today_discounts')}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'today_discounts'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {language === 'ru' ? 'Скидки на сегодня' : 'Bugungi chegirmalar'}
              </button>
            </div>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-neutral-900 rounded-2xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-600 to-red-700"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-4xl font-bold text-white mb-4"
              >
                {language === 'ru'
                  ? 'Не нашли нужный товар?'
                  : "Kerakli mahsulotni topa olmadizmi?"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="text-white/80 mb-8 max-w-xl mx-auto"
              >
                {language === 'ru'
                  ? 'Свяжитесь с нами в Telegram - поможем подобрать и заказать любой товар'
                  : "Telegram orqali biz bilan bog'laning - istalgan mahsulotni tanlash va buyurtma qilishda yordam beramiz"}
              </motion.p>
              <motion.a
                href={tgLink}
                target={tgLink.startsWith('http') ? '_blank' : undefined}
                rel={tgLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-red-600 font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18.2.2 0 00-.17-.04c-.12.03-2.12 1.36-6.3 3.98-.6.41-1.14.61-1.63.6-.54-.01-1.57-.31-2.34-.56-.94-.31-1.69-.48-1.63-1.01.03-.28.41-.57 1.13-.87 4.43-1.93 7.39-3.2 8.86-3.82 4.22-1.76 5.1-2.06 5.67-2.07.13 0 .4.03.58.19.15.13.19.3.21.47-.01.06.01.35 0 .57z"/>
                </svg>
                Telegram
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ and Local SEO Section */}
      <section className="py-16 md:py-24 bg-neutral-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* FAQ Block */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                {language === 'ru' ? 'Часто задаваемые вопросы (FAQ)' : 'Ko\'p beriladigan savollar'}
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q_ru: 'Где купить игровой компьютер в Ташкенте с гарантией?',
                    q_uz: 'Toshkentda o\'yin kompyuterini kafolat bilan qayerdan sotib olsa bo\'ladi?',
                    a_ru: 'Вы можете купить надежный игровой компьютер в Ташкенте с гарантией 1 год в компьютерном магазине PcShop_uz. Мы предлагаем готовые решения и сборку ПК под любые задачи.',
                    a_uz: 'Toshkentda o\'yin kompyuterini 1 yillik kafolat bilan PcShop_uz do\'konidan sotib olishingiz mumkin. Biz tayyor echimlar va buyurtma asosida kompyuter yig\'ishni taklif etamiz.'
                  },
                  {
                    q_ru: 'Какая средняя стоимость сборки игрового компьютера в Узбекистане?',
                    q_uz: 'O\'zbekistonda o\'yin kompyuterini yig\'ishning o\'rtacha narxi qancha?',
                    a_ru: 'Сборка игрового компьютера в PcShop_uz осуществляется бесплатно при покупке комплектующих. Мы поможем подобрать видеокарту RTX, процессор, материнскую плату и оперативную память по лучшим ценам в Узбекистане.',
                    a_uz: 'PcShop_uz do\'konida kompyuter yig\'ish bepul (qismlar bizdan sotib olinganda). Biz O\'zbekistonda eng yaxshi narxlarda RTX videokarta, protsessor va tezkor xotira tanlashda yordam beramiz.'
                  },
                  {
                    q_ru: 'Какие видеокарты NVIDIA GeForce RTX можно купить в Ташкенте?',
                    q_uz: 'Toshkentda qaysi NVIDIA GeForce RTX videokartalarini sotib olish mumkin?',
                    a_ru: 'В нашем магазине доступны самые современные видеокарты, включая линейку NVIDIA GeForce RTX 5060, RTX 5070, RTX 5080, а также новейшую RTX 5090 с быстрой доставкой по Ташкенту и Узбекистану.',
                    a_uz: 'Do\'konimizda NVIDIA GeForce RTX 5060, RTX 5070, RTX 5080 va eng yangi RTX 5090 videokartalari mavjud. Toshkent va O\'zbekiston bo\'ylab tezkor yetkazib berish xizmati bor.'
                  },
                  {
                    q_ru: 'Оказывает ли PcShop_uz помощь в подборе комплектующих для ПК?',
                    q_uz: 'PcShop_uz kompyuter qismlarini tanlashda yordam beradimi?',
                    a_ru: 'Да! Специалисты нашего компьютерного магазина всегда готовы проконсультировать вас в Telegram или по телефону и помочь подобрать процессор, оперативную память, SSD и систему охлаждения.',
                    a_uz: 'Ha! Bizning mutaxassislarimiz Telegram yoki telefon orqali bepul maslahat berishga va protsessor, SSD, operativ xotira tanlashda yordam berishga tayyor.'
                  }
                ].map((item, idx) => (
                  <FAQItem 
                    key={idx} 
                    question={language === 'ru' ? item.q_ru : item.q_uz} 
                    answer={language === 'ru' ? item.a_ru : item.a_uz} 
                  />
                ))}
              </div>
            </div>

            {/* Local SEO Block */}
            <div className="flex flex-col justify-center">
              <span className="text-red-500 font-semibold mb-2 uppercase tracking-wider">
                {language === 'ru' ? 'Компьютерный магазин в Узбекистане' : 'O\'zbekistonda kompyuter do\'koni'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {language === 'ru' ? 'Сборка игровых ПК и комплектующие в Ташкенте' : 'Toshkentda o\'yin PK yig\'ish va butlovchi qismlar'}
              </h2>
              <div className="text-gray-400 space-y-4 leading-relaxed">
                <p>
                  {language === 'ru' 
                    ? 'PcShop_uz — ваш надежный партнер в мире гейминга и высоких технологий в Узбекистане. Наш компьютерный магазин предлагает широкий ассортимент комплектующих для ПК и готовых систем. Ищете ли вы мощный игровой компьютер в Ташкенте, современную видеокарту RTX, производительный процессор AMD Ryzen или Intel Core, мы поможем вам собрать систему мечты с официальной гарантией 1 год.'
                    : 'PcShop_uz - O\'zbekistondagi geyming va yuqori texnologiyalar olamidagi ishonchli hamkoringiz. Kompyuter do\'konimiz butlovchi qismlar va tayyor tizimlarning keng assortimentini taklif etadi. Toshkentda kuchli o\'yin kompyuteri, RTX videokartasi, AMD Ryzen yoki Intel Core protsessorini qidirayotgan bo\'lsangiz, biz sizga 1 yillik rasмий kafolat bilan orzuingizdagi tizimni yig\'ishda yordam beramiz.'}
                </p>
                <p>
                  {language === 'ru'
                    ? 'Мы осуществляем быструю доставку игровых ПК и комплектующих по всему Узбекистану и гарантируем высокое качество обслуживания. Сделайте заказ прямо сейчас и получите профессиональную сборку ПК в Ташкенте бесплатно!'
                    : 'Biz o\'yin kompyuterlari va butlovchi qismlarni butun O\'zbekiston bo\'ylab tezkor yetkazib beramiz hamda yuqori sifatli xizmat ko\'rsatishni kafolatlaymiz. Hozir buyurtma bering va Toshkentda professional kompyuter yig\'ish xizmatini bepul oling!'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Schema injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Где купить игровой компьютер в Ташкенте с гарантией?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Вы можете купить надежный игровой компьютер в Ташкенте с гарантией 1 год в компьютерном магазине PcShop_uz. Мы предлагаем готовые решения и сборку ПК под любые задачи."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Какая средняя стоимость сборки игрового компьютера в Узбекистане?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Сборка игрового компьютера в PcShop_uz осуществляется бесплатно при покупке комплектующих. Мы поможем подобрать видеокарту RTX, процессор, материнскую плату и оперативную память по лучшим ценам в Узбекистане."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Какие видеокарты NVIDIA GeForce RTX можно купить в Ташкенте?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "В нашем магазине доступны самые современные видеокарты, включая линейку NVIDIA GeForce RTX 5060, RTX 5070, RTX 5080, а также новейшую RTX 5090 с быстрой доставкой по Ташкенту и Узбекистану."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Оказывает ли PcShop_uz помощь в подборе комплектующих для ПК?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Да! Специалисты нашего компьютерного магазина всегда готовы проконсультировать вас в Telegram или по телефону и помочь подобрать процессор, оперативную память, SSD и систему охлаждения."
                  }
                }
              ]
            })
          }}
        />
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t.about.title}
              </h2>
              <p className="text-gray-400 mb-8">
                {t.about.description}
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Truck, text: t.about.advantage1 },
                  { icon: Shield, text: t.about.advantage2 },
                  { icon: Zap, text: t.about.advantage3 },
                  { icon: Headphones, text: t.about.advantage4 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-sm text-gray-300">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <Link href="/about">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 mt-8 text-red-500 hover:text-red-400 transition-colors"
                >
                  {language === 'ru' ? 'Подробнее о нас' : "Biz haqimizda batafsil"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/30 transition-all duration-300">
                <Image
                  src="/about-pc.png"
                  alt="PcShop_uz"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-xl shadow-red-500/25">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">10+</p>
                  <p className="text-xs text-white/80">лет</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
