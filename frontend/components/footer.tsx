'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Phone, Send, Instagram, Clock, Shield, Truck, Headphones } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const footerLinks = [
  { href: '/', key: 'home' },
  { href: '/catalog', key: 'catalog' },
  { href: '/compare', key: 'compare' },
  { href: '/configurator', key: 'configurator' },
  { href: '/faq', key: 'faq' },
  { href: '/about', key: 'about' },
  { href: '/contacts', key: 'contacts' },
  { href: '/blog', key: 'blog' },
];

const advantages = [
  { icon: Truck, key: 'advantage1' },
  { icon: Shield, key: 'advantage2' },
  { icon: Clock, key: 'advantage3' },
  { icon: Headphones, key: 'advantage4' },
];

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 border-t border-gray-800">
      {/* Advantages Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {advantages.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-sm text-gray-300">{t.about[item.key as keyof typeof t.about]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-white">
                PcShop<span className="text-red-500">_uz</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              {t.about.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>{t.footer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-red-500" />
                <a href="tel:+998998230990" className="hover:text-white transition-colors">
                  {t.footer.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Send className="w-5 h-5 text-red-500" />
                <a
                  href="https://t.me/pcshop_uzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.telegram}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <nav className="space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="block text-gray-400 hover:text-red-500 transition-colors"
                >
                  {t.nav[link.key as keyof typeof t.nav] || (link.key === 'blog' ? (t.nav.home === 'Главная' ? 'Блог' : 'Blog') : '')}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Категории</h3>
            <nav className="space-y-2">
              {Object.entries(t.categories).slice(0, 6).map(([slug, name]) => (
                <Link
                  key={slug}
                  href={`/catalog?category=${slug}`}
                  className="block text-gray-400 hover:text-red-500 transition-colors"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} PcShop_uz. {t.footer.rights}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://t.me/pcshop_uzz"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all"
            >
              <Send className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/pcshop_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
