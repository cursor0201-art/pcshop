from django.apps import AppConfig
from django.db.models.signals import post_migrate

def create_default_superuser(sender, **kwargs):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        if not User.objects.filter(username='pcshop').exists():
            User.objects.create_superuser('pcshop', 'admin@storepcshop.uz', 'futuree201112332')
            print("Default superuser 'pcshop' created successfully!")
    except Exception as e:
        print("Failed to create default superuser:", e)

class ShopConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shop'
    verbose_name = 'Управление магазином'

    def ready(self):
        post_migrate.connect(create_default_superuser, sender=self)
