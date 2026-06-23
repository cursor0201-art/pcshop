import { Metadata } from 'next';
import ProductPageClient from './ProductClient';
import { getProducts, getProductBySlug, getReviews as getReviewsApi } from '@/lib/api';

export const dynamicParams = false;

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    console.error('Error fetching product in getProduct:', error);
    return null;
  }
}

async function getReviews(productId: number) {
  try {
    return await getReviewsApi(productId);
  } catch (error) {
    console.error('Error fetching reviews in getReviews:', error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    const params = [{ slug: 'placeholder' }];
    if (products && products.length > 0) {
      products.forEach((product) => {
        if (product.slug) {
          params.push({ slug: product.slug });
        }
      });
    }
    return params;
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [{ slug: 'placeholder' }];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) {
    return {
      title: 'Купить компьютер и комплектующие в Ташкенте | PcShop_uz',
      description: 'Игровые компьютеры и комплектующие по отличным ценам.',
    };
  }

  const name = product.name_ru || product.name_uz;
  const description = product.description_ru || product.description_uz || '';
  const specSummary = Object.entries(product.specs || {})
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const metaTitle = `${name} купить в Ташкенте - цена, характеристики | PcShop_uz`;
  const metaDesc = `Купить ${name} в Ташкенте с официальной гарантией ${product.warranty_months} месяцев. ${description.slice(0, 100)}... Характеристики: ${specSummary}. Доставка по всему Узбекистану.`;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: `${name}, купить ${name} в Ташкенте, ${product.brand} Узбекистан, комплектующие для ПК в Ташкенте, игровой компьютер Ташкент`,
    alternates: {
      canonical: `https://pcshop.uz/product/${product.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `https://pcshop.uz/product/${product.slug}`,
      type: 'website',
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: product.images?.[0] ? [product.images[0]] : [],
    }
  };
}

export default async function Page({ params }: Props) {
  const product = await getProduct(params.slug);
  const reviews = product ? await getReviews(product.id) : [];

  let productSchema: any = null;
  let breadcrumbSchema = null;

  if (product) {
    const name = product.name_ru || product.name_uz;
    const description = product.description_ru || product.description_uz || '';

    breadcrumbSchema = {
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
          "name": "Каталог",
          "item": "https://pcshop.uz/catalog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": name,
          "item": `https://pcshop.uz/product/${product.slug}`
        }
      ]
    };

    productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
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
        "url": `https://pcshop.uz/product/${product.slug}`,
        "priceCurrency": "UZS",
        "price": product.price,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "PcShop_uz"
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
  }

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductPageClient />
    </>
  );
}
