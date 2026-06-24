from django.apps import AppConfig
from django.db.models.signals import post_migrate

def create_default_superuser(sender, **kwargs):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user, created = User.objects.get_or_create(
            username='pcshop',
            defaults={'email': 'admin@storepcshop.uz', 'is_staff': True, 'is_superuser': True}
        )
        user.set_password('pcshop')
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print("Default superuser 'pcshop' configured with password 'pcshop' successfully!")
    except Exception as e:
        print("Failed to configure default superuser:", e)

class ShopConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shop'
    verbose_name = 'Управление магазином'

    def ready(self):
        post_migrate.connect(create_default_superuser, sender=self)
