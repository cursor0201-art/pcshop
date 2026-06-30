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
        descMeta.setAttribute('content', 'Свяжитесь с PcShop_uz. 📍 Адрес 1: ул. Лабзак, 2А. 📍 Адрес 2: Торговые ряды Малика, 31б. 📞 Телефоны: +998 (99) 823-09-90, +998 (88) 890-70-00. Telegram: @pcshop_uzz.');
      }
    } else {
      document.title = 'Aloqa | PcShop_uz kompyuter do\'koni';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', 'PcShop_uz bilan bog\'laning. 📍 Manzil 1: Labzak ko\'chasi, 2A. 📍 Manzil 2: Malika savdo qatorlari, 31b. 📞 Telefonlar: +998 (99) 823-09-90, +998 (88) 890-70-00. Telegram: @pcshop_uzz.');
      }
    }
  }, [language]);
  const [tgLink, setTgLink] = useState('https://telegram.me/pcshop_uzz');

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      setTgLink('tg://resolve?domain=pcshop_uzz');
    }
  }, []);

  const contactInfo = [
    {
      icon: MapPin,
      title: language === 'ru' ? 'Адрес 1' : 'Manzil 1',
      value: t.footer.address,
      link: 'https://maps.app.goo.gl/9nR8HzUUeveYd7MD6',
    },
    {
      icon: MapPin,
      title: language === 'ru' ? 'Адрес 2' : 'Manzil 2',
      value: (t.footer as any).address2 || 'Торговые ряды Малика, 31б, Ташкент',
      link: 'https://maps.app.goo.gl/3wiRcPUki5V5Z2zd8',
    },
    {
      icon: Phone,
      title: language === 'ru' ? 'Телефон 1' : 'Telefon 1',
      value: t.footer.phone,
      link: 'tel:+998998230990',
    },
    {
      icon: Phone,
      title: language === 'ru' ? 'Телефон 2' : 'Telefon 2',
      value: (t.footer as any).phone2 || '+998 (88) 890-70-00',
      link: 'tel:+998888907000',
    },
    {
      icon: Send,
      title: 'Telegram',
      value: t.footer.telegram,
      link: tgLink,
    },
    {
      icon: Clock,
      title: language === 'ru' ? 'Режим работы' : 'Ish vaqti',
      value: language === 'ru' ? '11:00 - 21:00 (без выходных)' : '11:00 - 21:00 (dam olish kunlarisiz)',
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
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-900 border border-gray-800"
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

            {/* Map 1 — Лабзак */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 rounded-2xl overflow-hidden bg-neutral-900 border border-gray-800"
            >
              <div className="aspect-video relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2996.3832996372876!2d69.26527779999999!3d41.322277799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDE5JzIwLjIiTiA2OcKwMTUnNTUuMCJF!5e0!3m2!1sru!2s!4v1782319340379!5m2!1sru!2s"
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
                    ? 'Шайхантахурский район'
                    : 'Shayxontohur tumani'}
                </p>
              </div>
            </motion.div>

            {/* Map 2 — Малика */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 rounded-2xl overflow-hidden bg-neutral-900 border border-gray-800"
            >
              <div className="aspect-video relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2998.5!2d69.2285!3d41.3115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b534a2e01e3%3A0xbc81e07f3e3e4eb1!2sMalika%20Savdo%20Majmuasi!5e0!3m2!1sru!2s"
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
                <p className="text-white font-medium">{(t.footer as any).address2 || 'Торговые ряды Малика, 31б, Ташкент'}</p>
                <p className="text-sm text-gray-400">
                  {language === 'ru'
                    ? 'Рынок Малика'
                    : 'Malika bozori'}
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
              
              <div className="grid grid-cols-1 gap-4">
                <a
                  href={tgLink}
                  target={tgLink.startsWith('http') ? '_blank' : undefined}
                  rel={tgLink.startsWith('http') ? 'noopener noreferrer' : undefined}
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
                    +998 (99) 823-09-90
                  </span>
                </a>

                <a
                  href="tel:+998888907000"
                  className="flex items-center justify-center gap-3 p-4 rounded-xl bg-neutral-800 border border-gray-700 hover:border-red-500/50 hover:bg-neutral-800/80 transition-all group"
                >
                  <Phone className="w-6 h-6 text-red-500" />
                  <span className="text-white group-hover:text-red-500 text-lg font-medium transition-colors">
                    +998 (88) 890-70-00
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
