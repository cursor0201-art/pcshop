import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Category, Product, Order, Review, TelegramSettings
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer, ReviewSerializer

def send_telegram_notification(order):
    settings = TelegramSettings.objects.filter(is_active=True).first()
    if not settings:
        return

    text = f"🛒 <b>Новый заказ #{order.id}</b>\n\n"
    text += f"👤 <b>Клиент:</b> {order.client_name}\n"
    text += f"📞 <b>Телефон:</b> {order.client_phone}\n\n"
    text += "🛍 <b>Товары:</b>\n"
    
    for idx, item in enumerate(order.items.all(), 1):
        text += f"{idx}. {item.product.name_ru} x {item.quantity} шт. - {item.price} сум\n"
    
    text += f"\n💰 <b>Итого:</b> {order.total_amount} сум\n"
    if order.comment:
        text += f"📝 <b>Комментарий:</b> {order.comment}\n"

    url = f"https://api.telegram.org/bot{settings.bot_token}/sendMessage"
    payload = {
        "chat_id": settings.chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    try:
        requests.post(url, json=payload)
    except Exception as e:
        print(f"Error sending telegram message: {e}")

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.all()
        if self.action in ['list', 'retrieve']:
            queryset = queryset.filter(is_active=True)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        if self.action in ['list', 'retrieve']:
            queryset = queryset.filter(is_active=True, category__is_active=True)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        order = serializer.save()
        send_telegram_notification(order)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
