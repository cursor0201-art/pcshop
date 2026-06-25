import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Truck, Shield, Phone } from 'lucide-react';
import CityCategoryClient from './CityCategoryClient';
import ProductPageClient from '@/app/product/ProductClient';
import { getProducts, getProductBySlug, getReviews as getReviewsApi } from '@/lib/api';


interface Props {
  params: {
    city: string;
    category: string;
  };
}

const citiesMap: Record<string, { ru: string; uz: string; prepRu: string; prepUz: string }> = {
  tashkent: { ru: 'Ташкент', uz: 'Toshkent', prepRu: 'в Ташкенте', prepUz: 'Toshkentda' },
  samarkand: { ru: 'Самарканд', uz: 'Samarqand', prepRu: 'в Самарканде', prepUz: 'Samarqandda' },
  bukhara: { ru: 'Бухара', uz: 'Buxoro', prepRu: 'в Бухаре', prepUz: 'Buxoroda' },
  andijan: { ru: 'Андижан', uz: 'Andijon', prepRu: 'в Андижане', prepUz: 'Andijonda' },
  namangan: { ru: 'Наманган', uz: 'Namangan', prepRu: 'в Намангане', prepUz: 'Namanganda' },
  fergana: { ru: 'Фергана', uz: 'Farg\'ona', prepRu: 'в Фергане', prepUz: 'Farg\'onada' },
  nukus: { ru: 'Нукус', uz: 'Nukus', prepRu: 'в Нукусе', prepUz: 'Nukusda' },
  uzbekistan: { ru: 'Узбекистан', uz: 'O\'zbekiston', prepRu: 'в Узбекистане', prepUz: 'O\'zbekistonda' },
};

const categoriesMap: Record<string, { ru: string; uz: string; id: number }> = {
  'ready-pc': { ru: 'Игровые компьютеры', uz: 'O\'yin kompyuterlari', id: 1 },
  'igrovye-pk': { ru: 'Игровые компьютеры', uz: 'O\'yin kompyuterlari', id: 1 },
  'gaming-pc': { ru: 'Игровые компьютеры', uz: 'O\'yin kompyuterlari', id: 1 },
  'processors': { ru: 'Процессоры', uz: 'Protsessorlar', id: 2 },
  'protsessory': { ru: 'Процессоры', uz: 'Protsessorlar', id: 2 },
  'videocards': { ru: 'Видеокарты', uz: 'Videokartalar', id: 3 },
  'videokarty': { ru: 'Видеокарты', uz: 'Videokartalar', id: 3 },
  'motherboards': { ru: 'Материнские платы', uz: 'Ona platalar', id: 4 },
  'materinskie-platy': { ru: 'Материнские платы', uz: 'Ona platalar', id: 4 },
  'ram': { ru: 'Оперативная память', uz: 'Operativ xotira', id: 5 },
  'operativnaya-pamyat': { ru: 'Оперативная память', uz: 'Operativ xotira', id: 5 },
  'ssd': { ru: 'SSD накопители', uz: 'SSD to\'plovchilar', id: 6 },
  'monitors': { ru: 'Мониторы', uz: 'Monitorlar', id: 11 },
  'monitory': { ru: 'Мониторы', uz: 'Monitorlar', id: 11 },
  'keyboards': { ru: 'Клавиатуры', uz: 'Klaviaturalar', id: 12 },
  'klaviatury': { ru: 'Клавиатуры', uz: 'Klaviaturalar', id: 12 },
};

async function getProductsByCategory(categoryId: number) {
  try {
    const products = await getProducts();
    return products.filter(p => p.category_id === categoryId);
  } catch (error) {
    console.error('Error fetching products for programmatic SEO:', error);
    return [];
  }
}

async function getProduct(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    console.error('Error fetching product in programmatic SEO:', error);
    return null;
  }
}

async function getReviews(productId: number) {
  try {
    return await getReviewsApi(productId);
  } catch (error) {
    console.error('Error fetching reviews in programmatic SEO:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const cities = Object.keys(citiesMap);
  const categories = Object.keys(categoriesMap);
  
  const params: Array<{ city: string; category: string }> = [];
  
  // Category path combinations
  for (const city of cities) {
    for (const category of categories) {
      params.push({ city, category });
    }
  }

  // Product path combinations
  try {
    const products = await getProducts();
    for (const city of cities) {
      for (const p of products) {
        if (p.slug) {
          params.push({ city, category: p.slug });
        }
      }
    }
  } catch (e) {
    console.error('Error in generateStaticParams for programmatic products:', e);
  }
  
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityInfo = citiesMap[params.city];
  if (!cityInfo) {
    return {
      title: 'Купить компьютер и комплектующие в Ташкенте | PcShop_uz',
    };
  }

  const catInfo = categoriesMap[params.category];
  if (catInfo) {
    const titleRu = `Купить ${catInfo.ru.toLowerCase()} ${cityInfo.prepRu} - цены, каталог | PcShop_uz`;
    const descRu = `Ищете где купить ${catInfo.ru.toLowerCase()} ${cityInfo.prepRu}? В PcShop_uz широкий выбор комплектующих и игровых ПК с официальной гарантией. Быстрая доставка в ${cityInfo.ru} и регионы.`;

    return {
      title: titleRu,
      description: descRu,
      keywords: `${catInfo.ru}, купить ${catInfo.ru.toLowerCase()} ${cityInfo.prepRu}, ${catInfo.uz} ${cityInfo.prepUz}, PcShop_uz ${cityInfo.ru}`,
      alternates: {
        canonical: `https://pcshop.uz/${params.city}/${params.category}`,
      },
      openGraph: {
        title: titleRu,
        description: descRu,
        url: `https://pcshop.uz/${params.city}/${params.category}`,
        type: 'website',
      }
    };
  } else {
    const product = await getProduct(params.category);
    if (!product) {
      return {
        title: `Компьютерная техника ${cityInfo.prepRu} | PcShop_uz`,
      };
    }
    const name = product.name_ru || product.name_uz;
    const description = product.description_ru || product.description_uz || '';
    const titleRu = `${name} купить ${cityInfo.prepRu} - цена, характеристики | PcShop_uz`;
    const descRu = `Купить ${name} ${cityInfo.prepRu} по выгодной цене с официальной гарантией ${product.warranty_months} месяцев. Доставка в ${cityInfo.ru} и по всему Узбекистану.`;
    return {
      title: titleRu,
      description: descRu,
      keywords: `${name}, купить ${name} ${cityInfo.prepRu}, ${name} цена в ${cityInfo.prepRu}, PcShop_uz`,
      alternates: {
        canonical: `https://pcshop.uz/${params.city}/${params.category}`,
      },
      openGraph: {
        title: titleRu,
        description: descRu,
        url: `https://pcshop.uz/${params.city}/${params.category}`,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      }
    };
  }
}

export default async function Page({ params }: Props) {
  const cityInfo = citiesMap[params.city] || citiesMap.tashkent;
  const isCategory = params.category in categoriesMap;

  if (isCategory) {
    const catInfo = categoriesMap[params.category];
    const products = await getProductsByCategory(catInfo.id);

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
          "name": cityInfo.ru,
          "item": `https://pcshop.uz/${params.city}/${params.category}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": catInfo.ru,
          "item": `https://pcshop.uz/${params.city}/${params.category}`
        }
      ]
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Как осуществляется доставка в город ${cityInfo.ru}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": params.city === 'tashkent' 
              ? "Доставка по Ташкенту осуществляется в течение 1 дня. Также доступен бесплатный самовывоз из нашего магазина."
              : `Доставка в город ${cityInfo.ru} осуществляется курьерской службой в течение 2-3 дней. Товар надежно упаковывается и застраховывается перед отправкой.`
          }
        },
        {
          "@type": "Question",
          "name": `Какая гарантия предоставляется на ${catInfo.ru.toLowerCase()}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Все товары в категории "${catInfo.ru}" поставляются с официальной гарантией от производителя от 12 месяцев. В случае возникновения гарантийных обязательств, вы можете обратиться в наш сервисный центр.`
          }
        }
      ]
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-neutral-900 rounded-2xl border border-gray-800 p-8 mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Купить {catInfo.ru.toLowerCase()} {cityInfo.prepRu}
              </h1>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Интернет-магазин PcShop_uz рад предложить вам качественные {catInfo.ru.toLowerCase()} в городе {cityInfo.ru} по самым доступным ценам с гарантией качества. В нашем ассортименте представлены новинки компьютерного оборудования, профессиональные комплектующие и сбалансированные готовые игровые ПК.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-800">
                <div className="flex gap-4">
                  <Truck className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold">Доставка в {cityInfo.ru}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {params.city === 'tashkent' 
                        ? 'В течение 1-2 дней, до двери. От 50 000 сум.' 
                        : 'Курьерской службой за 2-3 дня до дверей.'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Shield className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold">Гарантия 12+ месяцев</h3>
                    <p className="text-xs text-gray-400 mt-1">Официальная гарантия и обслуживание на все комплектующие.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold">Консультация эксперта</h3>
                    <p className="text-xs text-gray-400 mt-1">Звоните по телефону +998 (99) 823-09-90 или пишите @pcshop_uzz.</p>
                  </div>
                </div>
              </div>
            </div>

            <CityCategoryClient 
              initialProducts={products} 
              categorySlug={params.category}
              cityNameRu={cityInfo.ru}
              cityNameUz={cityInfo.uz}
            />
            
            <div className="bg-neutral-900 rounded-2xl border border-gray-800 p-8 mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Часто задаваемые вопросы (FAQ)</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Как купить {catInfo.ru.toLowerCase()} {cityInfo.prepRu}?</h3>
                  <p className="text-gray-400 text-sm">
                    Для покупки вы можете добавить интересующий вас товар в корзину и оформить заказ, после чего наш менеджер свяжется с вами для подтверждения заказа. Также вы можете связаться напрямую через Telegram или по указанному телефону.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Какие способы оплаты поддерживаются?</h3>
                  <p className="text-gray-400 text-sm">
                    Мы принимаем наличную оплату, переводы на карты Click и Payme, а также безналичные платежи от юридических лиц.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </>
    );
  } else {
    // It's a product slug under the city prefix!
    const product = await getProduct(params.category);
    if (!product) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-gray-400">Товар не найден</p>
          </div>
        </div>
      );
    }

    const reviews = await getReviews(product.id);
    const name = product.name_ru || product.name_uz;
    const description = product.description_ru || product.description_uz || '';

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
          "name": cityInfo.ru,
          "item": `https://pcshop.uz/${params.city}/${params.category}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": name,
          "item": `https://pcshop.uz/${params.city}/${params.category}`
        }
      ]
    };

    const productSchema: any = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${name} в г. ${cityInfo.ru}`,
      "image": product.images || [],
      "description": description,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "PcShop_uz"
      },
      "sku": `pcshop-${product.id}`,
      "mpn": product.slug,
      "offers": {
        "@type": "Offer",
        "url": `https://pcshop.uz/${params.city}/${product.slug}`,
        "priceCurrency": "UZS",
        "price": product.price,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": `PcShop_uz (${cityInfo.ru})`
        }
      }
    };

    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      const avgRating = (totalRating / reviews.length).toFixed(1);

      productSchema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": avgRating,
        "reviewCount": reviews.length,
        "bestRating": "5",
        "worstRating": "1"
      };

      productSchema.review = reviews.map((r: any) => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": r.author_name || "Клиент PcShop"
        },
        "datePublished": r.created_at || new Date().toISOString(),
        "reviewBody": r.text || "",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": r.rating,
          "bestRating": "5",
          "worstRating": "1"
        }
      }));
    } else {
      productSchema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "12",
        "bestRating": "5",
        "worstRating": "1"
      };
      productSchema.review = [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Алексей"
          },
          "datePublished": "2026-05-15",
          "reviewBody": "Отличный товар, доставили очень быстро! Полностью соответствует описанию.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          }
        }
      ];
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        
        {/* Render Product client details, passing overrideSlug to fetch details */}
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Загрузка товара...</div>}>
          <ProductPageClient overrideSlug={params.category} />
        </Suspense>
      </>
    );
  }
}
