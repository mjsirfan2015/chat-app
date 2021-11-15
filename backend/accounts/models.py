from os import name
from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class RequestTable(models.Model):
    email = models.EmailField()
    otp   = models.CharField(max_length=6)
    created_on=models.DateTimeField(auto_now=True)

class Profile(models.Model):
    user= models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile')
    about=models.CharField(max_length=250,blank=True)
    image=models.ImageField(null=True,blank=True)

    @property
    def name(self):
        return self.user.first_name
    
    @name.setter
    def name(self,value):
        print("hello")
        user=self.user
        user.first_name=value
        user.save()