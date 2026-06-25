import { Metadata } from 'next';
import { Suspense } from 'react';
import CatalogPageClient from './CatalogClient';

export const metadata: Metadata = {
  title: 'Каталог комплектующих для ПК и игровых компьютеров | PcShop_uz',
  description: 'Широкий выбор комплектующих для компьютеров, видеокарт RTX, мощных процессоров и готовых игровых ПК в Ташкенте. Фильтры по бренду, цене и наличию. Доставка по Узбекистану.',
  keywords: 'каталог комплектующих ПК, купить видеокарту Ташкент, процессоры купить Узбекистан, готовые игровые компьютеры Ташкент',
  alternates: {
    canonical: 'https://pcshop.uz/catalog',
  },
};

export default function Page() {
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
        "name": "Каталог",
        "item": "https://pcshop.uz/catalog"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Загрузка каталога...</div>}>
        <CatalogPageClient />
      </Suspense>
    </>
  );
}
