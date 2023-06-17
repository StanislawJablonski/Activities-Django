from rest_framework import serializers
from .models import Activity, Praticipation

class AcitivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'business', 'name', 'date', 'start_time', 'end_time', 'leader', 'base_activity')

class PraticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Praticipation
        fields = ('id', 'user', 'activity', 'presence')

