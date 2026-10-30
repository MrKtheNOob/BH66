import uuid

from django.db import models

from core.models import TimeStampedModel


class MeasurementImageType(models.TextChoices):
    FRONT = "front", "Front"
    SIDE = "side", "Side"


class MeasurementImage(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey("measurements.MeasurementProfile", on_delete=models.CASCADE, related_name="images")
    image_file = models.ImageField(upload_to="measurements/")
    image_type = models.CharField(max_length=16, choices=MeasurementImageType.choices)
    uploaded_at = models.DateTimeField(auto_now_add=True)
