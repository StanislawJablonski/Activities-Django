from django.db.models import fields
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from . import models
from django.utils.encoding import force_text
import random
import string

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'password', 'role', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
      username = validated_data['username'] if 'username' in validated_data else None
      first_name = validated_data['first_name'] if 'first_name' in validated_data else None
      last_name = validated_data['last_name'] if 'last_name' in validated_data else None
      user = models.CustomUser.objects.create_user(
        validated_data['email'], 
        username, 
        first_name, 
        last_name, 
        validated_data['password'], 
        validated_data['role']
        )
      generated_activate_key_size = 64
      generated_activate_key_chars = string.ascii_letters + string.digits
      generated_activate_key = ''.join(random.choice(generated_activate_key_chars) for _ in range(generated_activate_key_size))
      models.UserActivate.objects.create(user_id=user,activate_code=generated_activate_key)
      subject = force_text('Aktywacja konta w serwisie PZ-2')
      from_mail = force_text('projekt@pz.pl')
      message = render_to_string('mail/activate.html', {
          'user': user,
          'activate_link': 'http://localhost:3000/auth/activate/' + generated_activate_key
      })
      email = EmailMultiAlternatives( subject, message, from_mail, [user.email])
      email.mixed_subtype = 'related'
      email.attach_alternative(message, "text/html")
      email.send()
      return user

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(data)
        if user :
            if user.is_active:  
                return user  
            raise serializers.ValidationError("Konto nie zostało aktywowane")
        raise serializers.ValidationError("Błędny login lub hasło") 

class UsersActivatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['is_active']

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Business
        fields = ('id', 'category', 'user')

class BusinessUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField() 
    class Meta:
        model = models.Business
        fields = ('id', 'username')

