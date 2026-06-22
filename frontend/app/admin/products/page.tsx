'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';

interface Product {
  id: number;
  category_id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
  price: number;
  old_price: number | null;
  stock: number;
  images: string[];
  brand: string;
  is_featured: boolean;
  is_new: boolean;
}

interface Category {
  id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name_ru: '',
    name_uz: '',
    slug: '',
    price: '',
    old_price: '',
    stock: '',
    brand: '',
    category_id: '',
    description_ru: '',
    description_uz: '',
    images: '',
    is_featured: false,
    is_new: false,
    specs: '{}',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const language = 'ru';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/products?select=*&order=created_at.desc`, {
          headers: { apikey: supabaseKey || '' },
        }),
        fetch(`${supabaseUrl}/rest/v1/categories?select=*`, {
          headers: { apikey: supabaseKey || '' },
        }),
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const productData = {
        name_ru: formData.name_ru,
        name_uz: formData.name_uz,
        slug: formData.slug || formData.name_ru.toLowerCase().replace(/\s+/g, '-'),
        price: parseInt(formData.price),
        old_price: formData.old_price ? parseInt(formData.old_price) : null,
        stock: parseInt(formData.stock) || 0,
        brand: formData.brand,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        description_ru: formData.description_ru,
        description_uz: formData.description_uz,
        images: formData.images ? formData.images.split(',').map(s => s.trim()) : [],
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        specs: JSON.parse(formData.specs || '{}'),
      };

      if (editingProduct) {
        await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${editingProduct.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey || '',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(productData),
        });
      } else {
        await fetch(`${supabaseUrl}/rest/v1/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey || '',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(productData),
        });
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name_ru: product.name_ru,
      name_uz: product.name_uz,
      slug: product.slug,
      price: product.price.toString(),
      old_price: product.old_price?.toString() || '',
      stock: product.stock.toString(),
      brand: product.brand || '',
      category_id: product.category_id?.toString() || '',
      description_ru: '',
      description_uz: '',
      images: product.images?.join(', ') || '',
      is_featured: product.is_featured,
      is_new: product.is_new,
      specs: '{}',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === 'ru' ? 'Удалить товар?' : 'Mahsulotni o\'chirmoqchimisz?')) return;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers: { apikey: supabaseKey || '' },
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name_ru: '',
      name_uz: '',
      slug: '',
      price: '',
      old_price: '',
      stock: '',
      brand: '',
      category_id: '',
      description_ru: '',
      description_uz: '',
      images: '',
      is_featured: false,
      is_new: false,
      specs: '{}',
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' сум';
  };

  const filteredProducts = products.filter(p =>
    p.name_ru.toLowerCase().includes(search.toLowerCase()) ||
    p.name_uz.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">
          {language === 'ru' ? 'Товары' : 'Mahsulotlar'}
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="w-4 h-4" />
          {language === 'ru' ? 'Добавить товар' : 'Qo\'shish'}
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'ru' ? 'Поиск товаров...' : 'Mahsulot qidirish...'}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-900 border border-gray-800 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
        />
      </div>

      {/* Products table */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-900 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Товар' : 'Mahsulot'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Категория' : 'Kategoriya'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Цена' : 'Narx'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Наличие' : 'Mavjudligi'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Действия' : 'Amallar'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const category = categories.find(c => c.id === product.category_id);
                return (
                  <tr key={product.id} className="border-b border-gray-800 last:border-b-0 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt="" width={48} height={48} className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{product.name_ru}</p>
                          <p className="text-sm text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300">{category?.name_ru || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{formatPrice(product.price)}</p>
                      {product.old_price && (
                        <p className="text-sm text-gray-500 line-through">{formatPrice(product.old_price)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm ${
                        product.stock > 0
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {product.stock} {language === 'ru' ? 'шт' : 'dona'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              {language === 'ru' ? 'Товары не найдены' : 'Mahsulotlar topilmadi'}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-2xl border border-gray-800"
            >
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-800 bg-neutral-900">
                <h2 className="text-lg font-semibold text-white">
                  {editingProduct
                    ? (language === 'ru' ? 'Редактировать товар' : 'Tahrirlash')
                    : (language === 'ru' ? 'Добавить товар' : 'Qo\'shish')}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Название (RU) *</label>
                    <input
                      type="text"
                      required
                      value={formData.name_ru}
                      onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Название (UZ)</label>
                    <input
                      type="text"
                      value={formData.name_uz}
                      onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                      className="input-dark"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Категория</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="input-dark"
                    >
                      <option value="">-</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name_ru}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Бренд</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="input-dark"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Цена (сум) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Старая цена</label>
                    <input
                      type="number"
                      value={formData.old_price}
                      onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Наличие</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="input-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Изображения (URL через запятую)</label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://..., https://..."
                    className="input-dark"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 bg-neutral-800 text-red-500"
                    />
                    <span className="text-sm text-gray-400">Рекомендуемый</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 bg-neutral-800 text-red-500"
                    />
                    <span className="text-sm text-gray-400">Новинка</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                    {language === 'ru' ? 'Отмена' : 'Bekor qilish'}
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isSubmitting
                      ? (language === 'ru' ? 'Сохранение...' : 'Saqlanmoqda...')
                      : (language === 'ru' ? 'Сохранить' : 'Saqlash')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Package } from 'lucide-react';
