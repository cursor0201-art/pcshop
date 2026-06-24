'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Layers, Disc, Database, Award, ShoppingCart, Trash2, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import { getProducts, Product } from '@/lib/api';

const STEPS = [
  { id: 'cpu', categoryId: 2, name_ru: 'Процессор', name_uz: 'Protsessor', icon: Cpu },
  { id: 'motherboard', categoryId: 4, name_ru: 'Материнская плата', name_uz: 'Ona plata', icon: Layers },
  { id: 'ram', categoryId: 5, name_ru: 'Оперативная память', name_uz: 'Operativ xotira', icon: Database },
  { id: 'gpu', categoryId: 3, name_ru: 'Видеокарта', name_uz: 'Videokarta', icon: Award },
  { id: 'ssd', categoryId: 6, name_ru: 'SSD Накопитель', name_uz: 'SSD Disk', icon: Disc },
];

export default function ConfiguratorPage() {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<string>('cpu');
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products for configurator:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const handleSelectComponent = (stepId: string, product: Product) => {
    setSelectedComponents(prev => ({
      ...prev,
      [stepId]: product
    }));
    
    // Automatically move to the next incomplete step or wrap up
    const currentIndex = STEPS.findIndex(s => s.id === stepId);
    if (currentIndex < STEPS.length - 1) {
      setActiveStep(STEPS[currentIndex + 1].id);
    }
  };

  const handleRemoveComponent = (stepId: string) => {
    setSelectedComponents(prev => {
      const updated = { ...prev };
      delete updated[stepId];
      return updated;
    });
  };

  const getFilteredProducts = (categoryId: number) => {
    return products.filter(p => p.category_id === categoryId);
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedComponents).reduce((sum, item) => sum + item.price, 0);
  };

  const handleAddAllToCart = () => {
    Object.values(selectedComponents).forEach(product => {
      addItem({
        id: product.id,
        name_ru: product.name_ru,
        name_uz: product.name_uz,
        price: product.price,
        image: product.images?.[0] || '',
        slug: product.slug
      });
    });
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ' + t.currency;
  };

  const checkCompatibility = () => {
    const cpu = selectedComponents['cpu'];
    const motherboard = selectedComponents['motherboard'];
    
    if (cpu && motherboard) {
      const cpuSocket = Object.entries(cpu.specs || {}).find(([k]) => k.toLowerCase().includes('сокет') || k.toLowerCase().includes('socket'))?.[1];
      const mbSocket = Object.entries(motherboard.specs || {}).find(([k]) => k.toLowerCase().includes('сокет') || k.toLowerCase().includes('socket'))?.[1];
      
      if (cpuSocket && mbSocket && cpuSocket.toLowerCase().trim() !== mbSocket.toLowerCase().trim()) {
        return {
          compatible: false,
          message_ru: `Внимание: Сокет процессора (${cpuSocket}) не совпадает с сокетом материнской платы (${mbSocket})!`,
          message_uz: `Diqqat: Protsessor soketi (${cpuSocket}) ona plata soketiga (${mbSocket}) mos kelmaydi!`
        };
      }
    }
    return { compatible: true };
  };

  const compatibility = checkCompatibility();

  const currentStepInfo = STEPS.find(s => s.id === activeStep);
  const stepProducts = currentStepInfo ? getFilteredProducts(currentStepInfo.categoryId) : [];

  // Breadcrumbs schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://pcshop.uz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Конфигуратор ПК",
        "item": "https://pcshop.uz/configurator"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
              {language === 'ru' ? 'Онлайн Конфигуратор ПК' : 'Onlayn PK Konfiguratori'}
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {language === 'ru' 
                ? 'Соберите компьютер своей мечты с автоматической проверкой совместимости комплектующих и моментальным расчетом стоимости.' 
                : 'Komponentlarning mosligini avtomatik tekshirish va narxni bir zumda hisoblash imkoniyati bilan orzuingizdagi kompyuterni yiging.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Steps & Selection area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stepper Navigation */}
              <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  const isSelected = selectedComponents[step.id];
                  const isActive = activeStep === step.id;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all flex-shrink-0 ${
                        isActive 
                          ? 'border-red-500 bg-red-500/10 text-white' 
                          : isSelected 
                            ? 'border-green-500/50 bg-green-500/5 text-green-400' 
                            : 'border-gray-800 bg-neutral-900/50 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : isSelected ? 'text-green-500' : 'text-gray-500'}`} />
                      <span>{language === 'ru' ? step.name_ru : step.name_uz}</span>
                    </button>
                  );
                })}
              </div>

              {/* Compatibility warning */}
              {!compatibility.compatible && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-sm">
                  {language === 'ru' ? compatibility.message_ru : compatibility.message_uz}
                </div>
              )}

              {/* Product Listing */}
              <div className="bg-neutral-900/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>
                    {language === 'ru' 
                      ? `Выберите ${currentStepInfo ? currentStepInfo.name_ru.toLowerCase() : ''}` 
                      : `Tanlang: ${currentStepInfo ? currentStepInfo.name_uz.toLowerCase() : ''}`}
                  </span>
                </h3>

                {loading ? (
                  <div className="space-y-4 py-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-neutral-900 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : stepProducts.length > 0 ? (
                  <div className="space-y-4">
                    {stepProducts.map((product) => {
                      const isChosen = selectedComponents[activeStep]?.id === product.id;
                      const name = language === 'ru' ? product.name_ru : product.name_uz;
                      
                      return (
                        <div
                          key={product.id}
                          className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border transition-all ${
                            isChosen 
                              ? 'border-red-500 bg-red-500/5' 
                              : 'border-gray-800 bg-neutral-900/50 hover:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                              {product.images?.[0] ? (
                                <Image src={product.images[0]} alt={name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-neutral-700" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-1">{name}</h4>
                              <p className="text-xs text-red-500 font-medium">{product.brand}</p>
                              {product.stock > 0 ? (
                                <p className="text-xs text-green-500 mt-1">{language === 'ru' ? 'В наличии' : 'Mavjud'}</p>
                              ) : (
                                <p className="text-xs text-red-500 mt-1">{language === 'ru' ? 'Нет в наличии' : 'Mavjud emas'}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                            <button
                              onClick={() => handleSelectComponent(activeStep, product)}
                              disabled={product.stock === 0}
                              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                isChosen 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700 disabled:opacity-50'
                              }`}
                            >
                              {isChosen ? (language === 'ru' ? 'Выбрано' : 'Tanlandi') : (language === 'ru' ? 'Выбрать' : 'Tanlash')}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {language === 'ru' ? 'Компоненты в данной категории не найдены.' : 'Ushbu kategoriyada komponentlar topilmadi.'}
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar Summary */}
            <div className="bg-neutral-900 border border-gray-800 rounded-2xl p-6 h-fit space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">
                {language === 'ru' ? 'Ваша Сборка' : 'Sizning Yig\'mangiz'}
              </h3>

              <div className="space-y-4">
                {STEPS.map((step) => {
                  const component = selectedComponents[step.id];
                  const name = component ? (language === 'ru' ? component.name_ru : component.name_uz) : null;
                  
                  return (
                    <div key={step.id} className="flex items-start justify-between gap-4 py-2">
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 block">{language === 'ru' ? step.name_ru : step.name_uz}</span>
                        {component ? (
                          <Link href={`/product?slug=${component.slug}`} className="text-sm text-white hover:text-red-500 transition-colors font-medium line-clamp-1">
                            {name}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-600 block">{language === 'ru' ? 'Не выбрано' : 'Tanlanmagan'}</span>
                        )}
                      </div>
                      
                      {component && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white">{formatPrice(component.price)}</span>
                          <button
                            onClick={() => handleRemoveComponent(step.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total Price & Add All */}
              <div className="border-t border-gray-800 pt-6 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 text-sm font-medium">{language === 'ru' ? 'Итого:' : 'Jami:'}</span>
                  <span className="text-2xl font-bold text-red-500">{formatPrice(calculateTotalPrice())}</span>
                </div>

                <AnimatePresence>
                  {showAddedToCart && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-3 rounded-lg bg-green-500/10 text-green-500 text-xs text-center border border-green-500/20"
                    >
                      {language === 'ru' ? 'Все комплектующие добавлены в корзину!' : 'Barcha butlovchi qismlar savatga qo\'shildi!'}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleAddAllToCart}
                  disabled={Object.keys(selectedComponents).length === 0}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold transition-all disabled:opacity-40"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {language === 'ru' ? 'Добавить сборку в корзину' : 'Yig\'mani savatga qo\'shish'}
                </button>
              </div>

            </div>

          </div>

          {/* PC Configurator FAQ Section */}
          <div className="mt-16 bg-neutral-900/50 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <span>{language === 'ru' ? 'Часто задаваемые вопросы о сборке ПК' : 'Kompyuter yig\'ish bo\'yicha FAQ'}</span>
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2">{language === 'ru' ? '1. Как работает проверка совместимости?' : '1. Moslikni tekshirish qanday ishlaydi?'}</h4>
                <p className="text-sm text-gray-400">
                  {language === 'ru' 
                    ? 'Наш конфигуратор сравнивает технические спецификации деталей (например, сокет процессора и разъем материнской платы). Если они не совпадают, вы увидите предупреждение.' 
                    : 'Konfiguratorimiz texnik xususiyatlarni (masalan, protsessor soketi va ona plata soketini) taqqoslaydi. Agar ular mos kelmasa, ogohlantirish paydo bo\'ladi.'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">{language === 'ru' ? '2. Предоставляется ли гарантия на собранный ПК?' : '2. Yig\'ilgan kompyuterga kafolat beriladimi?'}</h4>
                <p className="text-sm text-gray-400">
                  {language === 'ru' 
                    ? 'Да! На каждую деталь распространяется официальная индивидуальная гарантия. При заказе сборки у нас вы получаете комплексное обслуживание в сервисном центре.' 
                    : 'Ha! Har bir qismga rasmiy individual kafolat beriladi. Bizdan yig\'ishni buyurtma qilganingizda, xizmat ko\'rsatish markazida keng qamrovli xizmatga ega bo\'lasiz.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
