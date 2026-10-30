from __future__ import annotations

from uuid import UUID

from django.shortcuts import get_object_or_404
from django.utils import timezone
from ninja import Router
from ninja.errors import HttpError

from core.auth import JWTAuth
from notifications.models import Notification
from notifications.schemas import NotificationMarkReadOut, NotificationOut

router = Router(auth=JWTAuth())


@router.get("", response=list[NotificationOut])
def list_notifications(request):
    qs = Notification.objects.all() if request.auth.is_staff else Notification.objects.filter(user_id=request.auth.id)
    return list(qs.order_by("-created_at"))


@router.patch("/{notification_id}/read", response=NotificationMarkReadOut)
def mark_notification_read(request, notification_id: UUID):
    notification = get_object_or_404(Notification, id=notification_id)
    if not request.auth.is_staff and notification.user_id != request.auth.id:
        raise HttpError(403, "forbidden")
    notification.is_read = True
    notification.read_at = timezone.now()
    notification.save(update_fields=["is_read", "read_at", "updated_at"])
    return NotificationMarkReadOut(success=True)
