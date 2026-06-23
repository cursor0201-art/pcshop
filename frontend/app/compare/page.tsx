'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, BarChart2, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { getProducts } from '@/lib/api';


interface Product {
  id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
  price: number;
  old_price: number | null;
  stock: number;
  specs: Record<string, string>;
  images: string[];
  brand: string;
  warranty_months: number;
}

export default function ComparePage() {
  const { t, language } = useLanguage();
  const { compareItems, removeFromCompare, addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (compareItems.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allProducts = await getProducts();
        const data = allProducts.filter(p => compareItems.includes(p.id));
        // Preserve order from compareItems
        const ordered = compareItems.map(id => data.find((p: Product) => p.id === id)).filter(Boolean);
        setProducts(ordered as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [compareItems]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ' + t.currency;
  };

  // Get all unique specs
  const allSpecs = Array.from(new Set(products.flatMap(p => Object.keys(p.specs || {}))));
  const name = language === 'ru' ? 'name_ru' : 'name_uz';

  if (compareItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-900 flex items-center justify-center">
            <BarChart2 className="w-10 h-10 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">{t.compare.empty}</h1>
          <Link href="/catalog">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              {language === 'ru' ? 'Перейти в каталог' : 'Katalogga o\'tish'}
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t.compare.title}</h1>
          <span className="text-gray-400">
            {products.length}/4 {language === 'ru' ? 'товаров' : 'ta mahsulot'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(compareItems.length)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-neutral-900 rounded-xl mb-4" />
                <div className="h-6 bg-neutral-900 rounded mb-2" />
                <div className="h-4 bg-neutral-900 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Product cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-neutral-900 rounded-xl border border-gray-800 overflow-hidden"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-black/50 text-white hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Image */}
                  <Link href={`/product?slug=${product.slug}`}>
                    <div className="aspect-square relative bg-neutral-800">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={language === 'ru' ? product.name_ru : product.name_uz}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <BarChart2 className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <Link href={`/product?slug=${product.slug}`}>
                      <h3 className="font-medium text-white line-clamp-2 hover:text-red-500 transition-colors mb-2">
                        {language === 'ru' ? product.name_ru : product.name_uz}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-red-500 mb-2">
                      {formatPrice(product.price)}
                    </p>
                    <button
                      onClick={() => addItem({
                        id: product.id,
                        name_ru: product.name_ru,
                        name_uz: product.name_uz,
                        price: product.price,
                        image: product.images?.[0] || '',
                        slug: product.slug,
                      })}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t.product.buy}
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Add more button */}
              {products.length < 4 && (
                <Link href="/catalog">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 hover:border-red-500/50 transition-colors cursor-pointer"
                  >
                    <Plus className="w-10 h-10 text-gray-600 mb-2" />
                    <span className="text-gray-400">{t.compare.addMore}</span>
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Comparison table */}
            <div className="bg-neutral-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 w-40">
                      {language === 'ru' ? 'Характеристика' : 'Xususiyat'}
                    </th>
                    {products.map((product) => (
                      <th key={product.id} className="px-6 py-4 text-left text-sm font-medium text-white">
                        <Link href={`/product?slug=${product.slug}`} className="hover:text-red-500 transition-colors line-clamp-2">
                          {language === 'ru' ? product.name_ru : product.name_uz}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price row */}
                  <tr className="border-b border-gray-800 bg-red-500/5">
                    <td className="px-6 py-4 text-sm text-gray-400">{t.compare.price}</td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-sm font-bold text-red-500">
                        {formatPrice(product.price)}
                      </td>
                    ))}
                  </tr>

                  {/* Brand row */}
                  <tr className="border-b border-gray-800">
                    <td className="px-6 py-4 text-sm text-gray-400">{t.compare.brand}</td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-sm text-white">
                        {product.brand || '-'}
                      </td>
                    ))}
                  </tr>

                  {/* Warranty row */}
                  <tr className="border-b border-gray-800">
                    <td className="px-6 py-4 text-sm text-gray-400">{t.compare.warranty}</td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-sm text-white">
                        {product.warranty_months} {t.product.months}
                      </td>
                    ))}
                  </tr>

                  {/* Stock row */}
                  <tr className="border-b border-gray-800">
                    <td className="px-6 py-4 text-sm text-gray-400">{t.compare.stock}</td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4 text-sm">
                        <span className={`flex items-center gap-2 ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          {product.stock > 0 ? t.product.inStock : t.product.outOfStock}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Specs rows */}
                  {allSpecs.map((spec) => (
                    <tr key={spec} className="border-b border-gray-800 last:border-b-0">
                      <td className="px-6 py-4 text-sm text-gray-400">{spec}</td>
                      {products.map((product) => {
                        const value = product.specs?.[spec];
                        // Find best value
                        const allValues = products.map(p => p.specs?.[spec]);
                        const numericValues = allValues.map(v => {
                          const num = parseFloat(v || '');
                          return isNaN(num) ? 0 : num;
                        });
                        const isBest = value && numericValues.every(v => {
                          const current = parseFloat(value);
                          return isNaN(current) || current >= v;
                        });

                        return (
                          <td
                            key={product.id}
                            className={`px-6 py-4 text-sm ${isBest && value ? 'text-red-500 font-medium' : 'text-white'}`}
                          >
                            {value || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
