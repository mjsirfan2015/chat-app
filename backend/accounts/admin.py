from django.contrib import admin

from accounts.models import *
# Register your models here.
class ProfileAdmin(admin.ModelAdmin):
    list_display=['id','name','user']
admin.site.register(RequestTable)
admin.site.register(Profile,ProfileAdmin)