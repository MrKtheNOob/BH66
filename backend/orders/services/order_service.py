from __future__ import annotations

from django.utils import timezone
from ninja.errors import HttpError

from notifications.models import Notification, NotificationType
from orders.models import Order, OrderStatus, Promotion, TailorModel


def _notify(user, ntype: str, title: str, message: str, metadata: dict | None = None) -> None:
    Notification.objects.create(
        user=user,
        type=ntype,
        title=title,
        message=message,
        metadata=metadata or {},
    )


def create_order(*, user, profile, tailor_model=None, delivery_date=None, notes: str = "") -> Order:
    order = Order.objects.create(
        user=user,
        profile=profile,
        tailor_model=tailor_model,
        delivery_date=delivery_date,
        notes=notes,
    )
    _notify(
        user,
        NotificationType.ORDER_CREATED,
        "Commande créée",
        f"Votre commande {order.id} a été créée.",
        {"order_id": str(order.id)},
    )
    return order


def patch_order(*, order: Order, actor, data: dict) -> Order:
    is_staff = actor.is_staff
    old_status = order.status
    old_delivery = order.delivery_date

    if "status" in data and data["status"] is not None:
        if not is_staff:
            raise HttpError(403, "status update is admin only")
        order.status = data["status"]

    if "delivery_date" in data and data["delivery_date"] is not None:
        if not is_staff:
            raise HttpError(403, "delivery date update is admin only")
        order.delivery_date = data["delivery_date"]

    if "final_price" in data and data["final_price"] is not None:
        if not is_staff:
            raise HttpError(403, "final price update is admin only")
        order.final_price = data["final_price"]

    if "paid" in data and data["paid"] is not None:
        if not is_staff:
            raise HttpError(403, "paid update is admin only")
        order.paid = bool(data["paid"])
        order.paid_at = timezone.now() if order.paid else None

    if "notes" in data and data["notes"] is not None:
        if not is_staff and order.user_id != actor.id:
            raise HttpError(403, "cannot update another user's order notes")
        order.notes = data["notes"]

    order.save()

    if old_status != order.status:
        ntype = NotificationType.ORDER_STATUS_CHANGED
        if order.status == OrderStatus.CONFIRMED:
            ntype = NotificationType.ORDER_CONFIRMED
        _notify(
            order.user,
            ntype,
            "Statut de commande mis à jour",
            f"Commande {order.id}: nouveau statut {order.status}.",
            {"order_id": str(order.id), "status": order.status},
        )

    if old_delivery != order.delivery_date:
        _notify(
            order.user,
            NotificationType.DELIVERY_DATE_CHANGED,
            "Date de livraison modifiée",
            f"Commande {order.id}: nouvelle date {order.delivery_date}.",
            {"order_id": str(order.id), "delivery_date": str(order.delivery_date)},
        )

    return order


def create_promotion(data: dict) -> Promotion:
    return Promotion.objects.create(**data)


def patch_promotion(*, promotion: Promotion, data: dict) -> Promotion:
    for k, v in data.items():
        if v is not None:
            setattr(promotion, k, v)
    promotion.save()
    return promotion


def create_tailor_model(*, data: dict) -> TailorModel:
    return TailorModel.objects.create(**data)


def patch_tailor_model(*, model: TailorModel, data: dict) -> TailorModel:
    for k, v in data.items():
        if v is not None:
            setattr(model, k, v)
    model.save()
    return model
