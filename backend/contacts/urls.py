from contacts.views import *


from django.urls import path
urlpatterns = [
    path("add", ContactAddView.as_view(), name="add contact"),
    path("", ContactView.as_view(), name="contact"),
    path("invite", send_invite, name=""),

]
