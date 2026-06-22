import { Metadata } from 'next';
import AboutPageClient from './AboutClient';

export const metadata: Metadata = {
  title: 'О нас - Компьютерный магазин PcShop_uz в Ташкенте',
  description: 'Узнайте больше о PcShop_uz. Мы предлагаем надежные готовые игровые компьютеры, качественные комплектующие и профессиональную сборку ПК в Ташкенте с гарантией 1 год.',
  keywords: 'о магазине PcShop_uz, компьютерный магазин Ташкент, комплектующие для ПК Узбекистан, собрать компьютер Ташкент',
  alternates: {
    canonical: 'https://pcshop.uz/about',
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
        "name": "О нас",
        "item": "https://pcshop.uz/about"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutPageClient />
    </>
  );
}
