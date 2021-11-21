from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from backend import settings
from rest_framework.response import Response
from django.http import HttpResponse
import rest_framework

class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = None#self.get_header(request)
        
        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None,None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token

def HeaderMiddleWare(get_response):
    # One-time configuration and initialization.

    def middleware(request):
        request._force_auth_user,request._force_auth_token=CustomAuthentication().authenticate(request)
        response = get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    return middleware

def deflate(data):
    error_codes,error_msg={},{}
    for key in data:
        if type(data[key]) == list and len(data[key])>0:# if list first value taken
            value = data[key][0]
        else:value=data[key]

        if type(value)!=rest_framework.exceptions.ErrorDetail:continue#return None,None

        error_codes[key],error_msg[key]=value.code,value
    return error_codes,error_msg



class RequestLogMiddleWare(object):
    def __init__(self, get_response):
       self.get_response = get_response

    def __call__(self, request):
       response = self.get_response(request)
       return response

    def process_template_response(self, request, response):
        if hasattr(response, 'data'):
            if response.status_code in range(200,300):#success
                response.data,data={},response.data
                response.data['data']=data 
                response.data['error_info']=None
                response.data['success']=True
            else:
                response.data,data={},response.data
                #pop serializer errors
                response.data['error_codes'],response.data['error_msg']={},{}
                if type(data)==rest_framework.utils.serializer_helpers.ReturnDict:
                    
                    data_ser = data
                    response.data['error_codes'],response.data['error_msg']=deflate(data_ser)
                response.data['error_info_extra']=data
                response.data['success']=False
                response.data['data']=None
        return response