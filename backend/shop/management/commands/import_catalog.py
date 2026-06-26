import json
import decimal
from django.core.management.base import BaseCommand
from shop.models import Category, Product, ProductCharacteristic

class Command(BaseCommand):
    help = 'Import categories and products from catalog_backup.json'

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, default='catalog_backup.json', help='Path to catalog backup JSON file')

    def handle(self, *args, **options):
        file_path = options['file']
        self.stdout.write(f'Loading data from {file_path}...')

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to read file: {e}'))
            return

        self.stdout.write('Importing categories...')
        categories_data = data.get('categories', [])
        for cat in categories_data:
            Category.objects.update_or_create(
                id=cat['id'],
                defaults={
                    'name_ru': cat['name_ru'],
                    'name_uz': cat['name_uz'],
                    'slug': cat['slug'],
                    'description_ru': cat['description_ru'],
                    'description_uz': cat['description_uz'],
                    'is_active': cat.get('is_active', True),
                }
            )
        self.stdout.write(f'Successfully imported {len(categories_data)} categories.')

        self.stdout.write('Importing products...')
        products_data = data.get('products', [])
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
                    'price_usd': decimal.Decimal(str(p['price_usd'])) if p.get('price_usd') else None,
                    'old_price': decimal.Decimal(str(p['old_price'])) if p.get('old_price') else None,
                    'old_price_usd': decimal.Decimal(str(p['old_price_usd'])) if p.get('old_price_usd') else None,
                    'stock': p['stock'],
                    'brand': p['brand'],
                    'image': p['image'],
                    'warranty_months': p.get('warranty_months', 12),
                    'is_active': p.get('is_active', True),
                    'is_new': p.get('is_new', False),
                    'is_featured': p.get('is_featured', False),
                }
            )

            # Recreate characteristics
            # Delete old ones first to prevent duplicates
            ProductCharacteristic.objects.filter(product=prod_obj).delete()
            for char in p.get('characteristics', []):
                ProductCharacteristic.objects.create(
                    product=prod_obj,
                    name_ru=char['name_ru'],
                    name_uz=char['name_uz'],
                    value_ru=char['value_ru'],
                    value_uz=char['value_uz'],
                )

        self.stdout.write(f'Successfully imported {len(products_data)} products.')
        self.stdout.write(self.style.SUCCESS('Catalog import completed successfully!'))
