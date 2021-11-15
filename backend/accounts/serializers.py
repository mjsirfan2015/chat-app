from rest_framework import serializers
from rest_framework.response import Response
from django.contrib.auth.models import User
from accounts.models import Profile, RequestTable
from pyotp import TOTP,random_base32
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from backend import settings
import uuid
from django.core.mail import send_mail
class EmailSerializer(serializers.Serializer):
    '''
        Generate otp request from email
    '''
    email = serializers.EmailField()
    otp   = serializers.CharField(read_only=True)
    def create(self,data):
        otp=TOTP(random_base32()).now()#generate otp
        #check if already exists
        request = RequestTable.objects.filter(email=data["email"])
        send_mail(f'OTP for chat-app is {otp}',f'OTP for chat-app is {otp}',settings.EMAIL_HOST_USER,[data["email"]])
        if request.exists():
            [r.delete() for r in request]
        request = RequestTable(email=data["email"],otp=otp)
        request.save()
        return request

class VerifySer(serializers.ModelSerializer):
    class Meta:
        fields=["email","otp"]
        model=RequestTable
    
    def validate(self,attrs):
        email,otp=map(attrs.get,["email","otp"],[None,None])
        request=RequestTable.objects.filter(email=email,otp=otp)
        print(email,otp,request)
        if request.exists() and request[0].otp==otp:
            attrs["request"]=request[0]
        else:raise serializers.ValidationError(serializers.ErrorDetail(code='otp_error',string="OTP not valid."))
        return attrs

    def create(self, data):
        email=data["email"]
        #check if user exists
        user = User.objects.filter(email=email)
        if not user.exists():
            user = User.objects.create(email=email,username=uuid.uuid4().hex)
            #authenticate user
        else:user=user[0]
        return data

class ProfileSer(serializers.ModelSerializer):
    name=serializers.CharField()
    class Meta:
        fields=['name','image','user','about']
        model = Profile

    def update(self,instance,data):
        print(data)
        '''instance.name=data.get("name",instance.name)
        instance.save()'''
        data=super().update(instance,data)
        return data