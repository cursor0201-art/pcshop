from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, Order, OrderItem, Review, TelegramSettings, ProductCharacteristic

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductCharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCharacteristic
        fields = ('id', 'name_ru', 'name_uz', 'value_ru', 'value_uz')

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    images = serializers.SerializerMethodField()
    images_detail = serializers.SerializerMethodField()
    characteristics = ProductCharacteristicSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_images(self, obj):
        image_list = []
        if obj.image:
            image_list.append(obj.image)
        elif obj.image_file:
            request = self.context.get('request')
            url = request.build_absolute_uri(obj.image_file.url) if request else obj.image_file.url
            image_list.append(url)

        for img_rel in obj.images_rel.all():
            if img_rel.image:
                if img_rel.image not in image_list:
                    image_list.append(img_rel.image)
            elif img_rel.image_file:
                request = self.context.get('request')
                url = request.build_absolute_uri(img_rel.image_file.url) if request else img_rel.image_file.url
                if url not in image_list:
                    image_list.append(url)
        return image_list

    def get_images_detail(self, obj):
        detail_list = []
        if obj.image:
            detail_list.append({
                'url': obj.image,
                'color_name': None,
                'color_code': None
            })
        elif obj.image_file:
            request = self.context.get('request')
            url = request.build_absolute_uri(obj.image_file.url) if request else obj.image_file.url
            detail_list.append({
                'url': url,
                'color_name': None,
                'color_code': None
            })

        for img_rel in obj.images_rel.all():
            if img_rel.image:
                detail_list.append({
                    'url': img_rel.image,
                    'color_name': img_rel.color_name,
                    'color_code': img_rel.color_code
                })
            elif img_rel.image_file:
                request = self.context.get('request')
                url = request.build_absolute_uri(img_rel.image_file.url) if request else img_rel.image_file.url
                detail_list.append({
                    'url': url,
                    'color_name': img_rel.color_name,
                    'color_code': img_rel.color_code
                })
        return detail_list

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name_ru')

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'quantity', 'price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'client_name', 'client_phone', 'total_amount', 'comment', 'status', 'created_at', 'items')

    def create(self, validated_data):
        from django.db import transaction
        items_data = validated_data.pop('items')
        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            for item_data in items_data:
                OrderItem.objects.create(order=order, **item_data)
        return order

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Review
        fields = ('id', 'user', 'username', 'product', 'rating', 'comment', 'created_at')
        read_only_fields = ('user',)
