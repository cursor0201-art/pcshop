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

from django import forms

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            'price': DecimalTextInput(attrs={'placeholder': 'UZS'}),
            'price_usd': DecimalTextInput(attrs={'placeholder': 'USD'}),
            'old_price': DecimalTextInput(attrs={'placeholder': 'UZS'}),
            'old_price_usd': DecimalTextInput(attrs={'placeholder': 'USD'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in ['price', 'price_usd', 'old_price', 'old_price_usd']:
            val = self.initial.get(field)
            if val is not None:
                try:
                    if float(val) == 0.0:
                        self.initial[field] = ''
                except (ValueError, TypeError):
                    pass

class HasDiscountFilter(admin.SimpleListFilter):
    title = 'Скидка'
    parameter_name = 'has_discount'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Со скидкой'),
            ('no', 'Без скидки'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(old_price__gt=models.F('price'))
        if self.value() == 'no':
            return queryset.filter(models.Q(old_price__isnull=True) | models.Q(old_price__lte=models.F('price')))
        return queryset

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductForm
    list_display = ('id', 'name_ru', 'price', 'old_price', 'is_new', 'is_featured', 'is_weekly_offer', 'stock', 'is_active', 'category')
    list_editable = ('price', 'old_price', 'is_active', 'is_new', 'is_featured', 'is_weekly_offer')
    list_filter = ('category', HasDiscountFilter, 'is_active', 'is_new', 'is_featured', 'is_weekly_offer')
    search_fields = ('name_ru', 'name_uz')
    prepopulated_fields = {'slug': ('name_ru',)}
    inlines = [ProductCharacteristicInline, ProductImageInline]

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

