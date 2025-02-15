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
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self.create_user(email, password, name, **extra_fields)
        
        
class User(AbstractBaseUser):
    objects = Manager()
    
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=300, null=False)
    name = models.CharField(max_length=128, null=False)
    interest = models.CharField(max_length=128, blank=True, null=True)
    llm_num = models.IntegerField(default = 0)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password', 'name']
    
    class Meta:
        db_table = 'gpteacher_account_app_user'
        
    def has_module_perms(self, app_label):
        return self.is_staff
    
    def has_perm(self, perm, obj=None):
        return self.is_staff