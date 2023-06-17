from django.urls import path
from django.urls.conf import path, include
from .api import RegisterAPI, LoginAPI, UserAPI, UsersActivationAccountViewSet, PasswordResetAPI, BusinessViewSet, DataChangeAPI, EmailChangeAPI, isAuthenticated
from knox import views as knox_views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('business', BusinessViewSet, basename='Business')

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/passwordchange', PasswordResetAPI.as_view()),
    path('api/auth/isauthenticated', isAuthenticated.as_view()),
    path('api/auth/datachange', DataChangeAPI.as_view()),
    path('api/auth/emailchange', EmailChangeAPI.as_view()),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/logout',knox_views.LogoutView.as_view(), name='knox_logout'),
    path('api/auth/users-activation/', UsersActivationAccountViewSet.as_view()),
    path('api/', include(router.urls)),
]
