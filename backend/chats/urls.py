from django.urls import path

from chats.views import ChatView

urlpatterns = [
    path("", ChatView.as_view(), name="")
]
