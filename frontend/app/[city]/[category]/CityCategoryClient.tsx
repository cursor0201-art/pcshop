'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Grid3X3, LayoutList, ArrowUpDown, Search, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: number;
  category_id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
  description_ru: string;
  description_uz: string;
  price: number;
  old_price: number | null;
  stock: number;
  specs: Record<string, string>;
  images: string[];
  is_featured: boolean;
  is_new: boolean;
  warranty_months: number;
  brand: string;
  created_at: string;
}

interface Props {
  initialProducts: Product[];
  categorySlug: string;
  cityNameRu: string;
  cityNameUz: string;
}

export default function CityCategoryClient({ initialProducts, categorySlug, cityNameRu, cityNameUz }: Props) {
  const { t, language } = useLanguage();
  const { addItem, addToCompare, compareItems } = useCart();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name_ru.toLowerCase().includes(query) ||
        p.name_uz.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => {
          const nameA = language === 'ru' ? a.name_ru : a.name_uz;
          const nameB = language === 'ru' ? b.name_ru : b.name_uz;
          return nameA.localeCompare(nameB);
        });
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [initialProducts, sortBy, searchQuery, language]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ' + t.currency;
  };

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-neutral-900 p-4 rounded-xl border border-gray-800">
        <div className="text-gray-400">
          Найдено: <span className="text-white font-semibold">{filteredProducts.length}</span> товаров {language === 'ru' ? `в г. ${cityNameRu}` : `${cityNameUz}da`}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search.placeholder}
              className="w-48 pl-10 pr-4 py-2 rounded-lg bg-neutral-800 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none text-sm"
            />
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 rounded-lg bg-neutral-800 border border-gray-700 text-white text-sm focus:border-red-500 focus:outline-none cursor-pointer"
            >
              <option value="newest">Сначала новые</option>
              <option value="price_asc">Дешевые сначала</option>
              <option value="price_desc">Дорогие сначала</option>
              <option value="name">По алфавиту</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* View switches */}
          <div className="flex items-center gap-1 bg-neutral-800 rounded-lg border border-gray-700 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product, index) => {
            const name = language === 'ru' ? product.name_ru : product.name_uz;
            const discount = product.old_price
              ? Math.round((1 - product.price / product.old_price) * 100)
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group bg-neutral-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <Link href={`/product/${product.slug}`} className={viewMode === 'list' ? 'flex w-full' : 'block'}>
                  <div className={`relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 ${
                    viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                  }`}>
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Grid3X3 className="w-8 h-8" />
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className={`p-4 flex-1 flex flex-col justify-between`}>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-red-500 transition-colors mb-2">
                        {name}
                      </h3>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-800/40 flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-red-500">{formatPrice(product.price)}</p>
                        {product.old_price && (
                          <p className="text-xs text-gray-500 line-through">{formatPrice(product.old_price)}</p>
                        )}
                      </div>

                      <button
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
                        <Zap className="w-4 h-4 fill-white" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-900 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-lg">В данной категории временно отсутствуют товары.</p>
        </div>
      )}
    </div>
  );
}
