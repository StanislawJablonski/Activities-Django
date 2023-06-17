from rest_framework import generics, permissions, serializers, viewsets
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework.utils import serializer_helpers
from .serializers import AcitivitySerializer, PraticipationSerializer
from .models import *
from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth.models import User
from knox.auth import TokenAuthentication
import datetime
from django.utils.encoding import force_text
import random
import string
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q

class ActivityAPI(generics.GenericAPIView):
    serializer_class = AcitivitySerializer

    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = get_user_model().objects.filter(id = request.user.id).first()
        business = Business.objects.filter(user = request.user.id).first()
        if request.query_params.get('start', None) is not None and request.query_params.get('end', None) is not None:
            activiteisQuery = Activity.objects.filter(date__range=(request.query_params['start'], request.query_params['end']))

        if request.query_params.get('start', None) is not None and request.query_params.get('end', None) is None:
            activiteisQuery = Activity.objects.filter(date__gte=request.query_params['start'])

        if request.query_params.get('end', None) is not None and request.query_params.get('start', None) is None:
            activiteisQuery = Activity.objects.filter(date__lte=request.query_params['end'])
        if(business):
            activiteis = activiteisQuery.filter(business_id = business.id).all()
        else:
            praticipations = Praticipation.objects.filter(user_id=user.id).all()
            activiteis = []
            for praticipation in praticipations:
                activities = activiteisQuery.filter(Q(id = praticipation.activity_id) | Q(base_activity = praticipation.activity_id)).all()
                if(activities):
                    for activity in activities:
                        activiteis.append(activity)
        return Response(AcitivitySerializer(activiteis, many=True).data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        business = Business.objects.filter(user = request.user.id).first()
        data = request.data
        data['business'] = business.id
        data['end_time'] = request.data['endtime']
        data['start_time'] = request.data['starttime']
        data['name'] = request.data['activityname']
        serializer = self.get_serializer(data = data)
        serializer.is_valid(raise_exception = True)
        activity = serializer.save()
        date = datetime.datetime.strptime(request.data['date'], "%Y-%m-%d")
        if request.data['periodicity'] != 'Brak':
            for _ in range(int(request.data['amount']) - 1):
                date = self.addDays(date, request.data['periodicity'])
                Activity.objects.create(
                    business=business, 
                    end_time=data['end_time'], 
                    start_time=data['start_time'], 
                    name=data['name'], 
                    leader=data['leader'], 
                    date = date,
                    base_activity = activity.id
                )
        # if request.data['isBusiness']:
        #   Business.objects.create(user=user, category = request.data['category'])
        return Response(AcitivitySerializer(activity).data, status=status.HTTP_204_NO_CONTENT)

    def addDays(self, date, periodicy):
        if periodicy == 'Co miesiąc':
            return date + datetime.timedelta(months=1)
        if periodicy == 'Codziennie':
            return date + datetime.timedelta(days=1)
        if periodicy == 'Co tydzień':
            return date + datetime.timedelta(days=7)
        if periodicy == 'Co dwa tygodnie':
            return date + datetime.timedelta(days=14)


class PraticipationAPI(generics.GenericAPIView):
    serializer_class = PraticipationSerializer

    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        activity = Activity.objects.filter(id = request.data['activityId']).first()
        data = request.data
        data['activity'] = activity.id
        data['user'] = request.user.id
        serializer = self.get_serializer(data = data)
        serializer.is_valid(raise_exception = True)
        participation = serializer.save()
        return Response(PraticipationSerializer(participation).data, status=status.HTTP_204_NO_CONTENT)

class NotificationAPI(generics.GenericAPIView):
    serializer_class = PraticipationSerializer

    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if request.data['role'] == 'business':
            participations = Praticipation.objects.filter(activity_id = request.data['activity']['id']).all()
            if(len(participations) == 0):
                participations = Praticipation.objects.filter(activity_id = request.data['activity']['base_activity']).all()

            for participation in participations:
                subject = force_text('Wiadomość odnośnie zajęć: ' + request.data['activity']['name'])
                from_mail = force_text('projekt@pz.pl')
                reciver = get_user_model().objects.filter(id = participation.user_id).first()
                sender = get_user_model().objects.filter(id = request.data['id']).first()
                message = render_to_string('mail/notify.html', {
                    'sender': sender,
                    'reciver': reciver,
                    'message': request.data['message']
                })
                email = EmailMultiAlternatives( subject, message, from_mail, [reciver.email])
                email.mixed_subtype = 'related'
                email.attach_alternative(message, "text/html")
                email.send()
        else :
            subject = force_text('Wiadomość odnośnie zajęć: ' + request.data['activity']['name'])
            from_mail = force_text('projekt@pz.pl')
            business = Business.objects.filter(id = request.data['activity']['business']).first()
            reciver = get_user_model().objects.filter(id = business.user_id).first()
            sender = get_user_model().objects.filter(id = request.data['id']).first()
            message = render_to_string('mail/notify.html', {
                'sender': sender,
                'reciver': reciver,
                'message': request.data['message']
            })
            email = EmailMultiAlternatives( subject, message, from_mail, [reciver.email])
            email.mixed_subtype = 'related'
            email.attach_alternative(message, "text/html")
            email.send()
        return Response({}, status=status.HTTP_204_NO_CONTENT)


class ActivityViewSet(viewsets.ModelViewSet):

    authentication_classes = []
    permission_classes = []

    serializer_class = AcitivitySerializer

    default_serializer_class = AcitivitySerializer
    
    def get_queryset(self):
        id = self.request.query_params.get('businessId')
        activities = Activity.objects.filter(business_id = id, base_activity = None)
        serializer = AcitivitySerializer(activities, many=True)
        return activities
