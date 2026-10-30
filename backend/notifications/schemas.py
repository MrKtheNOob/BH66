from datetime import datetime
from uuid import UUID

from ninja import Schema


class NotificationOut(Schema):
    id: UUID
    user_id: UUID
    type: str
    title: str
    message: str
    is_read: bool
    read_at: datetime | None
    metadata: dict
    created_at: datetime


class NotificationMarkReadOut(Schema):
    success: bool
