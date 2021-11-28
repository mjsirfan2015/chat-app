from rest_framework import serializers
import logging
import calendar
from backend.utils import saynth

from chats.models import Chat
class ChatSer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    string = serializers.CharField(source='message')
    name=serializers.CharField(source='contact.user.first_name')
    user_id=serializers.IntegerField(source='contact.user.id')
    profile_pic=serializers.ImageField(source='contact.user.profile.image')
    '''\\date=serializers.SerializerMethodField()
    get_date=lambda self,obj:"%s, %s %s"%(calendar.day_name[obj.posted_on.weekday()],\
        saynth(obj.posted_on.day),calendar.month_name[obj.posted_on.month])
    posted_on=serializers.SerializerMethodField()
    get_posted_on=lambda self,obj:"%02d:%02d"%(obj.posted_on.hour,obj.posted_on.minute)'''
    def get_type(self,obj):
        user=obj.contact.user
        request=self.context["request"]
        return 0 if  user.id == request.user.id else 1

    class Meta:
        fields=['type','user_id','string','name','profile_pic','posted_on']
        model=Chat