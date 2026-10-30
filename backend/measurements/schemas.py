from datetime import datetime
from typing import Literal
from uuid import UUID

from ninja import Schema


class ProfileCreateIn(Schema):
    user_id: UUID
    height_cm: float


class MeasurementFieldIn(Schema):
    value: float | None = None
    confidence: float | None = None
    source: Literal["ai", "manual", "admin"] | None = None


class MeasurementsUpdateIn(Schema):
    shoulder_width: MeasurementFieldIn | None = None
    sleeve_length: MeasurementFieldIn | None = None
    chest: MeasurementFieldIn | None = None
    waist: MeasurementFieldIn | None = None
    hips: MeasurementFieldIn | None = None
    thigh: MeasurementFieldIn | None = None
    neck: MeasurementFieldIn | None = None
    boubou_length: MeasurementFieldIn | None = None
    fond: MeasurementFieldIn | None = None


class MeasurementFieldOut(Schema):
    value: float | None = None
    confidence: float | None = None
    source: str | None = None


class MeasurementValuesOut(Schema):
    shoulder_width: MeasurementFieldOut
    sleeve_length: MeasurementFieldOut
    chest: MeasurementFieldOut
    waist: MeasurementFieldOut
    hips: MeasurementFieldOut
    thigh: MeasurementFieldOut
    neck: MeasurementFieldOut
    boubou_length: MeasurementFieldOut
    fond: MeasurementFieldOut


class MeasurementImageOut(Schema):
    id: UUID
    image_type: str
    image_url: str
    uploaded_at: datetime


class ValidationOut(Schema):
    valid: bool
    reasons: list[str]
    quality_metrics: dict


class ProfileOut(Schema):
    id: UUID
    user_id: UUID
    height_cm: float
    status: str
    created_at: datetime
    updated_at: datetime
    images: list[MeasurementImageOut]
    measurements: MeasurementValuesOut


class ProfileListItemOut(Schema):
    id: UUID
    user_id: UUID
    height_cm: float
    status: str
    created_at: datetime
    updated_at: datetime
