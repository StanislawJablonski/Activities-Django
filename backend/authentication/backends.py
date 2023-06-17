from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q


UserModel = get_user_model()


class EmailBackend(ModelBackend):
    def authenticate(self, data, **kwargs):
        try:
            user = UserModel.objects.filter(email=data['email']).first()
            if not user: 
                return
        except UserModel.DoesNotExist:
            return
        if user.check_password(data['password']):
            return user