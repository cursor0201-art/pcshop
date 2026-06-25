from django.contrib import admin
from django.db import models
from .models import Category, Product, ProductCharacteristic, Order, OrderItem, Review, ProductImage, CurrencyRate

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_ru', 'name_uz', 'is_active', 'created_at')
    list_editable = ('is_active',)
    search_fields = ('name_ru', 'name_uz')
    prepopulated_fields = {'slug': ('name_ru',)}

class ProductCharacteristicInline(admin.TabularInline):
    model = ProductCharacteristic
    extra = 1

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3

from django.forms import TextInput

class DecimalTextInput(TextInput):
    def __init__(self, attrs=None):
        default_attrs = {
            'inputmode': 'decimal',
            'pattern': '[0-9]*[.,]?[0-9]*',
            'onfocus': 'this.select()',
            'style': 'width: 150px;',
        }
        if attrs:
            default_attrs.update(attrs)
        super().__init__(attrs=default_attrs)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_ru', 'name_uz', 'price', 'price_usd', 'stock', 'is_active', 'category')
    list_editable = ('is_active',)
    list_filter = ('category', 'is_active')
    search_fields = ('name_ru', 'name_uz')
    prepopulated_fields = {'slug': ('name_ru',)}
    exclude = ('image', 'image_file')
    inlines = [ProductCharacteristicInline, ProductImageInline]
    formfield_overrides = {
        models.DecimalField: {'widget': DecimalTextInput},
    }

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'client_name', 'client_phone', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('client_name', 'client_phone')
    inlines = [OrderItemInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'rating', 'created_at')
    list_filter = ('rating',)

@admin.register(CurrencyRate)
class CurrencyRateAdmin(admin.ModelAdmin):
    list_display = ('id', 'usd_to_uzs', 'updated_at')

