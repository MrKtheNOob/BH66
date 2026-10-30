from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from ninja import Schema


class PromotionIn(Schema):
    label: str
    percentage: Decimal
    active: bool = True
    starts_at: datetime | None = None
    ends_at: datetime | None = None


class PromotionPatchIn(Schema):
    label: str | None = None
    percentage: Decimal | None = None
    active: bool | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None


class PromotionOut(Schema):
    id: UUID
    label: str
    percentage: Decimal
    active: bool
    starts_at: datetime | None
    ends_at: datetime | None
    created_at: datetime
    updated_at: datetime


class TailorModelIn(Schema):
    title: str
    category: str
    base_price: Decimal
    promotion_id: UUID | None = None
    is_active: bool = True


class TailorModelPatchIn(Schema):
    title: str | None = None
    category: str | None = None
    base_price: Decimal | None = None
    promotion_id: UUID | None = None
    is_active: bool | None = None


class TailorModelOut(Schema):
    id: UUID
    title: str
    image_url: str | None = None
    category: str
    base_price: Decimal
    is_active: bool
    promotion_id: UUID | None
    created_at: datetime
    updated_at: datetime


class OrderCreateIn(Schema):
    profile_id: UUID
    tailor_model_id: UUID | None = None
    delivery_date: date | None = None
    notes: str = ""


class OrderPatchIn(Schema):
    status: str | None = None
    delivery_date: date | None = None
    final_price: Decimal | None = None
    paid: bool | None = None
    notes: str | None = None


class OrderOut(Schema):
    id: UUID
    user_id: UUID
    profile_id: UUID
    tailor_model_id: UUID | None
    status: str
    delivery_date: date | None
    final_price: Decimal | None
    paid: bool
    paid_at: datetime | None
    notes: str
    created_at: datetime
    updated_at: datetime
