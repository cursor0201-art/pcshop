'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare, FolderTree,
  Settings, Menu, X, LogOut, Bell, Search, User, TrendingUp, DollarSign,
  ShoppingBag, Users
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: { ru: 'Дашборд', uz: 'Dashboard' } },
  { href: '/admin/products', icon: Package, label: { ru: 'Товары', uz: 'Mahsulotlar' } },
  { href: '/admin/orders', icon: ShoppingCart, label: { ru: 'Заказы', uz: 'Buyurtmalar' } },
  { href: '/admin/reviews', icon: MessageSquare, label: { ru: 'Отзывы', uz: 'Sharhlar' } },
  { href: '/admin/categories', icon: FolderTree, label: { ru: 'Категории', uz: 'Kategoriyalar' } },
  { href: '/admin/settings', icon: Settings, label: { ru: 'Настройки', uz: 'Sozlamalar' } },
];

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const language = 'ru';

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-gray-800 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-white">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-500/10 text-red-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{language === 'ru' ? item.label.ru : item.label.uz}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>{language === 'ru' ? 'На сайт' : 'Saytga'}</span>
            </div>
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur border-b border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder={language === 'ru' ? 'Поиск...' : 'Qidirish...'}
                  className="w-64 pl-10 pr-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-white">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
