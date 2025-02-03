from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.

class Manager(BaseUserManager):
    def create_user(self, email, password, name, **extra_fields):
        if not email:
            raise ValueError('이메일을 입력해주세요')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        password = user.set_password(password)
        user.save(using=self._db)
        
    def create_superuser(self, email, password, name, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self.create_user(self, email, password, name, **extra_fields)
        
        
class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=300, null=False)
    name = models.CharField(max_lenght=128, null=False)
    interest = models.CharField(max_length=128)
    llm_num = models.IntegerField(default = 0)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)