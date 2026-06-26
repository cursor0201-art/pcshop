'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Minus, Plus, ShoppingCart, Send, ChevronLeft, ChevronRight,
  Check, Shield, Truck, Clock, Phone, ArrowLeft, Scale
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { blogPosts } from '@/lib/blogData';
import { getProductBySlug, getSimilarProducts, getReviews } from '@/lib/api';


const getRelatedArticles = (productName: string, categoryId: number) => {
  const nameLower = productName.toLowerCase();
  
  if (nameLower.includes('видеокарт') || nameLower.includes('rtx') || nameLower.includes('gtx') || nameLower.includes('radeon') || categoryId === 3) {
    return blogPosts.filter(post => ['best-graphics-cards-2026', 'rtx-vs-radeon'].includes(post.slug));
  }
  if (nameLower.includes('процессор') || nameLower.includes('ryzen') || nameLower.includes('intel') || nameLower.includes('core') || nameLower.includes('amd') || categoryId === 2) {
    return blogPosts.filter(post => ['best-amd-processors', 'best-intel-processors'].includes(post.slug));
  }
  if (nameLower.includes('монитор') || categoryId === 11) {
    return blogPosts.filter(post => ['gaming-monitors'].includes(post.slug));
  }
  if (nameLower.includes('пк') || nameLower.includes('компьютер') || categoryId === 1) {
    return blogPosts.filter(post => ['how-to-choose-gaming-pc', 'pc-assembly-for-games', 'pc-for-work'].includes(post.slug));
  }
  
  return blogPosts.slice(0, 2);
};

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
  characteristics?: { id: number; name_ru: string; name_uz: string; value_ru: string; value_uz: string }[];
  images: string[];
  images_detail?: { url: string; color_name: string | null; color_code: string | null }[];
  is_featured: boolean;
  is_new: boolean;
  warranty_months: number;
  brand: string;
  created_at: string;
}

interface Review {
  id: number;
  author_name: string;
  rating: number;
  text: string;
  created_at: string;
}

export default function ProductPage({ overrideSlug }: { overrideSlug?: string }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = overrideSlug || searchParams.get('slug') || (params?.slug as string);
  const { t, language } = useLanguage();
  const { addItem, addToCompare, compareItems } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProductBySlug(slug);

        if (productData) {
          setProduct(productData);
          const name = language === 'ru' ? productData.name_ru : productData.name_uz;
          document.title = `${name} | PcShop_uz`;

          // Fetch similar products and reviews in parallel
          const [similarData, reviewsData] = await Promise.all([
            getSimilarProducts(productData.category_id, productData.id, 4),
            getReviews(productData.id),
          ]);

          setSimilarProducts(similarData || []);
          setReviews(reviewsData || []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      const name = language === 'ru' ? product.name_ru : product.name_uz;
      document.title = `${name} | PcShop_uz`;
    }
  }, [product, language]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ' + t.currency;
  };

  const discount = product?.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name_ru: product.name_ru,
        name_uz: product.name_uz,
        price: product.price,
        image: product.images?.[0] || '',
        slug: product.slug,
      });
    }
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-neutral-900 rounded mb-8" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-neutral-900 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-neutral-900 rounded" />
                <div className="h-6 w-1/4 bg-neutral-900 rounded" />
                <div className="h-12 w-1/3 bg-neutral-900 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {language === 'ru' ? 'Товар не найден' : 'Mahsulot topilmadi'}
          </h1>
          <Link href="/catalog" className="btn-primary">
            {language === 'ru' ? 'Вернуться в каталог' : 'Katalogga qaytish'}
          </Link>
        </div>
      </div>
    );
  }

  const name = language === 'ru' ? product.name_ru : product.name_uz;
  const description = language === 'ru' ? product.description_ru : product.description_uz;
  const isInCompare = compareItems.includes(product.id);

  // Get list of unique colors that have both a name and a code
  const uniqueColors = product.images_detail
    ? product.images_detail.reduce((acc: { color_name: string; color_code: string; image_index: number }[], img, idx) => {
        if (img.color_name && img.color_code) {
          const alreadyExists = acc.some(c => c.color_name.toLowerCase() === img.color_name?.toLowerCase());
          if (!alreadyExists) {
            acc.push({
              color_name: img.color_name,
              color_code: img.color_code,
              image_index: idx
            });
          }
        }
        return acc;
      }, [])
    : [];

  const currentColor = product.images_detail?.[selectedImage]?.color_name || null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            {t.nav.home}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <Link href="/catalog" className="hover:text-white transition-colors">
            {t.nav.catalog}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span className="text-white">{name}</span>
        </nav>

        {/* Back button */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'ru' ? 'Назад в каталог' : 'Katalogga qaytish'}
        </Link>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900"
            >
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <div className="w-24 h-24 rounded-full bg-neutral-800" />
                </div>
              )}

              {/* Navigation arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && (
                  <span className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg">
                    NEW
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg">
                    -{discount}%
                  </span>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-red-500'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-red-500 text-sm font-medium mb-2">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-400 ml-2">
                  {reviews.length} {language === 'ru' ? 'отзывов' : 'ta sharh'}
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-end gap-4">
                  <span className="text-3xl md:text-4xl font-bold text-red-500">
                    {formatPrice(product.price)}
                  </span>
                  {product.old_price && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.old_price)}
                    </span>
                  )}
                </div>
                {product.price_usd && (
                  <span className="text-sm text-gray-400 font-normal">
                    ~ {Number(product.price_usd).toLocaleString('en-US')} $
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                  {product.stock > 0
                    ? `${t.product.inStock} (${product.stock} ${language === 'ru' ? 'шт' : 'dona'})`
                    : t.product.outOfStock}
                </span>
              </div>

              {/* Warranty */}
              <div className="flex items-center gap-2 mb-8 text-gray-400">
                <Shield className="w-5 h-5 text-red-500" />
                <span>{t.product.warranty}: {product.warranty_months} {t.product.months}</span>
              </div>

              {/* Color swatches */}
              {uniqueColors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    {language === 'ru' ? 'Выберите цвет:' : 'Rangni tanlang:'}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {uniqueColors.map((color, idx) => {
                      const isActive = currentColor?.toLowerCase() === color.color_name.toLowerCase();
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(color.image_index)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                            isActive
                              ? 'border-red-500 bg-red-500/10 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                              : 'border-gray-800 bg-neutral-900 text-gray-400 hover:border-gray-600 hover:text-white'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/20"
                            style={{ backgroundColor: color.color_code }}
                          />
                          <span>{color.color_name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                {/* Quantity selector */}
                <div className="flex items-center justify-between sm:justify-start gap-1 bg-neutral-900 rounded-lg border border-gray-700 w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-3 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to cart */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t.product.addToCart}
                </motion.button>

                {/* Compare */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCompare(product.id)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl border transition-all ${
                    isInCompare
                      ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                      : 'border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Scale className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    {isInCompare
                      ? (language === 'ru' ? 'В сравнении' : 'Taqqoslashda')
                      : (language === 'ru' ? 'Сравнить' : 'Taqqoslash')}
                  </span>
                </motion.button>
              </div>

              {/* Added to cart notification */}
              <AnimatePresence>
                {showAddedToCart && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 text-green-500 mb-6"
                  >
                    <Check className="w-5 h-5" />
                    {language === 'ru' ? 'Товар добавлен в корзину' : 'Mahsulot savatga qo\'shildi'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick info */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Truck, text: language === 'ru' ? 'Доставка' : 'Yetkazib berish' },
                  { icon: Shield, text: language === 'ru' ? 'Гарантия' : 'Kafolat' },
                  { icon: Clock, text: language === 'ru' ? 'Поддержка 24/7' : "24/7 qo'llab-quvvatlash" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-900 border border-gray-800">
                    <item.icon className="w-6 h-6 text-red-500" />
                    <span className="text-xs text-gray-400 text-center">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Telegram */}
              <a
                href="https://telegram.me/pcshop_uzz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-neutral-900 border border-gray-800 hover:border-red-500/50 transition-colors"
              >
                <Send className="w-5 h-5 text-red-500" />
                <span className="text-white">{t.product.telegram}</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-4 border-b border-gray-800 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'specs'
                  ? 'text-red-500 border-red-500'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {t.product.specifications}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'text-red-500 border-red-500'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {t.product.reviews} ({reviews.length})
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'specs' ? (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {description && (
                  <p className="text-gray-300 mb-6">{description}</p>
                )}

                {((product.characteristics && product.characteristics.length > 0) || Object.keys(product.specs || {}).length > 0) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.characteristics && product.characteristics.length > 0
                      ? product.characteristics.map((char) => {
                          const key = language === 'ru' ? char.name_ru : char.name_uz;
                          const value = language === 'ru' ? char.value_ru : char.value_uz;
                          return (
                            <div
                              key={char.id}
                              className="flex justify-between p-4 rounded-xl bg-neutral-900 border border-gray-800"
                            >
                              <span className="text-gray-400">{key}</span>
                              <span className="text-white font-medium">{value}</span>
                            </div>
                          );
                        })
                      : Object.entries(product.specs).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between p-4 rounded-xl bg-neutral-900 border border-gray-800"
                          >
                            <span className="text-gray-400">{key}</span>
                            <span className="text-white font-medium">{value}</span>
                          </div>
                        ))
                    }
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-6 rounded-xl bg-neutral-900 border border-gray-800"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-white">{review.author_name}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    {language === 'ru' ? 'Отзывов пока нет' : 'Sharhlar yo\'q'}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">{t.product.similar}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((p, index) => (
                <SimilarProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Related Blog Posts */}
        {product && (
          <div className="mt-16 border-t border-gray-800 pt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === 'ru' ? 'Полезные статьи в нашем блоге' : 'Blogimizdagi foydali maqolalar'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {getRelatedArticles(product.name_ru || product.name_uz, product.category_id).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <div className="flex gap-4 p-4 rounded-xl bg-neutral-900 border border-gray-800 hover:border-red-500/50 transition-all">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-800">
                      <Image
                        src={post.image}
                        alt={language === 'ru' ? post.title_ru : post.title_uz}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-2">
                          {language === 'ru' ? post.title_ru : post.title_uz}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {language === 'ru' ? post.excerpt_ru : post.excerpt_uz}
                        </p>
                      </div>
                      <span className="text-xs text-red-500 font-medium mt-2">
                        {language === 'ru' ? 'Читать статью →' : 'Maqolani o\'qish →'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SimilarProductCard({ product, index }: { product: Product; index: number }) {
  const { language, t } = useLanguage();
  const name = language === 'ru' ? product.name_ru : product.name_uz;
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ' + t.currency;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/product?slug=${product.slug}`}>
        <div className="group bg-neutral-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all">
          <div className="relative aspect-square bg-neutral-800">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <div className="w-12 h-12 rounded-full bg-neutral-700" />
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                -{discount}%
              </span>
            )}
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
            <h3 className="text-sm text-white line-clamp-2 group-hover:text-red-500 transition-colors mb-2">
              {name}
            </h3>
            <p className="text-sm font-bold text-red-500">{formatPrice(product.price)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
