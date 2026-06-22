'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';

interface Review {
  id: number;
  product_id: number;
  author_name: string;
  rating: number;
  text: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const language = 'ru';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/rest/v1/reviews?select=*&order=created_at.desc`, {
        headers: { apikey: supabaseKey || '' },
      });
      const data = await res.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, approve: boolean) => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/rest/v1/reviews?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey || '',
        },
        body: JSON.stringify({ is_approved: approve }),
      });

      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === 'ru' ? 'Удалить отзыв?' : 'Sharhni o\'chirmoqchimisz?')) return;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/rest/v1/reviews?id=eq.${id}`, {
        method: 'DELETE',
        headers: { apikey: supabaseKey || '' },
      });

      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'approved') return r.is_approved;
    if (filter === 'pending') return !r.is_approved;
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">
        {language === 'ru' ? 'Отзывы' : 'Sharhlar'}
      </h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: language === 'ru' ? 'Все' : 'Barchasi' },
          { key: 'pending', label: language === 'ru' ? 'На модерации' : 'Kutilmoqda' },
          { key: 'approved', label: language === 'ru' ? 'Одобренные' : 'Tasdiqlangan' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as 'all' | 'approved' | 'pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === item.key
                ? 'bg-red-500 text-white'
                : 'bg-neutral-900 text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
            {item.key === 'pending' && reviews.filter(r => !r.is_approved).length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-500 text-black rounded">
                {reviews.filter(r => !r.is_approved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-900 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900 rounded-xl border border-gray-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-white">{review.author_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  review.is_approved
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {review.is_approved
                    ? (language === 'ru' ? 'Одобрен' : 'Tasdiqlangan')
                    : (language === 'ru' ? 'На модерации' : 'Kutilmoqda')}
                </span>
              </div>

              <p className="text-gray-300 mb-4">{review.text}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {language === 'ru' ? 'Товар' : 'Mahsulot'}: #{review.product_id}
                </span>

                <div className="flex items-center gap-2">
                  {!review.is_approved && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleApprove(review.id, true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors text-sm"
                    >
                      <Check className="w-4 h-4" />
                      {language === 'ru' ? 'Одобрить' : 'Tasdiqlash'}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    {language === 'ru' ? 'Удалить' : 'O\'chirish'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              {language === 'ru' ? 'Отзывы не найдены' : 'Sharhlar topilmadi'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
