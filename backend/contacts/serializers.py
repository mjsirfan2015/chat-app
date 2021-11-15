import uuid
from rest_framework import serializers

from contacts.models import Contact


from django.contrib.auth.models  import User
class AddContactByEmailSer(serializers.Serializer):
    email=serializers.EmailField()
    def validate(self, attrs):
        email=attrs["email"]
        contact=Contact.objects.filter(contact__email=email,user=self.context["request"].user)
        if contact.exists():raise serializers.ValidationError({"email":serializers.ErrorDetail(code='contact_exists',string=\
        'Contact already added')})
        else:
            contacted = User.objects.filter(email=email)
            if not contacted.exists():raise serializers.ValidationError({"email":serializers.ErrorDetail(code='contact_not_exists',\
                string='Contact Does not Exists')})
            attrs['contact']=contacted[0]
            return attrs
        return attrs
    def create(self,data):
        email,contact=map(data.get,['email','contact'],[None,None])
        user = self.context["request"].user
        #2 mappings needed for contacts
        room = uuid.uuid4()
        contact1 =Contact(user=user,contact=contact,room=room)
        contact1.save()
        contact2 =Contact(user=contact,contact=user,room=room)
        contact2.save()
        return data


class ContactSer(serializers.ModelSerializer):
    image = serializers.ImageField(source="contact.profile.image")
    last_login=serializers.SerializerMethodField()
    get_last_login= lambda self,obj:"%02d:%02d"%(obj.contact.last_login.hour,obj.contact.last_login.minute)\
         if obj.contact.last_login is not None else "online"
    class Meta:
        model = Contact
        fields= ['id','name','room','image','last_login']