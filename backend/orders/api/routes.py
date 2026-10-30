from __future__ import annotations

from uuid import UUID

from django.shortcuts import get_object_or_404
from ninja import File, Router
from ninja.errors import HttpError
from ninja.files import UploadedFile

from core.auth import JWTAuth
from media.services.storage_service import StorageService
from measurements.models import MeasurementProfile
from orders.models import Order, Promotion, TailorModel
from orders.schemas import (
    OrderCreateIn,
    OrderOut,
    OrderPatchIn,
    PromotionIn,
    PromotionOut,
    PromotionPatchIn,
    TailorModelIn,
    TailorModelOut,
    TailorModelPatchIn,
)
from orders.services.order_service import (
    create_order,
    create_promotion,
    create_tailor_model,
    patch_order,
    patch_promotion,
    patch_tailor_model,
)

router = Router(auth=JWTAuth())


def _serialize_order(order: Order) -> OrderOut:
    return OrderOut(
        id=order.id,
        user_id=order.user_id,
        profile_id=order.profile_id,
        tailor_model_id=order.tailor_model_id,
        status=order.status,
        delivery_date=order.delivery_date,
        final_price=order.final_price,
        paid=order.paid,
        paid_at=order.paid_at,
        notes=order.notes,
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


def _serialize_model(request, model: TailorModel) -> TailorModelOut:
    raw = request.build_absolute_uri(model.image.url) if model.image else None
    return TailorModelOut(
        id=model.id,
        title=model.title,
        image_url=StorageService.build_public_image_url(raw) if raw else None,
        category=model.category,
        base_price=model.base_price,
        is_active=model.is_active,
        promotion_id=model.promotion_id,
        created_at=model.created_at,
        updated_at=model.updated_at,
    )


@router.post("", response=OrderOut)
def create_order_endpoint(request, payload: OrderCreateIn):
    profile = get_object_or_404(MeasurementProfile, id=payload.profile_id)
    if not request.auth.is_staff and profile.user_id != request.auth.id:
        raise HttpError(403, "cannot create order for another user")
    tailor_model = None
    if payload.tailor_model_id:
        tailor_model = get_object_or_404(TailorModel, id=payload.tailor_model_id)
    order = create_order(
        user=profile.user,
        profile=profile,
        tailor_model=tailor_model,
        delivery_date=payload.delivery_date,
        notes=payload.notes,
    )
    return _serialize_order(order)


@router.get("", response=list[OrderOut])
def list_orders(request):
    qs = Order.objects.all().order_by("-created_at") if request.auth.is_staff else Order.objects.filter(user_id=request.auth.id).order_by("-created_at")
    return [_serialize_order(o) for o in qs]


@router.get("/{order_id}", response=OrderOut)
def get_order(request, order_id: UUID):
    order = get_object_or_404(Order, id=order_id)
    if not request.auth.is_staff and order.user_id != request.auth.id:
        raise HttpError(403, "forbidden")
    return _serialize_order(order)


@router.patch("/{order_id}", response=OrderOut)
def patch_order_endpoint(request, order_id: UUID, payload: OrderPatchIn):
    order = get_object_or_404(Order, id=order_id)
    if not request.auth.is_staff and order.user_id != request.auth.id:
        raise HttpError(403, "forbidden")
    order = patch_order(order=order, actor=request.auth, data=payload.dict())
    return _serialize_order(order)


@router.get("/catalog-models", response=list[TailorModelOut])
def list_tailor_models(request):
    return [_serialize_model(request, m) for m in TailorModel.objects.all().order_by("-created_at")]


@router.get("/catalog-models/{model_id}", response=TailorModelOut)
def get_tailor_model(request, model_id: UUID):
    model = get_object_or_404(TailorModel, id=model_id)
    return _serialize_model(request, model)


@router.post("/catalog-models", response=TailorModelOut)
def create_tailor_model_endpoint(
    request,
    payload: TailorModelIn,
    image: UploadedFile = File(...),
):
    if not request.auth.is_staff:
        raise HttpError(403, "admin only")
    promotion = get_object_or_404(Promotion, id=payload.promotion_id) if payload.promotion_id else None
    model = create_tailor_model(data={
        "title": payload.title,
        "category": payload.category,
        "base_price": payload.base_price,
        "promotion": promotion,
        "is_active": payload.is_active,
        "image": image,
    })
    return _serialize_model(request, model)


@router.patch("/catalog-models/{model_id}", response=TailorModelOut)
def patch_tailor_model_endpoint(request, model_id: UUID, payload: TailorModelPatchIn):
    if not request.auth.is_staff:
        raise HttpError(403, "admin only")
    model = get_object_or_404(TailorModel, id=model_id)
    data = payload.dict()
    if payload.promotion_id is not None:
        data["promotion"] = get_object_or_404(Promotion, id=payload.promotion_id)
    data.pop("promotion_id", None)
    model = patch_tailor_model(model=model, data=data)
    return _serialize_model(request, model)


@router.get("/promotions", response=list[PromotionOut])
def list_promotions(request):
    return list(Promotion.objects.all().order_by("-created_at"))


@router.post("/promotions", response=PromotionOut)
def create_promotion_endpoint(request, payload: PromotionIn):
    if not request.auth.is_staff:
        raise HttpError(403, "admin only")
    return create_promotion(payload.dict())


@router.patch("/promotions/{promotion_id}", response=PromotionOut)
def patch_promotion_endpoint(request, promotion_id: UUID, payload: PromotionPatchIn):
    if not request.auth.is_staff:
        raise HttpError(403, "admin only")
    promotion = get_object_or_404(Promotion, id=promotion_id)
    return patch_promotion(promotion=promotion, data=payload.dict())
