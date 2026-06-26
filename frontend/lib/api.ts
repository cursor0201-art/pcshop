let rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://informal-rodina-bave-hub-2e898989.koyeb.app/api';

// Safety check: if NEXT_PUBLIC_API_URL contains the legacy pcshop.uz domain,
// redirect it to the active Koyeb backend to prevent CORS/Failed to fetch errors.
if (rawBaseUrl.includes('pcshop.uz') && !rawBaseUrl.includes('storepcshop.uz') && !rawBaseUrl.includes('koyeb.app')) {
  console.warn("[PcShop API] Legacy API domain detected in environment variables. Overriding with active Koyeb backend.");
  rawBaseUrl = 'https://informal-rodina-bave-hub-2e898989.koyeb.app/api';
}

// Remove trailing slash if present
if (rawBaseUrl.endsWith('/')) {
  rawBaseUrl = rawBaseUrl.slice(0, -1);
}

// Ensure it ends with /api if not present
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}

if (typeof window !== 'undefined') {
  console.log("[PcShop API] Initialized with BASE_URL:", rawBaseUrl);
}

export const BASE_URL = rawBaseUrl;

export interface Category {
  id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
  description_ru?: string;
  description_uz?: string;
}

export interface Product {
  id: number;
  category_id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
  description_ru: string;
  description_uz: string;
  price: number;
  old_price: number | null;
  stock: number;
  specs: Record<string, string>;
  characteristics?: { id: number; name_ru: string; name_uz: string; value_ru: string; value_uz: string }[];
  images: string[];
  images_detail?: { url: string; color_name: string | null; color_code: string | null }[];
  is_featured: boolean;
  is_new: boolean;
  warranty_months: number;
  brand: string;
  created_at: string;
}

export interface Review {
  id: number;
  author_name: string;
  rating: number;
  text: string;
  created_at: string;
}

let fsModule: any = null;
let pathModule: any = null;
let CACHE_DIR = '';

if (typeof window === 'undefined') {
  try {
    fsModule = require('fs');
    pathModule = require('path');
    CACHE_DIR = pathModule.join(process.cwd(), 'api-cache');
  } catch (e) {
    // Ignore error
  }
}

function readFromFileCache(key: string): any {
  if (typeof window !== 'undefined' || !fsModule || !pathModule || !CACHE_DIR) return null;
  try {
    const filePath = pathModule.join(CACHE_DIR, `${key}-cache.json`);
    if (fsModule.existsSync(filePath)) {
      const data = fsModule.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    // Ignore cache read errors
  }
  return null;
}

function writeToFileCache(key: string, data: any) {
  if (typeof window !== 'undefined' || !fsModule || !pathModule || !CACHE_DIR) return;
  try {
    if (!fsModule.existsSync(CACHE_DIR)) {
      fsModule.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const filePath = pathModule.join(CACHE_DIR, `${key}-cache.json`);
    fsModule.writeFileSync(filePath, JSON.stringify(data), 'utf8');
  } catch (e) {
    // Ignore cache write errors
  }
}

let cachedCategories: Category[] | null = null;
let categoriesCacheTime = 0;

let cachedProducts: Product[] | null = null;
let productsCacheTime = 0;

let cachedReviews: any[] | null = null;
let hasFetchedReviews = false;

const CACHE_DURATION_MS = 2 * 60 * 1000; // 2 minutes cache duration

// Background fetch helpers to avoid blocking UI
async function fetchCategoriesInBackground() {
  try {
    const res = await fetch(`${BASE_URL}/categories/`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    cachedCategories = data.map((cat: any) => ({
      id: Number(cat.id),
      name_ru: cat.name_ru,
      name_uz: cat.name_uz,
      slug: cat.slug || '',
      description_ru: cat.description_ru,
      description_uz: cat.description_uz,
    }));
    categoriesCacheTime = Date.now();
  } catch (err) {
    console.error('Background categories fetch failed:', err);
  }
}

async function fetchProductsInBackground() {
  try {
    const res = await fetch(`${BASE_URL}/products/`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    cachedProducts = parseProductsData(data);
    productsCacheTime = Date.now();
  } catch (err) {
    console.error('Background products fetch failed:', err);
  }
}

function parseProductsData(data: any[]): Product[] {
  return data.map((p: any) => {
    const specs: Record<string, string> = {};
    if (p.characteristics && Array.isArray(p.characteristics)) {
      p.characteristics.forEach((char: any) => {
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
}

export async function getCategories(): Promise<Category[]> {
  const isServer = typeof window === 'undefined';
  const now = Date.now();

  const fallbacks = [
    { id: 1, name_ru: 'Готовые ПК', name_uz: 'Tayyor PK', slug: 'ready-pc' },
    { id: 2, name_ru: 'Процессоры', name_uz: 'Protsessorlar', slug: 'processors' },
    { id: 3, name_ru: 'Видеокарты', name_uz: 'Videokartalar', slug: 'videocards' },
    { id: 4, name_ru: 'Материнские платы', name_uz: 'Platalar', slug: 'motherboards' },
    { id: 5, name_ru: 'Оперативная память', name_uz: 'Operativ xotira', slug: 'ram' },
    { id: 6, name_ru: 'SSD', name_uz: 'SSD', slug: 'ssd' },
    { id: 7, name_ru: 'Мониторы', name_uz: 'Monitorlar', slug: 'monitors' },
    { id: 8, name_ru: 'Клавиатуры', name_uz: 'Klaviaturalar', slug: 'keyboards' },
  ];

  // If cache is fresh OR we are on the server (which only fetches once during build time)
  if (cachedCategories && (isServer || (now - categoriesCacheTime < CACHE_DURATION_MS))) {
    return cachedCategories;
  }

  // Server-side / Build-time file cache check
  if (isServer) {
    const fileCached = readFromFileCache('categories');
    if (fileCached) {
      cachedCategories = fileCached;
      categoriesCacheTime = Date.now();
      return fileCached;
    }
  }

  // If cache expired on client, revalidate in background and return stale cache
  if (!isServer && cachedCategories && (now - categoriesCacheTime >= CACHE_DURATION_MS)) {
    fetchCategoriesInBackground();
    return cachedCategories;
  }

  try {
    const res = await fetch(`${BASE_URL}/categories/`, { 
      cache: 'no-store',
      ...(isServer ? { signal: AbortSignal.timeout(5000) } : {})
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    const parsed = data.map((cat: any) => ({
      id: Number(cat.id),
      name_ru: cat.name_ru,
      name_uz: cat.name_uz,
      slug: cat.slug || '',
      description_ru: cat.description_ru,
      description_uz: cat.description_uz,
    }));
    
    cachedCategories = parsed;
    categoriesCacheTime = Date.now();
    if (isServer) {
      writeToFileCache('categories', parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error fetching categories from:', `${BASE_URL}/categories/`, err);
    if (!cachedCategories) {
      cachedCategories = fallbacks;
      categoriesCacheTime = Date.now();
    }
    return cachedCategories;
  }
}

export async function getProducts(options?: { category_slug?: string; limit?: number }): Promise<Product[]> {
  const isServer = typeof window === 'undefined';
  const now = Date.now();

  // If cache is fresh OR we are on the server (which only fetches once during build time)
  if (cachedProducts && (isServer || (now - productsCacheTime < CACHE_DURATION_MS))) {
    let products = [...cachedProducts];
    if (options?.category_slug) {
      products = products.filter(p => (p as any).category_slug === options.category_slug);
    }
    if (options?.limit) {
      products = products.slice(0, options.limit);
    }
    return products;
  }

  // Server-side / Build-time file cache check
  if (isServer) {
    const fileCached = readFromFileCache('products');
    if (fileCached) {
      cachedProducts = fileCached;
      productsCacheTime = Date.now();
      let products = [...fileCached];
      if (options?.category_slug) {
        products = products.filter(p => (p as any).category_slug === options.category_slug);
      }
      if (options?.limit) {
        products = products.slice(0, options.limit);
      }
      return products;
    }
  }

  // If cache expired on client, revalidate in background and return stale cache
  if (!isServer && cachedProducts && (now - productsCacheTime >= CACHE_DURATION_MS)) {
    fetchProductsInBackground();
    let products = [...cachedProducts];
    if (options?.category_slug) {
      products = products.filter(p => (p as any).category_slug === options.category_slug);
    }
    if (options?.limit) {
      products = products.slice(0, options.limit);
    }
    return products;
  }

  try {
    const res = await fetch(`${BASE_URL}/products/`, { 
      cache: 'no-store',
      ...(isServer ? { signal: AbortSignal.timeout(5000) } : {})
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    const parsed = parseProductsData(data);
    
    cachedProducts = parsed;
    productsCacheTime = Date.now();
    if (isServer) {
      writeToFileCache('products', parsed);
    }

    let products = [...parsed];
    if (options?.category_slug) {
      products = products.filter(p => (p as any).category_slug === options.category_slug);
    }
    if (options?.limit) {
      products = products.slice(0, options.limit);
    }
    return products;
  } catch (err) {
    console.error('Error fetching products from:', `${BASE_URL}/products/`, err);
    return cachedProducts || [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  const product = products.find(p => p.slug === slug);
  return product || null;
}

export async function getSimilarProducts(categoryId: number, excludeId: number, limit = 4): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter(p => p.category_id === categoryId && p.id !== excludeId)
    .slice(0, limit);
}

export async function getReviews(productId: number): Promise<Review[]> {
  const isServer = typeof window === 'undefined';
  try {
    if (isServer && hasFetchedReviews) {
      const reviews = cachedReviews || [];
      return reviews
        .filter((r: any) => r.product === productId)
        .map((r: any) => ({
          id: r.id,
          author_name: r.username || 'Покупатель',
          rating: r.rating,
          text: r.comment || '',
          created_at: r.created_at || '',
        }));
    }

    if (isServer) {
      hasFetchedReviews = true;
    }

    const res = await fetch(`${BASE_URL}/reviews/`, { 
      cache: 'no-store',
      ...(isServer ? { signal: AbortSignal.timeout(5000) } : {})
    });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const data = await res.json();
    if (isServer) {
      cachedReviews = data;
    }
    
    return data
      .filter((r: any) => r.product === productId)
      .map((r: any) => ({
        id: r.id,
        author_name: r.username || 'Покупатель',
        rating: r.rating,
        text: r.comment || '',
        created_at: r.created_at || '',
      }));
  } catch (err) {
    console.error('Error fetching reviews:', err);
    if (isServer) {
      cachedReviews = [];
    }
    return [];
  }
}
