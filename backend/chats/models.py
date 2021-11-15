from django.db import models
from contacts.models import Contact
# Create your models here.
class Chat(models.Model):
    message=models.CharField(max_length=255)
    type=models.CharField(max_length=1,default="0")
    contact=models.ForeignKey(Contact,on_delete=models.CASCADE)
    read_receipt= models.BooleanField(default=True)
    posted_on = models.DateTimeField(auto_now_add=True)