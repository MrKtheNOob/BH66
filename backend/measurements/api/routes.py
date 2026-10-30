from __future__ import annotations

from uuid import UUID

from django.shortcuts import get_object_or_404
from ninja import File, Form, Router
from ninja.errors import HttpError
from ninja.files import UploadedFile

from core.auth import JWTAuth
from media.services.storage_service import StorageService
from measurements.models import MeasurementProfile
from measurements.repositories.profile_repository import ProfileRepository
from measurements.schemas import (
    MeasurementFieldOut,
    MeasurementImageOut,
    MeasurementsUpdateIn,
    MeasurementValuesOut,
    ProfileCreateIn,
    ProfileListItemOut,
    ProfileOut,
)
from measurements.services.profile_service import (
    attach_image,
    create_profile,
    mark_as_verified,
    run_analysis,
    update_measurements,
)
from users.models import User

router = Router(auth=JWTAuth())


def _serialize_measurements(values) -> MeasurementValuesOut:
    return MeasurementValuesOut(
        shoulder_width=MeasurementFieldOut(
            value=values.shoulder_width_value,
            confidence=values.shoulder_width_confidence,
            source=values.shoulder_width_source,
        ),
        sleeve_length=MeasurementFieldOut(
            value=values.sleeve_length_value,
            confidence=values.sleeve_length_confidence,
            source=values.sleeve_length_source,
        ),
        chest=MeasurementFieldOut(value=values.chest_value, confidence=values.chest_confidence, source=values.chest_source),
        waist=MeasurementFieldOut(value=values.waist_value, confidence=values.waist_confidence, source=values.waist_source),
        hips=MeasurementFieldOut(value=values.hips_value, confidence=values.hips_confidence, source=values.hips_source),
        thigh=MeasurementFieldOut(value=values.thigh_value, confidence=values.thigh_confidence, source=values.thigh_source),
        neck=MeasurementFieldOut(value=values.neck_value, confidence=values.neck_confidence, source=values.neck_source),
        boubou_length=MeasurementFieldOut(
            value=values.boubou_length_value,
            confidence=values.boubou_length_confidence,
            source=values.boubou_length_source,
        ),
        fond=MeasurementFieldOut(value=values.fond_value, confidence=values.fond_confidence, source=values.fond_source),
    )


def _serialize_profile(profile: MeasurementProfile, request) -> ProfileOut:
    images = [
        MeasurementImageOut(
            id=image.id,
            image_type=image.image_type,
            image_url=StorageService.build_public_image_url(
                request.build_absolute_uri(image.image_file.url) if image.image_file else ""
            ),
            uploaded_at=image.uploaded_at,
        )
        for image in profile.images.all().order_by("uploaded_at")
    ]

    return ProfileOut(
        id=profile.id,
        user_id=profile.user_id,
        height_cm=profile.height_cm,
        status=profile.status,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
        images=images,
        measurements=_serialize_measurements(profile.measurement_values),
    )


def _assert_profile_access(request, profile: MeasurementProfile) -> None:
    if request.auth.is_staff:
        return
    if str(profile.user_id) != str(request.auth.id):
        raise HttpError(403, "forbidden")


@router.post("", response=ProfileOut)
def create_measurement_profile(request, payload: ProfileCreateIn):
    if not request.auth.is_staff and str(payload.user_id) != str(request.auth.id):
        raise HttpError(403, "cannot create profile for another user")
    user = get_object_or_404(User, id=payload.user_id)
    profile = create_profile(user=user, height_cm=payload.height_cm)
    profile = ProfileRepository.get_by_id(profile.id)
    return _serialize_profile(profile, request)


@router.post("/{profile_id}/images", response=ProfileOut)
def upload_measurement_image(
    request,
    profile_id: UUID,
    image_type: str = Form(...),
    image_file: UploadedFile = File(...),
):
    if image_type not in {"front", "side"}:
        raise HttpError(400, "image_type must be 'front' or 'side'")

    profile = get_object_or_404(MeasurementProfile, id=profile_id)
    _assert_profile_access(request, profile)
    attach_image(profile=profile, image=image_file, image_type=image_type)
    profile = ProfileRepository.get_by_id(profile.id)
    return _serialize_profile(profile, request)


@router.post("/{profile_id}/analyze")
def analyze_profile(request, profile_id: UUID):
    profile = get_object_or_404(MeasurementProfile, id=profile_id)
    _assert_profile_access(request, profile)
    result = run_analysis(profile)
    profile = ProfileRepository.get_by_id(profile.id)
    return {
        "profile": _serialize_profile(profile, request).dict(),
        "analysis": result,
    }


@router.patch("/{profile_id}/measurements", response=ProfileOut)
def patch_measurements(request, profile_id: UUID, payload: MeasurementsUpdateIn):
    profile = get_object_or_404(MeasurementProfile, id=profile_id)
    _assert_profile_access(request, profile)
    update_measurements(profile, payload.dict())

    if any(
        field and field.source == "admin"
        for field in [
            payload.shoulder_width,
            payload.sleeve_length,
            payload.chest,
            payload.waist,
            payload.hips,
            payload.thigh,
            payload.neck,
            payload.boubou_length,
            payload.fond,
        ]
    ):
        if not request.auth.is_staff:
            raise HttpError(403, "admin source requires staff user")
        mark_as_verified(profile)

    profile = ProfileRepository.get_by_id(profile.id)
    return _serialize_profile(profile, request)


@router.get("/{profile_id}", response=ProfileOut)
def get_profile(request, profile_id: UUID):
    profile = get_object_or_404(MeasurementProfile, id=profile_id)
    _assert_profile_access(request, profile)
    profile = ProfileRepository.get_by_id(profile.id)
    return _serialize_profile(profile, request)


@router.get("", response=list[ProfileListItemOut])
def list_profiles(request):
    if request.auth.is_staff:
        profiles = ProfileRepository.list_all().order_by("-created_at")
    else:
        profiles = ProfileRepository.list_all().filter(user_id=request.auth.id).order_by("-created_at")
    return [
        ProfileListItemOut(
            id=profile.id,
            user_id=profile.user_id,
            height_cm=profile.height_cm,
            status=profile.status,
            created_at=profile.created_at,
            updated_at=profile.updated_at,
        )
        for profile in profiles
    ]
