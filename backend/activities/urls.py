from django.urls import path
from django.urls.conf import path, include
from .api import ActivityAPI, PraticipationAPI, NotificationAPI, ActivityViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('activitybybusinessid', ActivityViewSet, basename='activitybyid')

urlpatterns = [
    path('api/activity', ActivityAPI.as_view()),
    path('api/participation', PraticipationAPI.as_view()),
    path('api/notification', NotificationAPI.as_view()),
    path('api/', include(router.urls)),
]
