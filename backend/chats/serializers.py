from rest_framework import serializers

from chats.models import Chat
class ChatSer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    string = serializers.CharField(source='message')
    name=serializers.CharField(source='contact.user.first_name')
    posted_on=serializers.SerializerMethodField()
    get_posted_on=lambda self,obj:"%02d:%02d"%(obj.posted_on.hour,obj.posted_on.minute)
    def get_type(self,obj):
        user=obj.contact.user
        request=self.context["request"]
        return 0 if  user.id == request.user.id else 1
    class Meta:
        fields=['type','string','name','posted_on']
        model=Chat