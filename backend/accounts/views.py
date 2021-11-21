from django.http.response import Http404
from django.shortcuts import render
from rest_framework import generics, mixins, response,views
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import Profile
from rest_framework.parsers import FormParser, JSONParser,MultiPartParser
import logging
#from rest_framework.decorators import apiview
from accounts.serializers import *
# Create your views here
from backend import settings


class EmailView(generics.CreateAPIView):
    permission_classes=[AllowAny,]
    serializer_class=EmailSerializer

class VerifyView(generics.GenericAPIView,mixins.CreateModelMixin):
    permission_classes=[AllowAny]
    serializer_class=VerifySer
    
    def post(self,request):
        response = self.create(request)
        refresh=RefreshToken.for_user(User.objects.get(email=response.data["email"]))# get jwt tokens
        tokens={
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        response.set_cookie(
                key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                value = tokens["access"],
                expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                httponly = True,
            )
        return response

    def get(self,request):
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
        if raw_token is None:
            return Response({'success':False})
        else:return Response({"success":True,"token":raw_token,"user_id":request.user.id,**ProfileSer(
            Profile.objects.get(user=request.user),context={'request':request}
        ).data})

class ProfileView(generics.GenericAPIView,mixins.UpdateModelMixin):
    serializer_class=ProfileSer
    parser_classes=[JSONParser,MultiPartParser,FormParser]
    def get_queryset(self):
        print(Profile.objects.filter(user=self.request.user))
        return Profile.objects.filter(user=self.request.user)
    
    def get_object(self):
        item=self.get_queryset()
        if item.exists():return item[0]
        else:raise Http404()
    
    def put(self,request,pk):
        return self.partial_update(request,pk)
        
    