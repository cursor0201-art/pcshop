export interface BlogPost {
  slug: string;
  title_ru: string;
  title_uz: string;
  excerpt_ru: string;
  excerpt_uz: string;
  content_ru: string;
  content_uz: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  keywords_ru: string;
  keywords_uz: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-choose-gaming-pc',
    title_ru: 'Как выбрать игровой ПК в 2026 году: Полное руководство',
    title_uz: '2026-yilda o\'yin kompyuterini qanday tanlash kerak: To\'liq qo\'llanma',
    excerpt_ru: 'Разбираемся, на что обратить внимание при выборе игрового компьютера в Ташкенте: видеокарта, процессор, оперативная память и охлаждение.',
    excerpt_uz: 'Toshkentda o\'yin kompyuterini tanlashda nimalarga e\'tibor berish kerakligini tahlil qilamiz: videokarta, protsessor, tezkor xotira va sovutish.',
    keywords_ru: 'выбрать игровой ПК, купить компьютер Ташкент, игровой компьютер Ташкент, PcShop_uz',
    keywords_uz: 'o\'yin kompyuteri tanlash, Toshkentda kompyuter sotib olish, o\'yin kompyuteri Toshkent',
    image: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
    date: '2026-06-15',
    readTime: '8 мин',
    author: 'PcShop_uz Team',
    content_ru: `
      <h2>Введение в выбор игрового ПК</h2>
      <p>Игровой компьютер — это инвестиция в ваше развлечение и продуктивность на несколько лет вперед. В 2026 году требования к играм существенно возросли с развитием трассировки лучей (Ray Tracing) и технологий ИИ-апскейлинга.</p>
      
      <h3>Главное звено — Видеокарта</h3>
      <p>Видеокарта является самым важным компонентом игрового ПК. Если вы хотите комфортно играть в Ташкенте в 2K или 4K разрешении, обратите внимание на линейку NVIDIA GeForce RTX 40-й и 50-й серий или AMD Radeon RX.</p>
      <ul>
        <li><strong>Бюджетные решения:</strong> RTX 4060 / RX 7600 для Full HD гейминга.</li>
        <li><strong>Средний класс:</strong> RTX 4070 / RTX 5070 для стабильных 100+ FPS в 2K.</li>
        <li><strong>Ультимативный гейминг:</strong> RTX 4090 / RTX 5090 для максимальных настроек в 4K.</li>
      </ul>

      <h3>Процессор: Сердце вашей сборки</h3>
      <p>Процессор должен соответствовать мощности видеокарты, чтобы не создавать эффект "бутылочного горлышка" (bottleneck). Мы рекомендуем AMD Ryzen 7 7800X3D / 9800X3D или Intel Core i7 14700K.</p>
      
      <h3>Остальные компоненты</h3>
      <p>Не забывайте об оперативной памяти (минимум 32 ГБ DDR5), быстром SSD-накопителе (NVMe PCIe 4.0/5.0) и надежном блоке питания с золотым сертификатом качества.</p>
    `,
    content_uz: `
      <h2>O'yin kompyuterini tanlashga kirish</h2>
      <p>O'yin kompyuteri - bu bir necha yil davomida hordiq chiqarish va unumdorlik uchun sarmoyadir. 2026-yilda o'yinlarga bo'lgan talablar Ray Tracing va sun'iy intellekt texnologiyalari tufayli sezilarli darajada oshdi.</p>
      
      <h3>Eng muhim qism - Videokarta</h3>
      <p>Videokarta o'yin kompyuterining eng muhim qismidir. Toshkentda 2K yoki 4K o'yinlarda qulay o'ynash uchun NVIDIA GeForce RTX 40 va 50-seriyalariga yoki AMD Radeon RX seriyasiga e'tibor bering.</p>
      <ul>
        <li><strong>Hamyonbop variantlar:</strong> Full HD uchun RTX 4060 / RX 7600.</li>
        <li><strong>O'rta sinf:</strong> 2K o'yinlar uchun RTX 4070 / RTX 5070.</li>
        <li><strong>Maksimal o'yinlar:</strong> 4K maksimal sozlamalar uchun RTX 4090 / RTX 5090.</li>
      </ul>

      <h3>Protsessor: Tizimning yuragi</h3>
      <p>Protsessor videokarta kuchiga mos bo'lishi kerak. Biz AMD Ryzen 7 7800X3D / 9800X3D yoki Intel Core i7 14700K protsessorlarini tavsiya etamiz.</p>
    `
  },
  {
    slug: 'best-graphics-cards-2026',
    title_ru: 'Лучшие видеокарты в 2026 году: Какую купить в Ташкенте?',
    title_uz: '2026-yilning eng yaxshi videokartalari: Toshkentda qaysi birini sotib olish kerak?',
    excerpt_ru: 'Сравнение актуальных графических ускорителей NVIDIA GeForce RTX и AMD Radeon по соотношению цена/производительность.',
    excerpt_uz: 'NVIDIA GeForce RTX va AMD Radeon videokartalarini narx va unumdorlik nisbati bo\'yicha taqqoslash.',
    keywords_ru: 'лучшие видеокарты, видеокарта Ташкент, купить RTX, Nvidia RTX, AMD Radeon, PcShop_uz',
    keywords_uz: 'eng yaxshi videokartalar, videokarta Toshkent, RTX sotib olish, Nvidia RTX, AMD Radeon',
    image: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
    date: '2026-06-12',
    readTime: '6 мин',
    author: 'PcShop_uz Team',
    content_ru: `
      <h2>Рейтинг видеокарт 2026 года</h2>
      <p>В этом обзоре мы рассмотрим лучшие видеокарты, которые вы можете купить в Ташкенте в компьютерном магазине PcShop_uz.</p>
      <h3>NVIDIA RTX 50-я серия</h3>
      <p>Новое поколение графики NVIDIA предлагает непревзойденную производительность в трассировке лучей и обновленный DLSS 4.0 с генерацией кадров на базе ИИ.</p>
    `,
    content_uz: `
      <h2>2026-yil videokartalar reytingi</h2>
      <p>Ushbu sharhda biz Toshkentdagi PcShop_uz do'konida sotib olishingiz mumkin bo'lgan eng yaxshi videokartalarni ko'rib chiqamiz.</p>
    `
  },
  {
    slug: 'rtx-vs-radeon',
    title_ru: 'RTX против Radeon: Что выбрать для игрового ПК в Узбекистане?',
    title_uz: 'RTX yoki Radeon: O\'zbekistonda o\'yin PK uchun qaysi birini tanlash kerak?',
    excerpt_ru: 'Сравниваем технологии трассировки лучей, апскейлинга DLSS/FSR и производительность в играх между NVIDIA и AMD.',
    excerpt_uz: 'NVIDIA va AMD o\'rtasidagi nurlar trassirovkasi, DLSS/FSR va o\'yinlardagi unumdorlikni taqqoslaymiz.',
    keywords_ru: 'RTX vs Radeon, трассировка лучей, DLSS, FSR, видеокарта Ташкент, Nvidia AMD',
    keywords_uz: 'RTX va Radeon, nurlar trassirovkasi, DLSS, FSR, videokarta Toshkent',
    image: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
    date: '2026-06-08',
    readTime: '7 мин',
    author: 'PcShop_uz Team',
    content_ru: `
      <h2>Сравнение технологий гигантов графики</h2>
      <p>Вечный спор геймеров: зеленые или красные? Разбираемся в технологиях трассировки и масштабирования.</p>
    `,
    content_uz: `
      <h2>Grafika gigantlari texnologiyalarini taqqoslash</h2>
      <p>Geymerlarning abadiy bahsi: yashillar yoki qizillar? Texnologiyalarni tahlil qilamiz.</p>
    `
  },
  {
    slug: 'best-amd-processors',
    title_ru: 'Лучшие процессоры AMD Ryzen для игр и работы',
    title_uz: 'O\'yinlar va ish uchun eng yaxshi AMD Ryzen protsessorlari',
    excerpt_ru: 'Подробный обзор линейки Ryzen с технологией 3D V-Cache, которая удерживает лидерство в игровом сегменте.',
    excerpt_uz: 'O\'yin segmentida yetakchilik qilayotgan 3D V-Cache texnologiyasiga ega Ryzen seriyasining sharhi.',
    keywords_ru: 'процессор AMD, AMD Ryzen, Ryzen 3D V-Cache, процессор Ташкент, сборка ПК Ташкент',
    keywords_uz: 'protsessor AMD, AMD Ryzen, Ryzen 3D V-Cache, protsessor Toshkent',
    image: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
    date: '2026-06-05',
    readTime: '5 мин',
    author: 'PcShop_uz Team',
    content_ru: `
      <h2>Эра Ryzen 3D V-Cache</h2>
      <p>Процессоры AMD Ryzen совершили революцию в игровой производительности благодаря увеличенному кэшу третьего уровня.</p>
    `,
    content_uz: `
      <h2>AMD Ryzen davri</h2>
      <p>AMD Ryzen protsessorlari uchinchi darajali kesh xotirasi evaziga o'yinlarda yetakchilik qilmoqda.</p>
    `
  },
  {
    slug: 'best-intel-processors',
    title_ru: 'Лучшие процессоры Intel Core 14-го и 15-го поколений',
    title_uz: 'Eng yaxshi Intel Core 14 va 15-avlod protsessorlari',
    excerpt_ru: 'Анализируем гибридную архитектуру Intel Core i5, i7 и i9 для рабочих станций и игровых конфигураций.',
    excerpt_uz: 'Ish stansiyalari va o\'yin kompyuterlari uchun Intel Core i5, i7 va i9 durลูกar arxitekturasini tahlil qilamiz.',
    keywords_ru: 'процессор Intel, Intel Core, i7 14700K, процессор Ташкент, компьютерный магазин Узбекистан',
    keywords_uz: 'protsessor Intel, Intel Core, i7 14700K, protsessor Toshkent',
    image: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
    date: '2026-06-01',
    readTime: '6 мин',
    author: 'PcShop_uz Team',
    content_ru: `
      <h2>Гибридная мощь Intel Core</h2>
      <p>Процессоры Intel сочетают производительные P-ядра и энергоэффективные E-ядра, обеспечивая максимальную мультизадачность.</p>
    `,
    content_uz: `
      <h2>Intel Core gibrid quvvati</h2>
      <p>Intel protsessorlari yuqori unumdorlikdagi P-yadro va energiya tejamkor E-yadrolarni birlashtiradi.</p>
    `
  },
  {
    slug: 'how-to-build-gaming-pc',
    title_ru: 'Сборка ПК для игр своими руками: Пошаговое руководство',
    title_uz: 'Mustaqil o\'yin PK yig\'ish: Bosqichma-bosqich qo\'llanma',
    excerpt_ru: 'Инструкция по сборке компьютера: от установки процессора в сокет до кабель-менеджмента и первого запуска.',
    excerpt_uz: 'Kompyuter yig\'ish bo\'yicha qo\'llanma: protsessorni o\'rnatishdan tortib birinchi ishga tushirishgacha.',
    keywords_ru: 'сборка ПК для игр, собрать компьютер самому, сборка ПК Ташкент, комплектующие для ПК',
    keywords_uz: 'o\'yin kompyuteri yig\'ish, kompyuter yig\'ish Toshkent, kompyuter qismlari',
    image: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
    date: '2026-05-28',
    readTime: '10 мин',
    author: 'PcShop_uz Team',
    content_ru: `
      <h2>Пошаговое руководство по сборке ПК</h2>
      <p>Сборка ПК — это увлекательный процесс, который позволяет сэкономить бюджет и получить систему мечты.</p>
    `,
    content_uz: `
      <h2>Kompyuter yig'ish bo'yicha qo'llanma</h2>
      <p>Kompyuterni mustaqil yig'ish - bu o'z tizimingizni yaratish uchun ajoyib jarayondir.</p>
    `
  },
  {
    slug: 'pc-for-office-and-work',
    title_ru: 'Компьютер для работы: Как выбрать рабочую станцию?',
    title_uz: 'Ish uchun kompyuter: Ishchi stansiyani qanday tanlash kerak?',
    excerpt_ru: 'Рекомендации по выбору офисных ПК и мощных станций для 3D-моделирования, видеомонтажа и программирования.',
    excerpt_uz: '3D-modellashtirish, videomontaj va dasturlash uchun kuchli ishchi stansiyalarni tanlash bo\'yicha tavsiyalar.',
    keywords_ru: 'компьютер для работы, рабочая станция, 3D моделирование, программирование, купить компьютер Ташкент',
    keywords_uz: 'ish uchun kompyuter, ishchi stansiya, 3D modellashtirish, dasturlash, kompyuter Toshkent',
    image: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
    date: '2026-05-25',
    readTime: '5 мин',
    author: 'PcShop_uz Team',
    content_ru: `
      <h2>Выбор компьютера для профессионалов</h2>
      <p>Для разных задач требуются разные мощности. Монтаж видео требует мощной видеокарты, программирование — быстрого CPU и ОЗУ.</p>
    `,
    content_uz: `
      <h2>Professionallar uchun kompyuter tanlash</h2>
      <p>Turli vazifalar uchun turli quvvatlar talab etiladi. Videomontaj uchun kuchli grafika, dasturlash uchun esa tezkor CPU zarur.</p>
    `
  },
  {
    slug: 'gaming-monitors-guide',
    title_ru: 'Игровые мониторы: Разрешение, частота обновления и тип матрицы',
    title_uz: 'O\'yin monitorlari: Ruxsat, yangilanish chastotasi va matritsa turi',
    excerpt_ru: 'Какая разница между IPS, VA и OLED? Как выбрать частоту обновления 144Гц или 240Гц для киберспорта.',
    excerpt_uz: 'IPS, VA va OLED o\'rtasidagi farq nima? Kiber-sport uchun 144Hz yoki 240Hz monitor tanlash.',
    keywords_ru: 'игровой монитор, монитор Ташкент, IPS vs VA, 144Гц, OLED монитор, PcShop_uz',
    keywords_uz: 'o\'yin monitori, monitor Toshkent, IPS va VA, 144Hz, OLED monitor',
    image: 'https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg',
    date: '2026-05-20',
    readTime: '7 мин',
    author: 'PcShop_uz Team',
    content_ru: `
      <h2>Выбор игрового дисплея</h2>
      <p>Частота развертки (Герцы) и время отклика пикселей играют решающую роль в соревновательных онлайн-играх.</p>
    `,
    content_uz: `
      <h2>O'yin displeyini tanlash</h2>
      <p>Ekran yangilanish chastotasi (Gerts) onlayn o'yinlarda hal qiluvchi ahamiyatga ega.</p>
    `
  }
];
