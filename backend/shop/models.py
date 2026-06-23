from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

def cyrillic_to_latin(text):
    cyrillic = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    latin = [
        'a', 'b', 'v', 'g', 'd', 'e', 'yo', 'zh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'kh', 'ts', 'ch', 'sh', 'shch', '', 'y', '', 'e', 'yu', 'ya',
        'A', 'B', 'V', 'G', 'D', 'E', 'Yo', 'Zh', 'Z', 'i', 'Y', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'Kh', 'Ts', 'Ch', 'Sh', 'Shch', '', 'Y', '', 'E', 'Yu', 'Ya'
    ]
    char_map = dict(zip(cyrillic, latin))
    result = [] 
    for char in text:
        result.append(char_map.get(char, char))
    return ''.join(result)

class Category(models.Model):
    name_ru = models.CharField(max_length=255, verbose_name="Название (RU)", default='')
    name_uz = models.CharField(max_length=255, verbose_name="Название (UZ)", default='')
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name="Slug")
    description_ru = models.TextField(blank=True, null=True, verbose_name="Описание (RU)")
    description_uz = models.TextField(blank=True, null=True, verbose_name="Описание (UZ)")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    def __str__(self):
        return f"{self.name_ru} / {self.name_uz}"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            import re
            transliterated = cyrillic_to_latin(self.name_ru or self.name_uz or "category")
            self.slug = re.sub(r'[^a-zA-Z0-9\-]', '-', transliterated.lower()).strip('-')
            self.slug = re.sub(r'-+', '-', self.slug)
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

class Product(models.Model):
    name_ru = models.CharField(max_length=255, verbose_name="Название (RU)", default='')
    name_uz = models.CharField(max_length=255, verbose_name="Название (UZ)", default='')
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name="Slug")
    description_ru = models.TextField(verbose_name="Описание (RU)", default='')
    description_uz = models.TextField(verbose_name="Описание (UZ)", default='')
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена")
    stock = models.IntegerField(default=0, verbose_name="В наличии")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Категория")
    image = models.CharField(max_length=1000, blank=True, null=True, verbose_name="Изображение (ссылка)", help_text="Введите прямую ссылку на изображение (например, с imgbb.com, telegram или другого фотохостинга).")
    brand = models.CharField(max_length=255, blank=True, null=True, verbose_name="Бренд")
    warranty_months = models.IntegerField(default=12, verbose_name="Гарантия (месяцев)")
    
    # Auto SEO fields
    seo_title_ru = models.CharField(max_length=255, blank=True, null=True, verbose_name="SEO Title (RU)")
    seo_title_uz = models.CharField(max_length=255, blank=True, null=True, verbose_name="SEO Title (UZ)")
    seo_description_ru = models.TextField(blank=True, null=True, verbose_name="SEO Description (RU)")
    seo_description_uz = models.TextField(blank=True, null=True, verbose_name="SEO Description (UZ)")
    seo_keywords_ru = models.CharField(max_length=255, blank=True, null=True, verbose_name="SEO Keywords (RU)")
    seo_keywords_uz = models.CharField(max_length=255, blank=True, null=True, verbose_name="SEO Keywords (UZ)")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    def __str__(self):
        return f"{self.name_ru} / {self.name_uz}"

    def save(self, *args, **kwargs):
        import re
        if not self.slug:
            transliterated = cyrillic_to_latin(self.name_ru or self.name_uz or "product")
            self.slug = re.sub(r'[^a-zA-Z0-9\-]', '-', transliterated.lower()).strip('-')
            self.slug = re.sub(r'-+', '-', self.slug)
            
        if not self.seo_title_ru:
            self.seo_title_ru = f"Купить {self.name_ru} в Ташкенте - цены в PcShop_uz"
        if not self.seo_title_uz:
            self.seo_title_uz = f"Toshkentda {self.name_uz} sotib olish - PcShop_uz narxlari"
            
        if not self.seo_description_ru:
            desc_part = (self.description_ru[:150] + "...") if self.description_ru else ""
            self.seo_description_ru = f"Купить {self.name_ru} по выгодной цене с гарантией в PcShop_uz. {desc_part} Доставка по Ташкенту и Узбекистану."
        if not self.seo_description_uz:
            desc_part = (self.description_uz[:150] + "...") if self.description_uz else ""
            self.seo_description_uz = f"{self.name_uz} kafolat bilan PcShop_uz do'konida arzon narxda sotib oling. {desc_part} Toshkent va O'zbekiston bo'ylab yetkazib berish."
            
        if not self.seo_keywords_ru:
            self.seo_keywords_ru = f"{self.name_ru}, купить {self.name_ru}, Ташкент, цена, комплектующие, PcShop_uz"
        if not self.seo_keywords_uz:
            self.seo_keywords_uz = f"{self.name_uz}, sotib olish, Toshkent, narxi, PcShop_uz"
            
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

class ProductCharacteristic(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='characteristics', verbose_name="Товар")
    name_ru = models.CharField(max_length=255, verbose_name="Название хар-ки (RU)")
    name_uz = models.CharField(max_length=255, verbose_name="Название хар-ки (UZ)")
    value_ru = models.CharField(max_length=255, verbose_name="Значение (RU)")
    value_uz = models.CharField(max_length=255, verbose_name="Значение (UZ)")

    def __str__(self):
        return f"{self.name_ru}: {self.value_ru}"

    class Meta:
        verbose_name = 'Характеристика'
        verbose_name_plural = 'Характеристики'

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Ожидает'),
        ('PROCESSING', 'В обработке'),
        ('SHIPPED', 'Отправлен'),
        ('DELIVERED', 'Доставлен'),
        ('CANCELLED', 'Отменен'),
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Пользователь")
    client_name = models.CharField(max_length=255, verbose_name="Имя клиента")
    client_phone = models.CharField(max_length=50, verbose_name="Телефон клиента")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, verbose_name="Общая сумма")
    comment = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', verbose_name="Статус")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    def __str__(self):
        return f"Заказ #{self.id} от {self.client_name}"

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name="Заказ")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.IntegerField(default=1, verbose_name="Количество")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена")

    def __str__(self):
        return f"{self.quantity} x {self.product.name_ru}"

    class Meta:
        verbose_name = 'Товар в заказе'
        verbose_name_plural = 'Товары в заказе'

class Review(models.Model):
    RATING_CHOICES = (
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name="Товар")
    rating = models.IntegerField(default=5, choices=RATING_CHOICES, verbose_name="Оценка")
    comment = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")

    def __str__(self):
        return f"Отзыв от {self.user.username} на {self.product.name_ru}"

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

class TelegramSettings(models.Model):
    bot_token = models.CharField(max_length=255, verbose_name="Токен бота")
    chat_id = models.CharField(max_length=255, verbose_name="ID чата")
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    def __str__(self):
        return "Настройки Telegram"
    
    class Meta:
        verbose_name = 'Настройки Telegram'
        verbose_name_plural = 'Настройки Telegram'
