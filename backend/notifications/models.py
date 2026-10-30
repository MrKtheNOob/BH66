import uuid

from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class NotificationType(models.TextChoices):
    ORDER_CREATED = "order_created", "Order created"
    ORDER_CONFIRMED = "order_confirmed", "Order confirmed"
    ORDER_STATUS_CHANGED = "order_status_changed", "Order status changed"
    DELIVERY_DATE_CHANGED = "delivery_date_changed", "Delivery date changed"
    PROFILE_REVIEWED = "profile_reviewed", "Profile reviewed"


class Notification(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=32, choices=NotificationType.choices)
    title = models.CharField(max_length=160)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
