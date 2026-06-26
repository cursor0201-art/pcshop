import decimal
from django.core.management.base import BaseCommand
from shop.models import Category, Product, ProductCharacteristic

class Command(BaseCommand):
    help = 'Seed database with baseline categories and products'

    def handle(self, *args, **options):
        self.stdout.write('Seeding categories...')
        categories_data = [
            { "id": 1, "name_ru": "Готовые ПК", "name_uz": "Tayyor PK", "slug": "ready-pc", "description_ru": "Готовые игровые и рабочие компьютеры", "description_uz": "Tayyor o'yin va ish kompyuterlari" },
            { "id": 2, "name_ru": "Процессоры", "name_uz": "Protsessorlar", "slug": "processors", "description_ru": "Процессоры Intel и AMD", "description_uz": "Intel va AMD protsessorlari" },
            { "id": 3, "name_ru": "Видеокарты", "name_uz": "Videokartalar", "slug": "videocards", "description_ru": "Игровые и профессиональные видеокарты", "description_uz": "O'yin va professional videokartalar" },
            { "id": 4, "name_ru": "Материнские платы", "name_uz": "Platalar", "slug": "motherboards", "description_ru": "Материнские платы для любых сокетов", "description_uz": "Har qanday soketlar uchun ona platalar" },
            { "id": 5, "name_ru": "Оперативная память", "name_uz": "Operativ xotira", "slug": "ram", "description_ru": "Модули оперативной памяти DDR4 и DDR5", "description_uz": "DDR4 va DDR5 operativ xotira modullari" },
            { "id": 6, "name_ru": "SSD", "name_uz": "SSD", "slug": "ssd", "description_ru": "Быстрые твердотельные накопители", "description_uz": "Tezkor qattiq disklar" },
            { "id": 7, "name_ru": "Мониторы", "name_uz": "Monitorlar", "slug": "monitors", "description_ru": "Игровые и офисные мониторы", "description_uz": "O'yin va ofis monitorlari" },
            { "id": 8, "name_ru": "Клавиатуры", "name_uz": "Klaviaturalar", "slug": "keyboards", "description_ru": "Механические и мембранные клавиатуры", "description_uz": "Mexanik va membranali klaviaturalar" },
            { "id": 9, "name_ru": "Мышки", "name_uz": "Mishkalar", "slug": "mice", "description_ru": "Игровые и эргономичные мыши", "description_uz": "O'yin va ergonomik sichqonlar" }
        ]

        for cat in categories_data:
            Category.objects.update_or_create(
                id=cat['id'],
                defaults={
                    'name_ru': cat['name_ru'],
                    'name_uz': cat['name_uz'],
                    'slug': cat['slug'],
                    'description_ru': cat['description_ru'],
                    'description_uz': cat['description_uz'],
                }
            )

        self.stdout.write('Seeding products...')
        products_data = [
            {
                "id": 1,
                "category_id": 1,
                "name_ru": "Игровой ПК RTX 4070",
                "name_uz": "Oyin PK RTX 4070",
                "slug": "gaming-pc-rtx-4070",
                "description_ru": "Мощный игровой ПК с RTX 4070, Ryzen 7 7800X3D, 32GB RAM",
                "description_uz": "RTX 4070, Ryzen 7 7800X3D, 32GB RAM bilan kuchli oyun PK",
                "price": 28000000.00,
                "old_price": 32000000.00,
                "stock": 5,
                "brand": "PcShop_uz",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": True,
                "specs": {"CPU": "Ryzen 7 7800X3D", "GPU": "RTX 4070 12GB", "RAM": "32GB DDR5", "SSD": "1TB NVMe", "PSU": "750W 80+ Gold"}
            },
            {
                "id": 2,
                "category_id": 1,
                "name_ru": "Игровой ПК RTX 4080",
                "name_uz": "Oyin PK RTX 4080",
                "slug": "gaming-pc-rtx-4080",
                "description_ru": "Топовый игровой ПК с RTX 4080, Intel i9-14900K, 64GB RAM",
                "description_uz": "RTX 4080, Intel i9-14900K, 64GB RAM bilan eng yaxshi oyun PK",
                "price": 45000000.00,
                "old_price": 52000000.00,
                "stock": 3,
                "brand": "PcShop_uz",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": True,
                "specs": {"CPU": "Intel i9-14900K", "GPU": "RTX 4080 16GB", "RAM": "64GB DDR5", "SSD": "2TB NVMe", "PSU": "1000W 80+ Platinum"}
            },
            {
                "id": 3,
                "category_id": 2,
                "name_ru": "AMD Ryzen 9 7950X",
                "name_uz": "AMD Ryzen 9 7950X",
                "slug": "amd-ryzen-9-7950x",
                "description_ru": "16 ядер, 32 потока, базовая частота 4.5 GHz",
                "description_uz": "16 yadro, 32 oqim, bazaviy chastota 4.5 GHz",
                "price": 8500000.00,
                "old_price": 9000000.00,
                "stock": 15,
                "brand": "AMD",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": False,
                "specs": {"Cores": "16", "Threads": "32", "Base Clock": "4.5 GHz", "Boost Clock": "5.7 GHz", "TDP": "170W"}
            },
            {
                "id": 4,
                "category_id": 2,
                "name_ru": "Intel Core i9-14900K",
                "name_uz": "Intel Core i9-14900K",
                "slug": "intel-core-i9-14900k",
                "description_ru": "24 ядра, 32 потока, базовая частота 3.2 GHz",
                "description_uz": "24 yadro, 32 oqim, bazaviy chastota 3.2 GHz",
                "price": 9200000.00,
                "old_price": 9800000.00,
                "stock": 12,
                "brand": "Intel",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": False,
                "specs": {"Cores": "24", "Threads": "32", "Base Clock": "3.2 GHz", "Boost Clock": "6.0 GHz", "TDP": "125W"}
            },
            {
                "id": 5,
                "category_id": 2,
                "name_ru": "AMD Ryzen 7 7800X3D",
                "name_uz": "AMD Ryzen 7 7800XD",
                "slug": "amd-ryzen-7-7800x3d",
                "description_ru": "8 ядер, 16 потоков, технология 3D V-Cache",
                "description_uz": "8 yadro, 16 oqim, 3D V-Cache texnologiyasi",
                "price": 6500000.00,
                "stock": 20,
                "brand": "AMD",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": False,
                "is_new": True,
                "specs": {"Cores": "8", "Threads": "16", "Base Clock": "4.2 GHz", "Boost Clock": "5.0 GHz", "TDP": "120W"}
            },
            {
                "id": 6,
                "category_id": 3,
                "name_ru": "NVIDIA RTX 4090",
                "name_uz": "NVIDIA RTX 4090",
                "slug": "nvidia-rtx-4090",
                "description_ru": "24GB GDDR6X, Ray Tracing, DLSS 3.0",
                "description_uz": "24GB GDDR6X, Ray Tracing, DLSS 3.0",
                "price": 28000000.00,
                "old_price": 30000000.00,
                "stock": 4,
                "brand": "NVIDIA",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": False,
                "specs": {"Memory": "24GB GDDR6X", "Clock": "2520 MHz", "Power": "450W", "Ports": "3x DP, 1x HDMI"}
            },
            {
                "id": 7,
                "category_id": 3,
                "name_ru": "NVIDIA RTX 4070 Ti",
                "name_uz": "NVIDIA RTX 4070 Ti",
                "slug": "nvidia-rtx-4070-ti",
                "description_ru": "12GB GDDR6X, Ray Tracing, DLSS 3.0",
                "description_uz": "12GB GDDR6X, Ray Tracing, DLSS 3.0",
                "price": 12500000.00,
                "old_price": 13500000.00,
                "stock": 8,
                "brand": "NVIDIA",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": False,
                "specs": {"Memory": "12GB GDDR6X", "Clock": "2610 MHz", "Power": "285W", "Ports": "3x DP, 1x HDMI"}
            },
            {
                "id": 8,
                "category_id": 3,
                "name_ru": "AMD RX 7900 XTX",
                "name_uz": "AMD RX 7900 XTX",
                "slug": "amd-rx-7900-xtx",
                "description_ru": "24GB GDDR6, FSR 3.0",
                "description_uz": "24GB GDDR6, FSR 3.0",
                "price": 18500000.00,
                "old_price": 19500000.00,
                "stock": 6,
                "brand": "AMD",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": False,
                "is_new": True,
                "specs": {"Memory": "24GB GDDR6", "Clock": "2500 MHz", "Power": "355W", "Ports": "2x DP, 1x HDMI, 1x USB-C"}
            },
            {
                "id": 9,
                "category_id": 4,
                "name_ru": "ASUS ROG Maximus Z790 Hero",
                "name_uz": "ASUS ROG Maximus Z790 Hero",
                "slug": "asus-rog-maximus-z790-hero",
                "description_ru": "Intel LGA 1700, DDR5, WiFi 6E",
                "description_uz": "Intel LGA 1700, DDR5, WiFi 6E",
                "price": 7500000.00,
                "old_price": 8000000.00,
                "stock": 7,
                "brand": "ASUS",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": False,
                "specs": {"Socket": "LGA 1700", "Memory": "DDR5", "PCIe": "5.0", "WiFi": "6E"}
            },
            {
                "id": 10,
                "category_id": 4,
                "name_ru": "MSI MPG X670E Carbon WiFi",
                "name_uz": "MSI MPG X670E Carbon WiFi",
                "slug": "msi-mpg-x670e-carbon-wifi",
                "description_ru": "AMD AM5, DDR5, WiFi 6E",
                "description_uz": "AMD AM5, DDR5, WiFi 6E",
                "price": 5500000.00,
                "stock": 10,
                "brand": "MSI",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": False,
                "is_new": True,
                "specs": {"Socket": "AM5", "Memory": "DDR5", "PCIe": "5.0", "WiFi": "6E"}
            },
            {
                "id": 11,
                "category_id": 5,
                "name_ru": "G.Skill Trident Z5 RGB 32GB DDR5-6000",
                "name_uz": "G.Skill Trident Z5 RGB 32GB DDR5-6000",
                "slug": "gskill-trident-z5-32gb-ddr5-6000",
                "description_ru": "32GB (2x16GB) DDR5-6000 CL30",
                "description_uz": "32GB (2x16GB) DDR5-6000 CL30",
                "price": 2800000.00,
                "old_price": 3000000.00,
                "stock": 25,
                "brand": "G.Skill",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": False,
                "specs": {"Capacity": "32GB", "Speed": "6000 MHz", "Latency": "CL30", "Type": "DDR5"}
            },
            {
                "id": 12,
                "category_id": 6,
                "name_ru": "Samsung 990 Pro 2TB",
                "name_uz": "Samsung 990 Pro 2TB",
                "slug": "samsung-990-pro-2tb",
                "description_ru": "NVMe M.2, чтение 7450 МБ/с",
                "description_uz": "NVMe M.2, oqish 7450 MB/s",
                "price": 3200000.00,
                "old_price": 3500000.00,
                "stock": 30,
                "brand": "Samsung",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": False,
                "specs": {"Capacity": "2TB", "Read": "7450 MB/s", "Write": "6900 MB/s", "Interface": "PCIe 4.0"}
            },
            {
                "id": 13,
                "category_id": 7,
                "name_ru": "LG UltraGear 27GP950-B",
                "name_uz": "LG UltraGear 27GP950-B",
                "slug": "lg-ultragear-27gp950-b",
                "description_ru": "27\" 4K 144Hz IPS, HDR 600, G-Sync",
                "description_uz": "27\" 4K 144Hz IPS, HDR 600, G-Sync",
                "price": 8500000.00,
                "old_price": 9000000.00,
                "stock": 8,
                "brand": "LG",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": True,
                "specs": {"Size": "27 inch", "Resolution": "4K", "Refresh": "144Hz", "Panel": "IPS"}
            },
            {
                "id": 14,
                "category_id": 8,
                "name_ru": "Logitech G Pro X TKL",
                "name_uz": "Logitech G Pro X TKL",
                "slug": "logitech-g-pro-x-tkl",
                "description_ru": "Mechanical, GX Red switches, RGB",
                "description_uz": "Mexanik, GX Red switches, RGB",
                "price": 1800000.00,
                "old_price": 2000000.00,
                "stock": 20,
                "brand": "Logitech",
                "image": "https://images.pexels.com/photos/13019724/pexels-photo-13019724.jpeg",
                "is_featured": True,
                "is_new": False,
                "specs": {"Type": "Mechanical", "Switches": "GX Red", "Layout": "TKL", "Connection": "Wired"}
            }
        ]

        for p in products_data:
            cat = Category.objects.get(id=p['category_id'])
            prod_obj, created = Product.objects.update_or_create(
                id=p['id'],
                defaults={
                    'category': cat,
                    'name_ru': p['name_ru'],
                    'name_uz': p['name_uz'],
                    'slug': p['slug'],
                    'description_ru': p['description_ru'],
                    'description_uz': p['description_uz'],
                    'price': decimal.Decimal(str(p['price'])),
                    'old_price': decimal.Decimal(str(p['old_price'])) if p.get('old_price') else None,
                    'stock': p['stock'],
                    'brand': p['brand'],
                    'image': p['image'],
                    'is_featured': p['is_featured'],
                    'is_new': p['is_new'],
                }
            )

            # Seed characteristics
            for name, val in p['specs'].items():
                ProductCharacteristic.objects.update_or_create(
                    product=prod_obj,
                    name_ru=name,
                    defaults={
                        'name_uz': name,
                        'value_ru': val,
                        'value_uz': val,
                    }
                )

        self.stdout.write('Database seeded successfully!')
