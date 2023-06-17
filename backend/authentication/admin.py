from django.contrib import admin
from .models import CustomUser, Business


class CustomUserAdmin(admin.ModelAdmin):
    fieldsets = [
        ('User', {'fields': ('email', 'username', 'first_name', 'last_name')}),
        ('Detail', {'fields': ('role', 'phone', 'is_staff', 'is_active')}),
    ]

    list_filter = list_display = ('email', 'role')


class BusinessAdmin(admin.ModelAdmin):
    fieldsets = [
        ('User', {'fields': ('user',)}),
        ('Category', {'fields': ('category',)}),
    ]

    list_filter = list_display = ('user', 'category')


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Business, BusinessAdmin)
