import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://pcshop.uz'),
  title: 'PcShop_uz - Игровые ПК и комплектующие в Узбекистане (Ташкент)',
  description: 'Купить готовые игровые ПК и качественные комплектующие для компьютеров в Ташкенте с доставкой по всему Узбекистану. Официальная гарантия 1 год. Сборка ПК под заказ.',
  keywords: 'купить компьютер в Ташкенте, игровой компьютер Ташкент, видеокарта Ташкент, RTX Ташкент, процессор Ташкент, сборка ПК Ташкент, компьютерный магазин Узбекистан, комплектующие для ПК Узбекистан, PcShop_uz',
  alternates: {
    canonical: 'https://pcshop.uz',
    languages: {
      'ru-RU': 'https://pcshop.uz/?lang=ru',
      'uz-UZ': 'https://pcshop.uz/?lang=uz',
    },
  },
  openGraph: {
    title: 'PcShop_uz - Игровые ПК и комплектующие в Узбекистане',
    description: 'Магазин компьютерной техники в Узбекистане. Быстрая доставка, гарантия качества и выгодные цены.',
    type: 'website',
    url: 'https://pcshop.uz',
    siteName: 'PcShop_uz',
    locale: 'ru_RU',
    images: [
      {
        url: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
        width: 1200,
        height: 630,
        alt: 'PcShop_uz - Игровые ПК и комплектующие',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PcShop_uz - Игровые ПК и комплектующие в Узбекистане',
    description: 'Магазин компьютерной техники в Узбекистане. Быстрая доставка, гарантия качества и выгодные цены.',
    images: ['https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured schemas
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PcShop_uz",
    "url": "https://pcshop.uz",
    "logo": "https://pcshop.uz/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+998-99-823-09-90",
      "contactType": "customer service",
      "areaServed": "UZ",
      "availableLanguage": ["Russian", "Uzbek"]
    },
    "sameAs": [
      "https://t.me/pcshop_uzz"
    ]
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    "name": "PcShop_uz",
    "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
    "@id": "https://pcshop.uz/#localbusiness",
    "url": "https://pcshop.uz",
    "telephone": "+998998230990",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Юнусабад, Киёт 57",
      "addressLocality": "Ташкент",
      "addressRegion": "Ташкент",
      "postalCode": "100000",
      "addressCountry": "UZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.3500,
      "longitude": 69.2800
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PcShop_uz",
    "url": "https://pcshop.uz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://pcshop.uz/catalog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="ru" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-white`}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
