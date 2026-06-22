'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Check, Send } from 'lucide-react';

interface Setting {
  id: number;
  key: string;
  value: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const language = 'ru';

  const [formData, setFormData] = useState({
    telegram_bot_token: '',
    telegram_chat_id: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/rest/v1/settings?select=*`, {
        headers: { apikey: supabaseKey || '' },
      });
      const data = await res.json();
      setSettings(data || []);

      // Fill form data
      const botToken = data.find((s: Setting) => s.key === 'telegram_bot_token');
      const chatId = data.find((s: Setting) => s.key === 'telegram_chat_id');

      setFormData({
        telegram_bot_token: botToken?.value || '',
        telegram_chat_id: chatId?.value || '',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // Update each setting
      for (const [key, value] of Object.entries(formData)) {
        const setting = settings.find(s => s.key === key);
        if (setting) {
          await fetch(`${supabaseUrl}/rest/v1/settings?key=eq.${key}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey || '',
            },
            body: JSON.stringify({ value }),
          });
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const testTelegram = async () => {
    if (!formData.telegram_bot_token || !formData.telegram_chat_id) {
      alert(language === 'ru'
        ? 'Заполните токен бота и Chat ID'
        : 'Bot token va Chat ID ni toldiring');
      return;
    }

    try {
      const message = 'Test message from PcShop_uz Admin Panel';
      await fetch(
        `https://api.telegram.org/bot${formData.telegram_bot_token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: formData.telegram_chat_id,
            text: message,
          }),
        }
      );
      alert(language === 'ru' ? 'Тестовое сообщение отправлено!' : 'Test xabar yuborildi!');
    } catch (error) {
      console.error('Error sending test message:', error);
      alert(language === 'ru' ? 'Ошибка отправки' : 'Xatolik yuz berdi');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-neutral-900 rounded" />
        <div className="h-64 bg-neutral-900 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">
        {language === 'ru' ? 'Настройки' : 'Sozlamalar'}
      </h1>

      <div className="max-w-2xl">
        {/* Telegram settings */}
        <div className="bg-neutral-900 rounded-xl border border-gray-800 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-red-500/10">
              <Send className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Telegram Bot</h2>
              <p className="text-sm text-gray-400">
                {language === 'ru'
                  ? 'Настройка уведомлений о заказах в Telegram'
                  : 'Buyurtmalar haqida Telegram xabarlarni sozlash'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Bot Token
              </label>
              <input
                type="text"
                value={formData.telegram_bot_token}
                onChange={(e) => setFormData({ ...formData, telegram_bot_token: e.target.value })}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="input-dark"
              />
              <p className="text-xs text-gray-500 mt-2">
                {language === 'ru'
                  ? 'Получите токен у @BotFather в Telegram'
                  : '@BotFather dan token oling'}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Chat ID
              </label>
              <input
                type="text"
                value={formData.telegram_chat_id}
                onChange={(e) => setFormData({ ...formData, telegram_chat_id: e.target.value })}
                placeholder="-1001234567890"
                className="input-dark"
              />
              <p className="text-xs text-gray-500 mt-2">
                {language === 'ru'
                  ? 'ID чата или канала для получения уведомлений'
                  : 'Xabarlar olish uchun chat yoki kanal ID si'}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 btn-primary disabled:opacity-50"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved
                  ? (language === 'ru' ? 'Сохранено!' : 'Saqlandi!')
                  : (language === 'ru' ? 'Сохранить' : 'Saqlash')}
              </motion.button>

              <motion.button
                type="button"
                onClick={testTelegram}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                {language === 'ru' ? 'Тест' : 'Test'}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-neutral-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {language === 'ru' ? 'Инструкция' : 'Yo\'riqnoma'}
          </h3>

          <ol className="space-y-4 text-gray-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-medium">1</span>
              <p>
                {language === 'ru'
                  ? 'Откройте @BotFather в Telegram и создайте нового бота командой /newbot'
                  : 'Telegramda @BotFather ni oching va /newbot buyrug\'i bilan yangi bot yarating'}
              </p>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-medium">2</span>
              <p>
                {language === 'ru'
                  ? 'Скопируйте полученный токен и вставьте в поле выше'
                  : 'Olingan tokeni nusxalang va yuqoridagi maydonga qo\'ying'}
              </p>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-medium">3</span>
              <p>
                {language === 'ru'
                  ? 'Добавьте бота в чат/канал и получите Chat ID через @userinfobot'
                  : 'Botni chat/kanalga qo\'shing va @userinfobot orqali Chat ID ni oling'}
              </p>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-medium">4</span>
              <p>
                {language === 'ru'
                  ? 'Сохраните настройки и нажмите "Тест" для проверки'
                  : 'Sozlamalarni saqlang va tekshirish uchun "Test" tugmasini bosing'}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
