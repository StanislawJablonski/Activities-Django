from rest_framework import generics, permissions, serializers, viewsets
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework.utils import serializer_helpers
from .serializers import LoginSerializer, UserSerializer, RegisterSerializer, UsersActivatedSerializer, BusinessSerializer, BusinessUserSerializer
from .models import *
from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth.models import User
from django.utils.encoding import force_text
import random
import string
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.auth import TokenAuthentication


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        user = serializer.save()
        if request.data['isBusiness']:
          Business.objects.create(user=user, category = request.data['category'])
        return Response({
            "user": UserSerializer(user, context = self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context = self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class PasswordResetAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        if user:
            user = get_user_model().objects.get(email=request.data['email'])
            user.set_password(request.data['newPassword'])
            user.save()
        return Response({
            "user": UserSerializer(user, context = self.get_serializer_context()).data,
        })


class DataChangeAPI(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        user = get_user_model().objects.get(email=request.data['email'])
        if user:
            business = Business.objects.filter(user_id=user.id)
            if business:
                business[0].category = request.data['category'] if request.data.__contains__('category') else business[0].category
                business[0].save()
            user.username = request.data['username'] if request.data.__contains__('username') else user.username
            user.first_name = request.data['first_name'] if request.data.__contains__('first_name') else user.first_name
            user.last_name = request.data['last_name'] if request.data.__contains__('last_name') else user.last_name
            user.phone = request.data['phone'] if request.data.__contains__('phone') else user.phone
            user.save()
        return Response({
            "user": UserSerializer(user, context = self.get_serializer_context()).data,
        })

class EmailChangeAPI(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        user = get_user_model().objects.get(email=request.data['email'])
        try:
            usercheck = get_user_model().objects.get(email=request.data['newEmail'])
        except get_user_model().DoesNotExist:
            usercheck = None
        if user and not usercheck:
            user.email = request.data['newEmail'] if request.data.__contains__('newEmail') else user.email
            user.is_active = False
            user.save()
            generated_activate_key_size = 64
            generated_activate_key_chars = string.ascii_letters + string.digits
            generated_activate_key = ''.join(random.choice(generated_activate_key_chars) for _ in range(generated_activate_key_size))
            UserActivate.objects.create(user_id=user,activate_code=generated_activate_key)
            subject = force_text('Zmiana maila w serwisie PZ-2')
            from_mail = force_text('projekt@pz.pl')
            message = render_to_string('mail/changeEmail.html', {
                'user': user,
                'activate_link': 'http://localhost:3000/auth/activate/' + generated_activate_key
            })
            email = EmailMultiAlternatives( subject, message, from_mail, [user.email])
            email.mixed_subtype = 'related'
            email.attach_alternative(message, "text/html")
            email.send()
            return Response({
                "user": UserSerializer(user, context = self.get_serializer_context()).data,
            })
        else:
            return Response({'message': 'Mail jest już zajęty'}, status=status.HTTP_204_NO_CONTENT)


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated,]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UsersActivationAccountViewSet(generics.RetrieveAPIView):

    authentication_classes = []
    permission_classes = []

    serializer_class = UsersActivatedSerializer

    default_serializer_class = UsersActivatedSerializer
    
    def get_object(self):
        activation = UserActivate.objects.filter(activate_code=self.request.query_params.get('code'))
        user = get_user_model().objects.none()
        if(activation):
            user = [a.user_id for a in activation]
            # Aktywujemy konto użytkownika
            user[0].is_active = True
            user[0].save()
            # Usuwamy kod aktywacyjny
            activation.delete()
            return user
        else:
            return Response({'message': '{} Konto zostało już aktywowane'}, status=status.HTTP_204_NO_CONTENT)

class BusinessViewSet(viewsets.ModelViewSet):

    authentication_classes = []
    permission_classes = []

    serializer_class = BusinessUserSerializer

    default_serializer_class = BusinessUserSerializer
    
    def get_queryset(self):
        User = get_user_model()
        users = User.objects.filter(role = "business")
        users = UserSerializer(users, many=True)

        for user in users.data:
            bussines = Business.objects.filter(user_id = user["id"]).first()
            if bussines:
                bussinesSerializer = BusinessSerializer(bussines)
                user["id"] = bussinesSerializer.data["id"]
        return users.data


class isAuthenticated(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        
        return Response({
            "is_authenticated": True,
        })
