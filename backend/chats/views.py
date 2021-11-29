from django.shortcuts import render
from rest_framework.response import Response
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
import logging
from datetime import datetime
from decouple import config

async_mode = None
logging.basicConfig(level = logging.DEBUG)

import socketio

sio = socketio.Server(async_mode=async_mode,cors_allowed_origins='*')


class ChatView(mixins.ListModelMixin,generics.DestroyAPIView,generics.UpdateAPIView):
    serializer_class=ChatSer
    def get(self, request):
        datas = self.list(request).data
        '''chats={}
        first_data=None
        for data in range(len(datas)):
            if first_data is not None:
                if datas[first_data]["user_id"]==datas[data]["user_id"] and\
                    datas[first_data]["date"]==datas[data]["date"]:
                    datas[first_data]["string"]+=[datas[first_data]["string"]]
                else:
                    first_data=None
        for data in datas:
            date=data["date"]
            if chats.get(date,None)is None:chats[date]=[]
            data.pop("date")
            chats[date]+=[data]
            
        chats=[{"date":date,"chats":chats[date]} for  date in chats]'''
        return Response(datas)

    def get_queryset(self):
        return Chat.objects.filter(contact__room=self.request.GET.get("room")).order_by('posted_on')
    
# Create your views here.
@sio.event
def message(sid, message):
    logging.debug(sid)
    logging.debug(message)
    sio.emit('response',f"{message.get('name',None)}: {message.get('message',None)}")

class MyCustomNamespace(socketio.Namespace):
    def on_connect(self, sid, environ):
        logging.debug('Connectedxx')
        #sio.emit('response',"connected,y'all!",namespace='/test')

    def on_disconnect(self, sid):
        logging.debug('DisConnectedxx')
        sio.disconnect(sid)

    def on_begin_chat(self,sid,room):
        sio.enter_room(sid,room,namespace='/test')
        sio.emit(sid,"Entered room!")

    def on_exit_chat(self,sid,room):
            sio.leave_room(sid,room,namespace='/test')


    #@sio.event(namespace='/test')
    def on_message(self,sid, message):
        logging.debug(sid)
        logging.debug(message)
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
        logging.debug('Connectedxx')
        #sio.emit('response',"connected,y'all!",namespace='/chat')

    def on_disconnect(self, sid):
        logging.debug('DisConnectedxx')
        sio.disconnect(sid)

    def on_begin_chat(self,sid,room,key):
        logging.debug(key)
        logging.debug("BeginningChat 1....")
        #decode key
        user = self.decode(key,sid)
        logging.debug(room)
        self.verify_contact(room,sid)
        logging.debug("BeginningChat 2....")
        logging.debug("room: ",room)
        logging.debug(user)

        sio.enter_room(sid,room,namespace='/chat')
        sio.emit(sid,"Entered room!")

    def on_exit_chat(self,sid,room):
            sio.leave_room(sid,room,namespace='/chat')


    #@sio.event(namespace='/test')
    def on_message(self,sid, message):
        logging.debug(message)
        user = self.decode(message["token"],sid)
        user1=User.objects.get(id=user["user_id"])
        
        self.verify_contact(message["id"],sid)
        contact =  Contact.objects.filter(room=message["id"],user=user["user_id"])[0]
        m={"id":user["user_id"],"message":message["message"],"posted_on":str(datetime.now()),"name":user1.first_name,\
            "user_id":user1.id,"profile_pic":f"{config('BASE_URL','')}{user1.profile.image.url}" if\
                user1.profile.image is not None else None }
        print(m)
        #add chat to model
        Chat.objects.create(contact=contact,message=message["message"])
        sio.emit('response',json.dumps(m),\
            namespace='/chat',room=message["id"])

sio.register_namespace(ChatNamespace('/chat'))