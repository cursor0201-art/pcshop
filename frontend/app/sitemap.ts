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
    '/configurator',
    '/faq',
  ].map(route => {
    const url = `${baseUrl}${route}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          'ru-RU': `${url}?lang=ru`,
          'uz-UZ': `${url}?lang=uz`,
        }
      }
    };
  });

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
      const url = `${baseUrl}/${city}/${category}`;
      cityCategoryPages.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        alternates: {
          languages: {
            'ru-RU': `${url}?lang=ru`,
            'uz-UZ': `${url}?lang=uz`,
          }
        }
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

  const blogPages = blogPostsList.map(slug => {
    const url = `${baseUrl}/blog/${slug}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          'ru-RU': `${url}?lang=ru`,
          'uz-UZ': `${url}?lang=uz`,
        }
      }
    };
  });

  try {
    const products = await getProducts();
    const productPages = [];

    for (const product of (products || [])) {
      if (product.slug) {
        // Base product page
        const baseUrlForProduct = `${baseUrl}/product?slug=${product.slug}`;
        productPages.push({
          url: baseUrlForProduct,
          lastModified: product.created_at ? new Date(product.created_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
          alternates: {
            languages: {
              'ru-RU': `${baseUrlForProduct}&lang=ru`,
              'uz-UZ': `${baseUrlForProduct}&lang=uz`,
            }
          }
        });

        // City specific product pages
        for (const city of cities) {
          const cityProductUrl = `${baseUrl}/${city}/${product.slug}`;
          productPages.push({
            url: cityProductUrl,
            lastModified: product.created_at ? new Date(product.created_at) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
            alternates: {
              languages: {
                'ru-RU': `${cityProductUrl}?lang=ru`,
                'uz-UZ': `${cityProductUrl}?lang=uz`,
              }
            }
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
