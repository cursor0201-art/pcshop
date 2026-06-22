'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Send, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function ContactsPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    if (language === 'ru') {
      document.title = 'Контакты | Компьютерный магазин PcShop_uz';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', 'Свяжитесь с PcShop_uz. 📍 Адрес: Юнусабад, Киёт 57. 📞 Телефон: +998 (99) 823-09-90. Telegram: @pcshop_uzz. Быстрый ответ и качественный сервис.');
      }
    } else {
      document.title = 'Aloqa | PcShop_uz kompyuter do\'koni';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', 'PcShop_uz bilan bog\'laning. 📍 Manzil: Yunusobod, Kiyot 57. 📞 Telefon: +998 (99) 823-09-90. Telegram: @pcshop_uzz. Tezkor javob va sifatli xizmat.');
      }
    }
  }, [language]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: language === 'ru' ? 'Адрес' : 'Manzil',
      value: t.footer.address,
      link: null,
    },
    {
      icon: Phone,
      title: language === 'ru' ? 'Телефон' : 'Telefon',
      value: t.footer.phone,
      link: 'tel:+998998230990',
    },
    {
      icon: Send,
      title: 'Telegram',
      value: t.footer.telegram,
      link: 'https://t.me/pcshop_uzz',
    },
    {
      icon: Clock,
      title: language === 'ru' ? 'Режим работы' : 'Ish vaqti',
      value: language === 'ru' ? '09:00 - 20:00 (без выходных)' : '09:00 - 20:00 (dam olish kunlarisiz)',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.nav.contacts}</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            {language === 'ru'
              ? 'Свяжитесь с нами любым удобным способом'
              : "O'zingizga qulay usulda biz bilan bog'laning"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-900 border border-gray-800"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{item.title}</p>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-lg text-white hover:text-red-500 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-lg text-white">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 rounded-2xl overflow-hidden bg-neutral-900 border border-gray-800"
            >
              <div className="aspect-video relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.8765!2d69.2793!3d41.3111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzQwLjAiTiA2OcKwMTYnNDUuNSJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="p-4">
                <p className="text-white font-medium">{t.footer.address}</p>
                <p className="text-sm text-gray-400">
                  {language === 'ru'
                    ? 'Мы находимся в Юнусабадском районе'
                    : 'Biz Yunusobod tumanida joylashganmiz'}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick contacts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6 justify-center"
          >
            <div className="bg-neutral-900 rounded-2xl border border-gray-800 p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-4">
                {language === 'ru' ? 'Свяжитесь с нами напрямую' : "To'g'ridan-to'g'ri bog'laning"}
              </h2>
              <p className="text-gray-400 mb-8">
                {language === 'ru' 
                  ? 'Мы всегда на связи в Telegram или по телефону.'
                  : 'Biz doimo Telegram yoki telefon orqali aloqadamiz.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://t.me/pcshop_uzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 rounded-xl bg-neutral-800 border border-gray-700 hover:border-red-500/50 hover:bg-neutral-800/80 transition-all group"
                >
                  <Send className="w-6 h-6 text-red-500" />
                  <span className="text-white group-hover:text-red-500 text-lg font-medium transition-colors">Telegram</span>
                </a>

                <a
                  href="tel:+998998230990"
                  className="flex items-center justify-center gap-3 p-4 rounded-xl bg-neutral-800 border border-gray-700 hover:border-red-500/50 hover:bg-neutral-800/80 transition-all group"
                >
                  <Phone className="w-6 h-6 text-red-500" />
                  <span className="text-white group-hover:text-red-500 text-lg font-medium transition-colors">
                    {language === 'ru' ? 'Позвонить' : 'Qo\'ng\'iroq'}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
