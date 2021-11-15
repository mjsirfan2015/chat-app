from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics,mixins
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from backend import settings
from contacts.models import Contact
from contacts.serializers import AddContactByEmailSer, ContactSer
from django.core.mail import send_mail
# Create your views here.
class ContactAddView(generics.CreateAPIView):
    serializer_class=AddContactByEmailSer

class ContactView(generics.ListAPIView,generics.RetrieveDestroyAPIView):
    serializer_class=ContactSer
    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)

@api_view(['POST'])
def send_invite(request):
    invitee= request.data.get('email')
    name,email=request.user.first_name,request.user.email
    s=''
    if name in ['',' ',None]:s=f"{name}({email})"
    else:s=email
    send_mail(f"{s} invited you to join Chat-App",f"{s} invited you to join Chat-App. Click here",settings.EMAIL_HOST_USER,\
        [invitee])
    return Response('Invite sent successfully')

