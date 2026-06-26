const fs = require('fs');
const path = require('path');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://informal-rodina-bave-hub-2e898989.koyeb.app/api';

// Clean URL
let baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
if (!baseUrl.endsWith('/api')) {
  baseUrl = `${baseUrl}/api`;
}

// Intercept legacy domain
if (baseUrl.includes('pcshop.uz') && !baseUrl.includes('storepcshop.uz') && !baseUrl.includes('koyeb.app')) {
  baseUrl = 'https://informal-rodina-bave-hub-2e898989.koyeb.app/api';
}

const CACHE_DIR = path.join(process.cwd(), '.next');

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn(`[Prebuild] Attempt ${i + 1} failed for ${url}:`, e.message);
      if (i === retries - 1) throw e;
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function main() {
  console.log('[Prebuild] Starting cache pre-population...');
  console.log('[Prebuild] Using API Base URL:', baseUrl);

  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    // 1. Fetch categories
    console.log('[Prebuild] Fetching categories...');
    const categoriesData = await fetchWithRetry(`${baseUrl}/categories/`);
    const parsedCategories = categoriesData.map((cat) => ({
      id: Number(cat.id),
      name_ru: cat.name_ru,
      name_uz: cat.name_uz,
      slug: cat.slug || '',
      description_ru: cat.description_ru,
      description_uz: cat.description_uz,
    }));
    fs.writeFileSync(path.join(CACHE_DIR, 'categories-cache.json'), JSON.stringify(parsedCategories), 'utf8');
    console.log(`[Prebuild] Successfully cached ${parsedCategories.length} categories.`);

    // 2. Fetch products
    console.log('[Prebuild] Fetching products...');
    const productsData = await fetchWithRetry(`${baseUrl}/products/`);
    
    // Parse products using same logic as api.ts
    const parsedProducts = productsData.map((p) => {
      const specs = {};
      if (p.characteristics && Array.isArray(p.characteristics)) {
        p.characteristics.forEach((char) => {
          specs[char.name_ru] = char.value_ru;
        });
      }
      return {
        id: p.id,
        category_id: p.category ? p.category.id : 0,
        category_slug: p.category ? p.category.slug : '',
        name_ru: p.name_ru,
        name_uz: p.name_uz,
        slug: p.slug || '',
        description_ru: p.description_ru || '',
        description_uz: p.description_uz || '',
        price: Number(p.price),
        price_usd: p.price_usd ? Number(p.price_usd) : null,
        old_price: p.old_price ? Number(p.old_price) : null,
        stock: p.stock || 0,
        specs,
        characteristics: p.characteristics || [],
        images: p.images && Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
        images_detail: p.images_detail || [],
        is_featured: p.is_featured ?? false,
        is_new: p.is_new ?? false,
        warranty_months: p.warranty_months || 12,
        brand: p.brand || '',
        created_at: p.created_at || '',
      };
    });
    fs.writeFileSync(path.join(CACHE_DIR, 'products-cache.json'), JSON.stringify(parsedProducts), 'utf8');
    console.log(`[Prebuild] Successfully cached ${parsedProducts.length} products.`);
    
    console.log('[Prebuild] Cache pre-population completed successfully!');
  } catch (err) {
    console.error('[Prebuild] Error pre-populating cache:', err);
    // Do not crash the build, Next.js can fallback to runtime fetching if needed
  }
}

main();
