from django.contrib import admin

from media.models import MeasurementImage


@admin.register(MeasurementImage)
class MeasurementImageAdmin(admin.ModelAdmin):
    list_display = ("id", "profile", "image_type", "uploaded_at", "created_at")
    list_filter = ("image_type", "uploaded_at")
    search_fields = ("profile__id", "profile__user__username", "profile__user__email")
    readonly_fields = ("uploaded_at", "created_at", "updated_at")
    autocomplete_fields = ("profile",)
