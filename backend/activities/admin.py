from django.contrib import admin
from .models import Activity, Praticipation


class ActivityAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Info', {'fields': ('name',)}),
        ('Date', {'fields': ('date', 'start_time', 'end_time')}),
        ('Leader', {'fields': ('leader',)}),
        ('Details', {'fields': ('base_activity', 'business')}),
    ]

    list_filter = (
        ('date', admin.DateFieldListFilter),
        'leader',
        'base_activity',
        'business'
    )

    list_display = ('name', 'date', 'leader', 'base_activity', 'business')


class ParticipationtAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Info', {'fields': ('user', 'activity', 'presence')}),
    ]

    list_filter = list_display = ('user', 'activity', 'presence')


admin.site.register(Activity, ActivityAdmin)
admin.site.register(Praticipation, ParticipationtAdmin)
