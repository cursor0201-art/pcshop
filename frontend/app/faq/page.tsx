'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, Phone, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const FAQ_ITEMS = [
  {
    question_ru: 'Как оформить заказ на сайте?',
    question_uz: 'Saytda qanday buyurtma berish mumkin?',
    answer_ru: 'Чтобы оформить заказ, выберите интересующие вас товары или воспользуйтесь конфигуратором ПК, добавьте их в корзину и перейдите на страницу оформления заказа. Заполните контактные данные, и наш менеджер свяжется с вами для подтверждения заказа.',
    answer_uz: 'Buyurtma berish uchun o\'zingizga yoqqan mahsulotlarni tanlang yoki PK konfiguratoridan foydalanib ularni savatga qo\'shing va buyurtmani rasmiylashtirish sahifasiga o\'ting. Kontakt ma\'lumotlaringizni to\'ldiring va menejerimiz buyurtmani tasdiqlash uchun siz bilan bog\'lanadi.'
  },
  {
    question_ru: 'Каковы условия доставки по Узбекистану?',
    question_uz: 'O\'zbekiston bo\'ylab yetkazib berish shartlari qanday?',
    answer_ru: 'Доставка по Ташкенту осуществляется в день заказа или на следующий день. Стоимость доставки по Ташкенту — от 30 000 сум (при крупных заказах возможна бесплатная доставка). Доставка в другие города Узбекистана (Самарканд, Бухара, Фергана и др.) занимает от 2 до 3 рабочих дней курьерскими службами.',
    answer_uz: 'Toshkent bo\'ylab yetkazib berish buyurtma qilingan kuni yoki ertasi kuni amalga oshiriladi. Toshkent bo\'ylab yetkazib berish narxi 30 000 so\'mdan boshlanadi (yirik buyurtmalar uchun bepul yetkazib berish mumkin). O\'zbekistonning boshqa shaharlariga (Samarqand, Buxoro, Farg\'ona va h.k.) yetkazib berish kuryerlik xizmatlari orqali 2-3 ish kunini oladi.'
  },
  {
    question_ru: 'Какая гарантия предоставляется на комплектующие?',
    question_uz: 'Butlovchi qismlarga qanday kafolat beriladi?',
    answer_ru: 'На все новые комплектующие и готовые сборки предоставляется официальная гарантия от производителя сроком от 12 до 36 месяцев (в зависимости от конкретного товара). Вся продукция сертифицирована.',
    answer_uz: 'Barcha yangi butlovchi qismlarga va tayyor yig\'malarga ishlab chiqaruvchidan 12 oydan 36 oygacha (mahsulotga qarab) rasmiy kafolat beriladi. Barcha mahsulotlar sertifikatlangan.'
  },
  {
    question_ru: 'Можно ли собрать компьютер по индивидуальным параметрам?',
    question_uz: 'Kompyuterni individual parametrlar bo\'yicha yig\'ish mumkinmi?',
    answer_ru: 'Да, конечно! Вы можете воспользоваться нашим разделом «Конфигуратор ПК» для самостоятельного подбора деталей, либо связаться с нашими специалистами через Telegram или по телефону. Мы поможем подобрать оптимальные комплектующие под ваши задачи и бюджет, выполним профессиональную сборку, установку ПО и стресс-тестирование бесплатно.',
    answer_uz: 'Ha, albatta! Butlovchi qismlarni o\'zingiz tanlash uchun «PK Konfiguratori» bo\'limimizdan foydalanishingiz yoki Telegram yoki telefon orqali mutaxassislarimiz bilan bog\'lanishingiz mumkin. Biz sizning vazifalaringiz va byudjetingizga mos keladigan optimal komponentlarni tanlashga yordam beramiz, professional yig\'ish, dasturiy ta\'minotni o\'rnatish va bepul sinovdan o\'tkazishni amalga oshiramiz.'
  },
  {
    question_ru: 'Какие способы оплаты вы принимаем?',
    question_uz: 'Qanday to\'lov usullarini qabul qilasiz?',
    answer_ru: 'Мы принимаем оплату наличными при получении товара, переводы на карты Click и Payme, а также оплату по безналичному расчету (с предоставлением всех закрывающих документов и договора) для юридических лиц.',
    answer_uz: 'Biz tovarlarni olishda naqd pul to\'lashni, Click va Payme kartalariga o\'tkazmalarni, shuningdek yuridik shaxslar uchun naqd pulsiz to\'lovlarni (barcha yopuvchi hujjatlar va shartnomalarni taqdim etgan holda) qabul qilamiz.'
  }
];

export default function FAQPage() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [tgLink, setTgLink] = useState('https://telegram.me/pcshop_uzz');

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      setTgLink('tg://resolve?domain=pcshop_uzz');
    }
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Dynamic FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": language === 'ru' ? item.question_ru : item.question_uz,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": language === 'ru' ? item.answer_ru : item.answer_uz
      }
    }))
  };

  // Breadcrumbs schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://storepcshop.uz"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": "https://storepcshop.uz/faq"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
              {language === 'ru' ? 'Часто задаваемые вопросы' : 'Ko\'p beriladigan savollar'}
            </h1>
            <p className="text-gray-400">
              {language === 'ru' 
                ? 'Найдите ответы на интересующие вас вопросы о покупке оборудования, доставке и гарантии.' 
                : 'Uskunalarni sotib olish, yetkazib berish va kafolat bo\'yicha savollaringizga javob toping.'}
            </p>
          </div>

          {/* Accordion list */}
          <div className="space-y-4 mb-16">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              const question = language === 'ru' ? item.question_ru : item.question_uz;
              const answer = language === 'ru' ? item.answer_ru : item.answer_uz;
              
              return (
                <div 
                  key={index} 
                  className="bg-neutral-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="font-semibold text-white md:text-lg">{question}</span>
                    <ChevronDown className={`w-5 h-5 text-red-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6 pt-0 text-sm md:text-base text-gray-400 leading-relaxed border-t border-gray-800/50">
                          {answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Contact options */}
          <div className="bg-neutral-900/50 border border-gray-800 rounded-2xl p-8 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'ru' ? 'Не нашли ответ на свой вопрос?' : 'Savolingizga javob topmadingizmi?'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'ru' 
                  ? 'Свяжитесь с нами напрямую! Наши менеджеры проконсультируют вас по любым вопросам.' 
                  : 'Biz bilan to\'g\'ridan-to\'g\'ri bog\'laning! Menejerlarimiz sizga har qanday masalada yordam berishadi.'}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <a 
                href={tgLink} 
                target={tgLink.startsWith('http') ? '_blank' : undefined} 
                rel={tgLink.startsWith('http') ? 'noopener noreferrer' : undefined} 
                className="flex items-center justify-center gap-3 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-bold transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Telegram: @pcshop_uzz</span>
              </a>
              <a 
                href="tel:+998998230990" 
                className="flex items-center justify-center gap-3 py-3 rounded-xl bg-neutral-900 border border-gray-800 hover:border-gray-700 text-white font-bold transition-all"
              >
                <Phone className="w-5 h-5 text-red-500" />
                <span>+998 (99) 823-09-90</span>
              </a>
              <a 
                href="tel:+998888907000" 
                className="flex items-center justify-center gap-3 py-3 rounded-xl bg-neutral-900 border border-gray-800 hover:border-gray-700 text-white font-bold transition-all"
              >
                <Phone className="w-5 h-5 text-red-500" />
                <span>+998 (88) 890-70-00</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
