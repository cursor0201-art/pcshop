'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Category {
  id: number;
  name_ru: string;
  name_uz: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_ru: '',
    name_uz: '',
    slug: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const language = 'ru';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=*&order=created_at.asc`, {
        headers: { apikey: supabaseKey || '' },
      });
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

      const categoryData = {
        name_ru: formData.name_ru,
        name_uz: formData.name_uz,
        slug: formData.slug || formData.name_ru.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };

      if (editingCategory) {
        await fetch(`${supabaseUrl}/rest/v1/categories?id=eq.${editingCategory.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey || '',
          },
          body: JSON.stringify(categoryData),
        });
      } else {
        await fetch(`${supabaseUrl}/rest/v1/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey || '',
          },
          body: JSON.stringify(categoryData),
        });
      }

      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_ru: category.name_ru,
      name_uz: category.name_uz,
      slug: category.slug,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === 'ru' ? 'Удалить категорию?' : 'Kategoriyani o\'chirmoqchimisz?')) return;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/rest/v1/categories?id=eq.${id}`, {
        method: 'DELETE',
        headers: { apikey: supabaseKey || '' },
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name_ru: '', name_uz: '', slug: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">
          {language === 'ru' ? 'Категории' : 'Kategoriyalar'}
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            resetForm();
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="w-4 h-4" />
          {language === 'ru' ? 'Добавить категорию' : 'Qo\'shish'}
        </motion.button>
      </div>

      {/* Categories list */}
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
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Название (RU)' : 'Nomi (RU)'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Название (UZ)' : 'Nomi (UZ)'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Slug</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">
                  {language === 'ru' ? 'Действия' : 'Amallar'}
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-800 last:border-b-0 hover:bg-white/5">
                  <td className="px-6 py-4 text-gray-400">{category.id}</td>
                  <td className="px-6 py-4 text-white font-medium">{category.name_ru}</td>
                  <td className="px-6 py-4 text-gray-300">{category.name_uz}</td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-neutral-800 px-2 py-1 rounded text-gray-400">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(category)}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(category.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              className="w-full max-w-md bg-neutral-900 rounded-2xl border border-gray-800"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">
                  {editingCategory
                    ? (language === 'ru' ? 'Редактировать' : 'Tahrirlash')
                    : (language === 'ru' ? 'Добавить категорию' : 'Qo\'shish')}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-dark"
                    placeholder="auto-generated"
                  />
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
