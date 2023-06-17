from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from Authentication.models import Business
from django.contrib.auth import get_user_model

class Activity(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    leader = models.CharField(max_length=200)
    base_activity = models.IntegerField(blank=True, null=True)


    def __str__(self):
        return self.name

    def publish(self):
        self.save()
        
    class Meta:
        ordering = ('business',)

class Praticipation(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    presence = models.BooleanField(blank=True, null=True)


