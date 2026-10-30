from django.contrib import admin

from notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "title", "is_read", "read_at", "created_at")
    list_filter = ("type", "is_read", "created_at")
    search_fields = ("title", "message", "user__username", "user__email")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")
