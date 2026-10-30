from __future__ import annotations

from django.db import transaction

from measurements.models import MeasurementProfileStatus
from measurements.repositories.profile_repository import ProfileRepository
from measurements.services.measurement_service import compute_measurements
from measurements.services.validation_service import validate_image
from media.repositories.image_repository import ImageRepository
from users.models import User

MEASUREMENT_FIELDS = (
    "shoulder_width",
    "sleeve_length",
    "chest",
    "waist",
    "hips",
    "thigh",
    "neck",
    "boubou_length",
    "fond",
)


@transaction.atomic
def create_profile(user: User, height_cm: float):
    return ProfileRepository.create(user=user, height_cm=height_cm)


@transaction.atomic
def attach_image(profile, image, image_type: str):
    return ImageRepository.create(profile=profile, image_file=image, image_type=image_type)


@transaction.atomic
def run_analysis(profile):
    front_image = profile.images.filter(image_type="front").order_by("-uploaded_at").first()
    if front_image is None:
        profile.status = MeasurementProfileStatus.NEEDS_RETAKE
        profile.save(update_fields=["status", "updated_at"])
        return {
            "validation": {"valid": False, "reasons": ["missing_front_image"], "quality_metrics": {}},
            "measurements": {},
            "confidence": {},
        }

    validation = validate_image(front_image.image_file)
    if not validation.valid:
        profile.status = MeasurementProfileStatus.NEEDS_RETAKE
        profile.save(update_fields=["status", "updated_at"])
        return {
            "validation": {
                "valid": validation.valid,
                "reasons": validation.reasons,
                "quality_metrics": validation.quality_metrics,
            },
            "measurements": {},
            "confidence": {},
        }

    result = compute_measurements(front_image.image_file, profile.height_cm)
    values = profile.measurement_values

    for field in MEASUREMENT_FIELDS:
        setattr(values, f"{field}_value", result.measurements.get(field))
        setattr(values, f"{field}_confidence", result.confidence.get(field))
        setattr(values, f"{field}_source", "ai")

    values.save()
    profile.status = MeasurementProfileStatus.AI_ESTIMATED
    profile.save(update_fields=["status", "updated_at"])

    return {
        "validation": {
            "valid": validation.valid,
            "reasons": validation.reasons,
            "quality_metrics": validation.quality_metrics,
        },
        "measurements": result.measurements,
        "confidence": result.confidence,
    }


@transaction.atomic
def update_measurements(profile, data: dict):
    values = profile.measurement_values

    for field, payload in data.items():
        if payload is None:
            continue
        if field not in MEASUREMENT_FIELDS:
            continue
        if "value" in payload:
            setattr(values, f"{field}_value", payload.get("value"))
        if "confidence" in payload:
            setattr(values, f"{field}_confidence", payload.get("confidence"))
        if "source" in payload:
            setattr(values, f"{field}_source", payload.get("source"))

    values.save()
    return values


@transaction.atomic
def mark_as_verified(profile):
    profile.status = MeasurementProfileStatus.ADMIN_VERIFIED
    profile.save(update_fields=["status", "updated_at"])
    return profile
