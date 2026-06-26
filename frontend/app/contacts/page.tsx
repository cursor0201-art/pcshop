import { Metadata } from 'next';
import ContactsPageClient from './ContactsClient';

export const metadata: Metadata = {
  title: 'Контакты - Компьютерный магазин PcShop_uz в Узбекистане',
  description: 'Контакты магазина компьютерной техники PcShop_uz в Ташкенте. Телефоны: +998 (99) 823-09-90, +998 (88) 890-70-00. Наши адреса: ул. Лабзак, 2А и Торговые ряды Малика, 31б. Напишите нам в Telegram.',
  keywords: 'контакты PcShop_uz, телефон компьютерного магазина Ташкент, адрес PcShop Ташкент, купить компьютер Узбекистан',
  alternates: {
    canonical: 'https://storepcshop.uz/contacts',
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
        "item": "https://storepcshop.uz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Контакты",
        "item": "https://storepcshop.uz/contacts"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactsPageClient />
    </>
  );
}
