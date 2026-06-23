import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pcshop.uz';
  
  const staticPages = [
    '',
    '/catalog',
    '/about',
    '/contacts',
    '/blog',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const cities = ['tashkent', 'samarkand', 'bukhara', 'andijan', 'namangan', 'fergana', 'nukus', 'uzbekistan'];
  const categories = [
    'ready-pc', 'igrovye-pk', 'gaming-pc',
    'processors', 'protsessory',
    'videocards', 'videokarty',
    'motherboards', 'materinskie-platy',
    'ram', 'operativnaya-pamyat',
    'ssd',
    'monitors', 'monitory',
    'keyboards', 'klaviatury'
  ];
  
  const cityCategoryPages = [];
  for (const city of cities) {
    for (const category of categories) {
      cityCategoryPages.push({
        url: `${baseUrl}/${city}/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    }
  }

  const blogPostsList = [
    'how-to-choose-gaming-pc',
    'best-graphics-cards-2026',
    'rtx-vs-radeon',
    'best-amd-processors',
    'best-intel-processors',
    'pc-assembly-for-games',
    'pc-for-work',
    'gaming-monitors'
  ];

  const blogPages = blogPostsList.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  try {
    const products = await getProducts();
    const productPages = [];

    for (const product of (products || [])) {
      if (product.slug) {
        // Base product page
        productPages.push({
          url: `${baseUrl}/product/${product.slug}`,
          lastModified: product.created_at ? new Date(product.created_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        });

        // City specific product pages
        for (const city of cities) {
          productPages.push({
            url: `${baseUrl}/${city}/${product.slug}`,
            lastModified: product.created_at ? new Date(product.created_at) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          });
        }
      }
    }

    return [...staticPages, ...productPages, ...cityCategoryPages, ...blogPages];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [...staticPages, ...cityCategoryPages, ...blogPages];
  }
}
