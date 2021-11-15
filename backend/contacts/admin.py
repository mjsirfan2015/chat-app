from django.contrib import admin

from contacts.models import Contact

# Register your models here.
class ContactAdmin(admin.ModelAdmin):
    list_display=['id','user','contact','name','room']

admin.site.register(Contact,ContactAdmin)