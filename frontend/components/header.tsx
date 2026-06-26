'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, ShoppingCart, Menu, X, ChevronDown, Scale } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { Language } from '@/lib/i18n';

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/catalog', key: 'catalog' },
  { href: '/compare', key: 'compare' },
  { href: '/configurator', key: 'configurator' },
  { href: '/faq', key: 'faq' },
  { href: '/about', key: 'about' },
  { href: '/contacts', key: 'contacts' },
];

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { getItemCount, compareItems } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const cartCount = mounted ? getItemCount() : 0;
  const compareCount = mounted ? compareItems.length : 0;
  
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'uz' : 'ru');
  };

  return (
    <>
      <motion.header
        initial={shouldReduceMotion ? { y: 0 } : { y: -100 }}
        animate={{ y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-neutral-900/95 backdrop-blur-md shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-xl font-bold text-white">
                  PcShop<span className="text-red-500">_uz</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.nav[link.key as keyof typeof t.nav]}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                aria-label={language === 'ru' ? 'Поиск по сайту' : 'Qidiruv'}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Compare Button */}
              <Link href="/compare" aria-label={language === 'ru' ? 'Сравнение товаров' : 'Solishtirish'}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Scale className="w-5 h-5" />
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
                      {compareCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Cart Button */}
              <Link href="/cart" aria-label={language === 'ru' ? 'Корзина' : 'Savat'}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
                      {cartCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                aria-label={language === 'ru' ? 'Сменить язык на узбекский' : 'Tilni ruschaga o\'zgartirish'}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <span className={language === 'ru' ? 'text-red-500' : 'text-gray-400'}>
                  RU
                </span>
                <span className="text-gray-500">|</span>
                <span className={language === 'uz' ? 'text-red-500' : 'text-gray-400'}>
                  UZ
                </span>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={language === 'ru' ? 'Открыть меню навигации' : 'Menyuni ochish'}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-neutral-900 border-t border-gray-800"
            >
              <nav className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.href
                        ? 'text-red-500 bg-red-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t.nav[link.key as keyof typeof t.nav]}
                  </Link>
                ))}
                <button
                  onClick={toggleLanguage}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-center text-sm font-medium"
                >
                  {language === 'ru' ? "O'zbek tiliga o'tish" : 'Переключить на русский'}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="max-w-2xl mx-auto mt-20 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-neutral-900 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-4">
                  <Search className="w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.search.placeholder}
                    className="flex-1 bg-transparent text-lg text-white placeholder-gray-500 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-neutral-900/90 backdrop-blur-lg border-t border-gray-800 pb-safe pt-2">
        <div className="flex items-center justify-around h-12">
          {/* Home */}
          <Link href="/" className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${pathname === '/' ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{language === 'ru' ? 'Главная' : 'Bosh sahifa'}</span>
          </Link>
          
          {/* Catalog */}
          <Link href="/catalog" className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${pathname === '/catalog' ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>{language === 'ru' ? 'Каталог' : 'Katalog'}</span>
          </Link>

          {/* Compare */}
          <Link href="/compare" className={`relative flex flex-col items-center gap-1 text-xs font-medium transition-colors ${pathname === '/compare' ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {compareCount}
              </span>
            )}
            <span>{language === 'ru' ? 'Сравнение' : 'Solishtirish'}</span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className={`relative flex flex-col items-center gap-1 text-xs font-medium transition-colors ${pathname === '/cart' ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {cartCount}
              </span>
            )}
            <span>{language === 'ru' ? 'Корзина' : 'Savat'}</span>
          </Link>

          {/* Telegram */}
          <a href="https://telegram.me/pcshop_uzz" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-1 .53-1.42.52-.47-.01-1.37-.27-2.03-.49-.82-.27-1.47-.41-1.42-.87.03-.24.36-.49.99-.74 3.89-1.69 6.48-2.8 7.78-3.33 3.69-1.51 4.46-1.77 4.96-1.78.11 0 .36.03.52.16.14.12.18.28.2.45.02.07.01.22 0 .28z"/>
            </svg>
            <span className="text-[#0088cc]">Telegram</span>
          </a>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
