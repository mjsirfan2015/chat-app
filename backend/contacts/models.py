from django.db import models
from django.contrib.auth.models import User
import uuid
# Create your models here.

class Contact(models.Model):
    '''stores your contacts list'''
    user =models.ForeignKey(User,on_delete=models.CASCADE,related_name='users')
    contact=models.ForeignKey(User,on_delete=models.CASCADE,related_name='contacts')
    room=models.UUIDField()

    @property
    def name(self):
        return self.contact.first_name