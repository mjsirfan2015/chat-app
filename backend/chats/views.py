from django.shortcuts import render
from socketio import namespace
import json
import jwt
from backend import settings
import uuid
from django.contrib.auth.models import User
from chats.models import Chat
from chats.serializers import ChatSer
from contacts.models import Contact
from rest_framework import generics,mixins
async_mode = None


import socketio

sio = socketio.Server(async_mode=async_mode,cors_allowed_origins='*')


class ChatView(generics.ListAPIView,generics.DestroyAPIView,generics.UpdateAPIView):
    serializer_class=ChatSer
    def get_queryset(self):
        return Chat.objects.filter(contact__room=self.request.GET.get("room")).order_by('posted_on')
    
# Create your views here.
@sio.event
def message(sid, message):
    print(sid)
    print(message)
    sio.emit('response',f"{message.get('name',None)}: {message.get('message',None)}")

class MyCustomNamespace(socketio.Namespace):
    def on_connect(self, sid, environ):
        print('Connectedxx')
        #sio.emit('response',"connected,y'all!",namespace='/test')

    def on_disconnect(self, sid):
        print('DisConnectedxx')
        sio.disconnect(sid)

    def on_begin_chat(self,sid,room):
        sio.enter_room(sid,room,namespace='/test')
        sio.emit(sid,"Entered room!")

    def on_exit_chat(self,sid,room):
            sio.leave_room(sid,room,namespace='/test')


    #@sio.event(namespace='/test')
    def on_message(self,sid, message):
        print(sid)
        print(message)
        sio.emit('response',f"{message.get('name',None)}: {message.get('message',None)}",namespace='/test',room=message["room"])

#



class ChatNamespace(socketio.Namespace):
    def decode(self,key,sid):
        try:
            user=jwt.decode(key,settings.SECRET_KEY,algorithms=["HS256"])
            return user
        except jwt.exceptions.DecodeError:
            sio.emit("error","Invalid jwt token",namespace='/chat')
            sio.disconnect(sid)
        return None

    def verify_contact(self,room,sid):
        '''Decode uuid contact room info'''
        try:
            room=uuid.UUID(room)
            if not Contact.objects.filter(room=room).exists():
                sio.emit("error","Invalid contact",namespace='/chat')
                sio.disconnect(sid)
        except:
            sio.emit("error","Invalid contact id",namespace='/chat')
            sio.disconnect(sid)

    def on_connect(self, sid, environ):
        print('Connectedxx')
        #sio.emit('response',"connected,y'all!",namespace='/chat')

    def on_disconnect(self, sid):
        print('DisConnectedxx')
        sio.disconnect(sid)

    def on_begin_chat(self,sid,room,key):
        print(key)
        print("BeginningChat 1....")
        #decode key
        user = self.decode(key,sid)
        print(room)
        self.verify_contact(room,sid)
        print("BeginningChat 2....")
        print("room: ",room)
        print(user)

        sio.enter_room(sid,room,namespace='/chat')
        sio.emit(sid,"Entered room!")

    def on_exit_chat(self,sid,room):
            sio.leave_room(sid,room,namespace='/chat')


    #@sio.event(namespace='/test')
    def on_message(self,sid, message):
        print(message)
        user = self.decode(message["token"],sid)
        m={"id":user["user_id"],"message":message["message"]}
        self.verify_contact(message["id"],sid)
        contact =  Contact.objects.filter(room=message["id"],user=user['user_id'])[0]
        #add chat to model
        Chat.objects.create(contact=contact,message=message["message"])
        sio.emit('response',json.dumps(m),\
            namespace='/chat',room=message["id"])

sio.register_namespace(MyCustomNamespace('/test'))
sio.register_namespace(ChatNamespace('/chat'))