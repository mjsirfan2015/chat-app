from django.urls import path

from accounts.views import *
urlpatterns = [
   path("", EmailView.as_view(), name=""),
   path("verify",VerifyView.as_view(),name='verify'),
   path("profile/<int:pk>", ProfileView.as_view(), name="profile edit"),
]