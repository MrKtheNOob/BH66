from django.db.models import QuerySet

from measurements.models import MeasurementProfile, MeasurementValues


class ProfileRepository:
    @staticmethod
    def create(*, user, height_cm: float) -> MeasurementProfile:
        profile = MeasurementProfile.objects.create(user=user, height_cm=height_cm)
        MeasurementValues.objects.create(profile=profile)
        return profile

    @staticmethod
    def list_all() -> QuerySet[MeasurementProfile]:
        return MeasurementProfile.objects.select_related("user", "measurement_values").prefetch_related("images")

    @staticmethod
    def get_by_id(profile_id):
        return (
            MeasurementProfile.objects.select_related("user", "measurement_values")
            .prefetch_related("images")
            .get(id=profile_id)
        )
