import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calendar, Clock, User, ArrowLeft, Zap } from 'lucide-react';
import { blogPosts } from '@/lib/blogData';
import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/api';


export const dynamicParams = false;

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: { slug: string };
}

function getCategoryIdFromBlogSlug(slug: string): number {
  if (slug === 'how-to-choose-gaming-pc' || slug === 'how-to-build-gaming-pc' || slug === 'pc-for-office-and-work') {
    return 1; // ready-pc
  }
  if (slug === 'best-graphics-cards-2026' || slug === 'rtx-vs-radeon') {
    return 3; // videocards
  }
  if (slug === 'best-amd-processors' || slug === 'best-intel-processors') {
    return 2; // processors
  }
  if (slug === 'gaming-monitors-guide') {
    return 11; // monitors
  }
  return 1;
}

async function getRelatedProducts(slug: string) {
  const categoryId = getCategoryIdFromBlogSlug(slug);
  try {
    const products = await getProducts();
    return products.filter(p => p.category_id === categoryId).slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products for blog:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};

  return {
    title: `${post.title_ru} | Блог PcShop_uz`,
    description: post.excerpt_ru,
    keywords: post.keywords_ru,
    alternates: {
      canonical: `https://storepcshop.uz/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title_ru,
      description: post.excerpt_ru,
      url: `https://storepcshop.uz/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  const relatedProducts = await getRelatedProducts(params.slug);

  // JSON-LD NewsArticle schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title_ru,
    "image": [post.image],
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "PcShop_uz",
      "url": "https://storepcshop.uz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PcShop_uz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://storepcshop.uz/logo.png"
      }
    },
    "description": post.excerpt_ru
  };

  return (
    <div className="min-h-screen py-12 bg-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Главная</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-white transition-colors">Блог</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white line-clamp-1">{post.title_ru}</span>
        </nav>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку статей
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            {post.title_ru}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 border border-gray-800 bg-neutral-900">
          <Image
            src={post.image}
            alt={post.title_ru}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Body content */}
        <div 
          className="prose prose-invert max-w-none text-gray-300 space-y-6 leading-relaxed
                     prose-headings:text-white prose-headings:font-bold
                     prose-h2:text-2xl prose-h2:pt-4 prose-h2:pb-2
                     prose-h3:text-xl prose-h3:pt-2
                     prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
                     prose-strong:text-white mb-16"
          dangerouslySetInnerHTML={{ __html: post.content_ru }}
        />

        {/* Dynamic Internal linking: Related products mentioned in Stage 7 */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-gray-800">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Рекомендуемое оборудование из статьи</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product: any) => (
                <Link 
                  key={product.id} 
                  href={`/product?slug=${product.slug}`}
                  className="group bg-neutral-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all p-3 block"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-800 mb-3">
                    {product.images?.[0] ? (
                      <Image 
                        src={product.images[0]} 
                        alt={product.name_ru} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Zap className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-red-500 transition-colors mb-2">
                    {product.name_ru}
                  </h3>
                  <p className="text-sm font-bold text-red-500">{product.price.toLocaleString('ru-RU')} сум</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
