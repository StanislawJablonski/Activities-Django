from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class CustomAccountManager(BaseUserManager):
    def create_superuser(self, email, username, first_name, last_name, password, role, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.')
        return self.create_user(email, username, first_name, last_name, password, role **other_fields)
    
    def create_user(self, email, username, first_name, last_name, password, role, **other_fields):
        if not email:
            raise ValueError(_('You must provide an email address'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username,
                          first_name=first_name, last_name=last_name, role = role,
                          **other_fields)
        user.set_password(password)
        user.save()
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    role = models.CharField(max_length=150, null=True)
    phone = models.CharField(max_length=17, blank=True, null=True) 
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    objects = CustomAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'password']


    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

class UserActivate(models.Model):
    user_id = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    activate_code = models.CharField(max_length=64)
    
    def __str__(self):
        return self.activate_code

    class Meta:
        verbose_name = "UserActivate"
        verbose_name_plural = "UserActivations"

class Business(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    category = models.CharField(max_length=200)

    def __str__(self):
        return self.user.username

    def publish(self):
        self.save()
        
class Leader(models.Model):
    business_id = models.ForeignKey('Business', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    specialization = models.CharField(max_length = 20,default=True)

    def __str__(self):
        return self.first_name +" "+ self.last_name

    def publish(self):
        self.save()
