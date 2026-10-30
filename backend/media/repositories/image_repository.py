from media.models import MeasurementImage


class ImageRepository:
    @staticmethod
    def create(*, profile, image_file, image_type: str) -> MeasurementImage:
        return MeasurementImage.objects.create(profile=profile, image_file=image_file, image_type=image_type)
