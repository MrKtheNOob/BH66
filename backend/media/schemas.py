from datetime import datetime
from uuid import UUID

from ninja import Schema


class MeasurementImageOut(Schema):
    id: UUID
    profile_id: UUID
    image_type: str
    image_url: str
    uploaded_at: datetime
