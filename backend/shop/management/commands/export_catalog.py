import json
from django.core.management.base import BaseCommand
from shop.models import Category, Product, ProductCharacteristic

class Command(BaseCommand):
    help = 'Export all categories and products to clean JSON'

    def handle(self, *args, **options):
        self.stdout.write('Exporting catalog data...')
        
        categories = []
        for cat in Category.objects.all():
            categories.append({
                'id': cat.id,
                'name_ru': cat.name_ru,
                'name_uz': cat.name_uz,
                'slug': cat.slug,
                'description_ru': cat.description_ru,
                'description_uz': cat.description_uz,
                'is_active': cat.is_active,
            })

        products = []
        for p in Product.objects.all():
            characteristics = []
            for char in p.characteristics.all():
                characteristics.append({
                    'name_ru': char.name_ru,
                    'name_uz': char.name_uz,
                    'value_ru': char.value_ru,
                    'value_uz': char.value_uz,
                })

            products.append({
                'id': p.id,
                'category_id': p.category_id,
                'name_ru': p.name_ru,
                'name_uz': p.name_uz,
                'slug': p.slug,
                'description_ru': p.description_ru,
                'description_uz': p.description_uz,
                'price': float(p.price) if p.price else 0.0,
                'price_usd': float(p.price_usd) if p.price_usd else None,
                'old_price': float(p.old_price) if p.old_price else None,
                'old_price_usd': float(p.old_price_usd) if p.old_price_usd else None,
                'stock': p.stock,
                'brand': p.brand,
                'image': p.image,
                'warranty_months': p.warranty_months,
                'is_active': p.is_active,
                'is_new': p.is_new,
                'is_featured': p.is_featured,
                'characteristics': characteristics,
            })

        data = {
            'categories': categories,
            'products': products
        }

        # Write to file
        with open('catalog_backup.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        self.stdout.write('='*50)
        self.stdout.write('CATALOG BACKUP JSON (Copy everything below this line):')
        self.stdout.write('='*50)
        self.stdout.write(json.dumps(data, ensure_ascii=False, indent=2))
        self.stdout.write('='*50)
        self.stdout.write('Backup saved to catalog_backup.json and printed to console!')
