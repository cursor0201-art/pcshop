let rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://informal-rodina-bave-hub-2e898989.koyeb.app/api';

// Remove trailing slash if present
if (rawBaseUrl.endsWith('/')) {
  rawBaseUrl = rawBaseUrl.slice(0, -1);
}

// Ensure it ends with /api if not present
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
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

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories/`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.map((cat: any) => ({
      id: Number(cat.id),
      name_ru: cat.name_ru,
      name_uz: cat.name_uz,
      slug: cat.slug || '',
      description_ru: cat.description_ru,
      description_uz: cat.description_uz,
    }));
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [
      { id: 1, name_ru: 'Готовые ПК', name_uz: 'Tayyor PK', slug: 'ready-pc' },
      { id: 2, name_ru: 'Процессоры', name_uz: 'Protsessorlar', slug: 'processors' },
      { id: 3, name_ru: 'Видеокарты', name_uz: 'Videokartalar', slug: 'videocards' },
      { id: 4, name_ru: 'Материнские платы', name_uz: 'Platalar', slug: 'motherboards' },
      { id: 5, name_ru: 'Оперативная память', name_uz: 'Operativ xotira', slug: 'ram' },
      { id: 6, name_ru: 'SSD', name_uz: 'SSD', slug: 'ssd' },
      { id: 7, name_ru: 'Мониторы', name_uz: 'Monitorlar', slug: 'monitors' },
      { id: 8, name_ru: 'Клавиатуры', name_uz: 'Klaviaturalar', slug: 'keyboards' },
    ];
  }
}

export async function getProducts(options?: { category_slug?: string; limit?: number }): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}/products/`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();

    let products: Product[] = data.map((p: any) => {
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
        old_price: null,
        stock: p.stock || 0,
        specs,
        images: p.images && Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
        images_detail: p.images_detail || [],
        is_featured: true,
        is_new: true,
        warranty_months: p.warranty_months || 12,
        brand: p.brand || '',
        created_at: p.created_at || '',
      };
    });

    if (options?.category_slug) {
      products = products.filter(p => (p as any).category_slug === options.category_slug);
    }
    if (options?.limit) {
      products = products.slice(0, options.limit);
    }

    return products;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
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
  try {
    const res = await fetch(`${BASE_URL}/reviews/`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const data = await res.json();
    
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
    return [];
  }
}
