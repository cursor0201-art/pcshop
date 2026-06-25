'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, X, ChevronDown, Grid3X3, LayoutList,
  ArrowUpDown, Search, SlidersHorizontal
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/api';


interface Product {
  id: number;
  category_id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
  description_ru: string;
  description_uz: string;
  price: number;
  price_usd?: number | null;
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

interface Category {
  id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
}

const sortOptions = [
  { value: 'newest', key: 'byNew' },
  { value: 'price_asc', key: 'byPriceAsc' },
  { value: 'price_desc', key: 'byPriceDesc' },
  { value: 'name', key: 'byName' },
];

export default function CatalogPage() {
  const { t, language } = useLanguage();
  const { addItem, addToCompare, compareItems } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [minPriceInput, setMinPriceInput] = useState<string>('');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique brands from products
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    return uniqueBrands.sort();
  }, [products]);

  // Get price bounds of all products
  const priceBounds = useMemo(() => {
    if (products.length === 0) return [0, 0];
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return [min, max];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) {
        result = result.filter(p => p.category_id === cat.id);
      }
    }

    // Brand filter
    if (selectedBrand.length > 0) {
      result = result.filter(p => selectedBrand.includes(p.brand));
    }

    // Price filter
    const minP = minPriceInput === '' ? 0 : Number(minPriceInput);
    const maxP = maxPriceInput === '' ? Infinity : Number(maxPriceInput);
    result = result.filter(p => p.price >= minP && p.price <= maxP);

    // Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

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
  }, [products, selectedCategory, selectedBrand, minPriceInput, maxPriceInput, inStockOnly, sortBy, searchQuery, categories, language]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('');
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) {
        const catName = language === 'ru' ? cat.name_ru : cat.name_uz;
        document.title = `${catName} купить в Ташкенте по выгодным ценам | PcShop_uz`;
        
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) {
          descMeta.setAttribute('content', `Широкий ассортимент товаров в категории ${catName}. Купить с гарантией и быстрой доставкой по Ташкенту и Узбекистану.`);
        }
        
        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (keywordsMeta) {
          keywordsMeta.setAttribute('content', `${catName}, купить ${catName} Ташкент, комплектующие для ПК в Узбекистане, PcShop_uz`);
        }
      }
    } else {
      document.title = 'Каталог комплектующих для ПК и игровых компьютеров | PcShop_uz';
    }
  }, [selectedCategory, categories, language]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ' + t.currency;
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    if (slug) {
      router.push(`/catalog?category=${slug}`, { scroll: false });
    } else {
      router.push('/catalog', { scroll: false });
    }
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand([]);
    setMinPriceInput('');
    setMaxPriceInput('');
    setInStockOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
    router.push('/catalog', { scroll: false });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedBrand.length > 0) count++;
    if (minPriceInput !== '' || maxPriceInput !== '') count++;
    if (inStockOnly) count++;
    if (searchQuery) count++;
    return count;
  }, [selectedCategory, selectedBrand, minPriceInput, maxPriceInput, inStockOnly, searchQuery]);

  // Product card component
  const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const name = language === 'ru' ? product.name_ru : product.name_uz;
    const isInCompare = compareItems.includes(product.id);
    const discount = product.old_price
      ? Math.round((1 - product.price / product.old_price) * 100)
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`group bg-neutral-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all duration-300 ${
          viewMode === 'list' ? 'flex' : ''
        }`}
      >
        <Link href={`/product?slug=${product.slug}`} className={viewMode === 'list' ? 'flex w-full' : 'block'}>
          {/* Image */}
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
                <Grid3X3 className="w-12 h-12" />
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

            {/* Compare button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCompare(product.id);
              }}
              className={`absolute top-3 right-3 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                isInCompare ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5M8 3H3v5M21 3l-7 7M3 3l7 7M16 21h5v-5M8 21H3v-5M21 21l-7-7M3 21l7-7" />
              </svg>
            </motion.button>
          </div>

          {/* Content */}
          <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
            <div>
              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
              <h3 className="font-medium text-white line-clamp-2 group-hover:text-red-500 transition-colors mb-3">
                {name}
              </h3>
            </div>

            <div className={`flex items-end justify-between ${viewMode === 'list' ? 'mt-auto pt-4' : ''}`}>
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
                  e.stopPropagation();
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

            {/* Stock status */}
            <div className="mt-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400">
                {product.stock > 0 ? t.product.inStock : t.product.outOfStock}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.nav.catalog}</h1>
            <p className="text-gray-400">
              {filteredProducts.length} {language === 'ru' ? 'товаров' : 'ta mahsulot'}
              {activeFiltersCount > 0 && ` (${activeFiltersCount} ${language === 'ru' ? 'фильтров' : 'ta filtr'})`}
            </p>
          </div>

          {/* Search & Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial min-w-[200px] md:min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t.search.placeholder}
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg bg-neutral-900 border border-gray-800 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
              {/* Sort */}
              <div className="relative flex-1 md:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full md:w-auto pl-4 pr-10 py-2 rounded-lg bg-neutral-900 border border-gray-800 text-white focus:border-red-500 focus:outline-none cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t.filter[opt.key as keyof typeof t.filter]}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* View mode */}
              <div className="hidden sm:flex items-center gap-1 bg-neutral-900 rounded-lg border border-gray-800 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>

              {/* Filter toggle (mobile) */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-gray-800 text-white flex-1 md:flex-initial"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t.filter.filter}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 relative">
          {/* Mobile overlay backdrop */}
          {isFilterOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Filters Sidebar */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-[9999] lg:z-30 w-80 lg:w-72 bg-neutral-950 lg:bg-transparent border-r border-neutral-900 lg:border-none overflow-y-auto lg:overflow-visible transition-all duration-300 ${
              isFilterOpen 
                ? 'translate-x-0 opacity-100 pointer-events-auto' 
                : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'
            }`}
          >
              <div className="p-6 lg:p-0 space-y-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+6rem)] lg:pb-0">
                {/* Mobile filter header */}
                <div className="lg:hidden flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">{t.filter.filter}</h2>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                    aria-label="Close filters"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Categories Accordion */}
                <div className="border-b border-neutral-800/60 pb-4">
                  <button
                    type="button"
                    onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-white py-2 group focus:outline-none"
                  >
                    <span className="group-hover:text-red-500 transition-colors">{t.nav.catalog}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform duration-300 ${isCategoriesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`space-y-1 mt-2 overflow-hidden transition-all duration-300 ${isCategoriesExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <button
                      onClick={() => {
                        handleCategoryChange('');
                        // Keep open on desktop but can auto-close on mobile if desired
                      }}
                      className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors min-h-[44px] flex items-center ${
                        !selectedCategory
                          ? 'bg-red-500/10 text-red-500 font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {language === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors min-h-[44px] flex items-center ${
                          selectedCategory === cat.slug
                            ? 'bg-red-500/10 text-red-500 font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {language === 'ru' ? cat.name_ru : cat.name_uz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div className="border-b border-neutral-800/60 pb-4">
                    <h3 className="text-sm font-semibold text-white mb-3">{t.filter.brand}</h3>
                    <div className="space-y-1">
                      {brands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-3 cursor-pointer group min-h-[44px] py-1 px-1 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrand.includes(brand)}
                            onChange={() => {
                              handleBrandChange(brand);
                              setCurrentPage(1);
                            }}
                            className="w-5 h-5 rounded border-gray-600 bg-neutral-850 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price range */}
                <div className="border-b border-neutral-800/60 pb-4">
                  <h3 className="text-sm font-semibold text-white mb-3">{t.filter.price}</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">от</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9]*"
                          value={minPriceInput}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setMinPriceInput(val);
                            setCurrentPage(1);
                          }}
                          placeholder="Min"
                          className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-neutral-800 border border-gray-700 text-white text-sm focus:border-red-500 focus:outline-none min-h-[44px]"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">до</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9]*"
                          value={maxPriceInput}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setMaxPriceInput(val);
                            setCurrentPage(1);
                          }}
                          placeholder="Max"
                          className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-neutral-800 border border-gray-700 text-white text-sm focus:border-red-500 focus:outline-none min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* Range Slider for fast budget selection */}
                    <div className="pt-2 px-1">
                      <input
                        type="range"
                        min={priceBounds[0] || 0}
                        max={priceBounds[1] || 10000000}
                        value={maxPriceInput ? parseInt(maxPriceInput) : (priceBounds[1] || 10000000)}
                        onChange={(e) => {
                          setMaxPriceInput(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                        style={{
                          background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((maxPriceInput ? parseInt(maxPriceInput) : priceBounds[1]) - priceBounds[0]) / (priceBounds[1] - priceBounds[0] || 1) * 100}%, #262626 ${((maxPriceInput ? parseInt(maxPriceInput) : priceBounds[1]) - priceBounds[0]) / (priceBounds[1] - priceBounds[0] || 1) * 100}%, #262626 100%)`
                        }}
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>{formatPrice(priceBounds[0])}</span>
                        <span>{formatPrice(priceBounds[1])}</span>
                      </div>
                    </div>

                    {products.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {formatPrice(priceBounds[0])} — {formatPrice(priceBounds[1])}
                      </p>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="pb-4">
                  <h3 className="text-sm font-semibold text-white mb-3">{t.filter.availability}</h3>
                  <label className="flex items-center gap-3 cursor-pointer group min-h-[44px] py-1 px-1 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => {
                        setInStockOnly(e.target.checked);
                        setCurrentPage(1);
                      }}
                      className="w-5 h-5 rounded border-gray-600 bg-neutral-800 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      {t.product.inStock}
                    </span>
                  </label>
                </div>

                {/* Mobile Show Products / Close Button */}
                <div className="lg:hidden pt-4 border-t border-neutral-800/80 mt-6 pb-safe">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-semibold transition-all flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-red-600/30"
                  >
                    <span>{language === 'ru' ? 'Показать товары' : 'Mahsulotlarni ko\'rsatish'}</span>
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {filteredProducts.length}
                    </span>
                  </button>
                </div>

                {/* Clear filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors min-h-[44px] text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    {t.filter.reset}
                  </button>
                )}
              </div>
            </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-neutral-900 rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-neutral-900 border border-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
                    >
                      {language === 'ru' ? 'Назад' : 'Orqaga'}
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              currentPage === pageNum
                                ? 'bg-red-500 text-white'
                                : 'bg-neutral-900 text-gray-400 hover:text-white hover:bg-neutral-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-neutral-900 border border-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
                    >
                      {language === 'ru' ? 'Далее' : 'Keyingi'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-900 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t.search.noResults}</h3>
                <p className="text-gray-400 mb-6">
                  {language === 'ru'
                    ? 'Попробуйте изменить параметры поиска'
                    : 'Qidiruv parametrlarini o\'zgartirib ko\'ring'}
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  {t.filter.reset}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
