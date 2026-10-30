from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from users.models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("username", "email", "phone", "is_staff", "is_active", "date_joined")
    list_filter = ("is_staff", "is_superuser", "is_active")
    search_fields = ("username", "first_name", "last_name", "email", "phone")
    ordering = ("username",)

    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Extra info", {"fields": ("phone",)}),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        ("Extra info", {"fields": ("phone",)}),
    )
