from django.contrib import admin
from .models import Category, Product, ProductCharacteristic, Order, OrderItem, Review, ProductImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_ru', 'name_uz', 'created_at')
    search_fields = ('name_ru', 'name_uz')
    prepopulated_fields = {'slug': ('name_ru',)}

class ProductCharacteristicInline(admin.TabularInline):
    model = ProductCharacteristic
    extra = 1

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_ru', 'name_uz', 'price', 'stock', 'category')
    list_filter = ('category',)
    search_fields = ('name_ru', 'name_uz')
    prepopulated_fields = {'slug': ('name_ru',)}
    exclude = ('image', 'image_file')
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
