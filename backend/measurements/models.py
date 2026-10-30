import uuid

from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class MeasurementProfileStatus(models.TextChoices):
    PENDING_REVIEW = "pending_review", "Pending review"
    AI_ESTIMATED = "ai_estimated", "AI estimated"
    ADMIN_VERIFIED = "admin_verified", "Admin verified"
    NEEDS_RETAKE = "needs_retake", "Needs retake"


class MeasurementSource(models.TextChoices):
    AI = "ai", "AI"
    MANUAL = "manual", "Manual"
    ADMIN = "admin", "Admin"


class MeasurementProfile(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="measurement_profiles")
    height_cm = models.FloatField()
    status = models.CharField(
        max_length=32,
        choices=MeasurementProfileStatus.choices,
        default=MeasurementProfileStatus.PENDING_REVIEW,
    )


class MeasurementValues(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.OneToOneField(MeasurementProfile, on_delete=models.CASCADE, related_name="measurement_values")

    shoulder_width_value = models.FloatField(null=True, blank=True)
    shoulder_width_confidence = models.FloatField(null=True, blank=True)
    shoulder_width_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)

    sleeve_length_value = models.FloatField(null=True, blank=True)
    sleeve_length_confidence = models.FloatField(null=True, blank=True)
    sleeve_length_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)

    chest_value = models.FloatField(null=True, blank=True)
    chest_confidence = models.FloatField(null=True, blank=True)
    chest_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)

    waist_value = models.FloatField(null=True, blank=True)
    waist_confidence = models.FloatField(null=True, blank=True)
    waist_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)

    hips_value = models.FloatField(null=True, blank=True)
    hips_confidence = models.FloatField(null=True, blank=True)
    hips_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)

    thigh_value = models.FloatField(null=True, blank=True)
    thigh_confidence = models.FloatField(null=True, blank=True)
    thigh_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)

    neck_value = models.FloatField(null=True, blank=True)
    neck_confidence = models.FloatField(null=True, blank=True)
    neck_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)

    boubou_length_value = models.FloatField(null=True, blank=True)
    boubou_length_confidence = models.FloatField(null=True, blank=True)
    boubou_length_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)

    fond_value = models.FloatField(null=True, blank=True)
    fond_confidence = models.FloatField(null=True, blank=True)
    fond_source = models.CharField(max_length=16, choices=MeasurementSource.choices, null=True, blank=True)


class AnalysisRun(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(MeasurementProfile, on_delete=models.CASCADE, related_name="analysis_runs")
    image = models.ForeignKey(
        "media.MeasurementImage",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="analysis_runs",
    )
    input_height_cm = models.FloatField()
    valid_pose = models.BooleanField(default=False)
    valid_for_measurement = models.BooleanField(default=False)
    errors = models.JSONField(default=list, blank=True)
    warnings = models.JSONField(default=list, blank=True)
    engine_version = models.CharField(max_length=32, default="v0.1")
    ruleset_version = models.CharField(max_length=32, default="r0.1")
