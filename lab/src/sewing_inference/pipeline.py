from __future__ import annotations

from .services import (
    DefaultMeasurementEstimator,
    DefaultValidationService,
    InferenceEngine,
    MediaPipeTasksPoseDetector,
)


def build_default_engine() -> InferenceEngine:
    return InferenceEngine(
        detector=MediaPipeTasksPoseDetector(),
        validator=DefaultValidationService(),
        estimator=DefaultMeasurementEstimator(),
    )


def run_inference(image_path: str, height_cm: float, side_image_path: str | None = None):
    engine = build_default_engine()
    return engine.run(image_path=image_path, height_cm=height_cm, side_image_path=side_image_path)
