import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://storepcshop.uz'),
  title: 'PcShop_uz - Игровые ПК и комплектующие в Узбекистане (Ташкент)',
  description: 'Купить готовые игровые ПК и качественные комплектующие для компьютеров в Ташкенте с доставкой по всему Узбекистану. Официальная гарантия 1 год. Сборка ПК под заказ.',
  keywords: 'купить компьютер в Ташкенте, игровой компьютер Ташкент, видеокарта Ташкент, RTX Ташкент, процессор Ташкент, сборка ПК Ташкент, компьютерный магазин Узбекистан, комплектующие для ПК Узбекистан, PcShop_uz',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PcShop_uz',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  alternates: {
    canonical: 'https://storepcshop.uz',
    languages: {
      'ru-RU': 'https://storepcshop.uz/?lang=ru',
      'uz-UZ': 'https://storepcshop.uz/?lang=uz',
    },
  },
  openGraph: {
    title: 'PcShop_uz - Игровые ПК и комплектующие в Узбекистане',
    description: 'Магазин компьютерной техники в Узбекистане. Быстрая доставка, гарантия качества и выгодные цены.',
    type: 'website',
    url: 'https://storepcshop.uz',
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
    "url": "https://storepcshop.uz",
    "logo": "https://storepcshop.uz/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+998-99-823-09-90",
      "contactType": "customer service",
      "areaServed": "UZ",
      "availableLanguage": ["Russian", "Uzbek"]
    },
    "sameAs": [
      "https://telegram.me/pcshop_uzz"
    ]
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    "name": "PcShop_uz",
    "image": "https://storepcshop.uz/logo.png",
    "@id": "https://storepcshop.uz/#localbusiness",
    "url": "https://storepcshop.uz",
    "telephone": ["+998998230990", "+998888907000"],
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Лабзак, 2А",
      "addressLocality": "Ташкент",
      "addressRegion": "Ташкент",
      "postalCode": "100000",
      "addressCountry": "UZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.3223,
      "longitude": 69.2653
    },
    "department": {
      "@type": "ComputerStore",
      "name": "PcShop_uz — Малика",
      "telephone": "+998888907000",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Торговые ряды Малика, 31б",
        "addressLocality": "Ташкент",
        "addressRegion": "Ташкент",
        "postalCode": "100000",
        "addressCountry": "UZ"
      }
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
      "opens": "11:00",
      "closes": "21:00"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PcShop_uz",
    "url": "https://storepcshop.uz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://storepcshop.uz/catalog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ef4444" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('SW reg failed:', err);
                  });
                });
              }
              // Automatically reload the page when a ChunkLoadError occurs (due to new deployment)
              window.addEventListener('error', function(e) {
                if (e.message && (e.message.indexOf('ChunkLoadError') > -1 || e.message.indexOf('Loading chunk') > -1)) {
                  window.location.reload();
                }
              }, true);
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && (e.reason.name === 'ChunkLoadError' || (e.reason.message && (e.reason.message.indexOf('ChunkLoadError') > -1 || e.reason.message.indexOf('Loading chunk') > -1)))) {
                  window.location.reload();
                }
              });
            `
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-white`}>
        <Providers>
          <Header />
          <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
