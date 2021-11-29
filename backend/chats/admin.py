from django.contrib import admin
from chats.models import *
# Register your models here.
class ChatAdmin(admin.ModelAdmin):
    list_display=['id','message']
admin.site.register(Chat,ChatAdmin)