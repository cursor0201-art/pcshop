import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/lib/blogData';

export const metadata: Metadata = {
  title: 'Блог PcShop_uz - Полезные статьи об игровых ПК и комплектующих в Узбекистане',
  description: 'Читайте статьи, обзоры и руководства от экспертов PcShop_uz. Как выбрать игровой ПК, какую видеокарту купить в Ташкенте, подбор процессоров AMD и Intel.',
  keywords: 'блог о компьютерах, комплектующие для ПК Узбекистан, сборка ПК Ташкент, обзоры видеокарт, процессоры AMD Intel',
  alternates: {
    canonical: 'https://storepcshop.uz/blog',
  },
};

export default function BlogListPage() {
  const language = 'ru'; // Default language fallback for server components (client will handle switching or page translates)
  
  // Breadcrumb schema
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
        "name": "Блог",
        "item": "https://storepcshop.uz/blog"
      }
    ]
  };

  return (
    <div className="min-h-screen py-12 bg-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Блог</span>
        </nav>

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад на главную
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Блог и полезные материалы
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Советы по сборке компьютеров, разборы комплектующих, обзоры новых видеокарт и процессоров. Всё, что нужно знать для создания идеального ПК.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.slug}
              className="flex flex-col bg-neutral-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all duration-300 group"
            >
              {/* Image */}
              <Link href={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden bg-neutral-800 block">
                <Image
                  src={post.image}
                  alt={post.title_ru}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-white mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title_ru}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                  {post.excerpt_ru}
                </p>

                {/* Link */}
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-400 group-hover:translate-x-1 transition-all"
                >
                  Читать статью
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
