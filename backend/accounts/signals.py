from django.dispatch import receiver
from django.db.models.signals import post_save,post_migrate,pre_delete,pre_save
from django.contrib.auth.models import Group,User
from accounts.models import *
from django.db.models import Max
@receiver(post_save,sender=User)
def save_update(sender,instance,**kwargs):
    #create profile instance
    profile = Profile.objects.get_or_create(user=instance)

