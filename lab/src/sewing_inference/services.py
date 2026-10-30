from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from .measurements import estimate_measurements
from .mediapipe_adapter import PoseDetectionResult, detect_pose
from .schemas import InferenceInput, InferenceOutput, MeasurementResult, ValidationReport
from .validation import validate_pose


class PoseDetector(Protocol):
    def detect(self, image_path: str) -> PoseDetectionResult: ...


class ValidationService(Protocol):
    def validate(
        self,
        image_width: int,
        image_height: int,
        keypoints: dict[str, tuple[float, float, float]],
    ) -> ValidationReport: ...


class MeasurementEstimator(Protocol):
    def estimate(
        self,
        keypoints: dict[str, tuple[float, float, float]],
        height_cm: float,
    ) -> MeasurementResult: ...


@dataclass(frozen=True)
class InferenceConfig:
    inference_version: str = "v0.1"
    ruleset_version: str = "r0.1"


class MediaPipeTasksPoseDetector:
    def detect(self, image_path: str) -> PoseDetectionResult:
        return detect_pose(image_path)


class DefaultValidationService:
    def validate(
        self,
        image_width: int,
        image_height: int,
        keypoints: dict[str, tuple[float, float, float]],
    ) -> ValidationReport:
        return validate_pose(
            image_width=image_width,
            image_height=image_height,
            keypoints=keypoints,
        )


class DefaultMeasurementEstimator:
    def estimate(
        self,
        keypoints: dict[str, tuple[float, float, float]],
        height_cm: float,
    ) -> MeasurementResult:
        return estimate_measurements(keypoints=keypoints, height_cm=height_cm)


class InferenceEngine:
    def __init__(
        self,
        detector: PoseDetector,
        validator: ValidationService,
        estimator: MeasurementEstimator,
        config: InferenceConfig | None = None,
    ) -> None:
        self.detector = detector
        self.validator = validator
        self.estimator = estimator
        self.config = config or InferenceConfig()

    def run(self, image_path: str, height_cm: float, side_image_path: str | None = None) -> InferenceOutput:
        input_data = InferenceInput(image_path=image_path, height_cm=height_cm, side_image_path=side_image_path)
        detection = self.detector.detect(image_path)

        validation = self.validator.validate(
            image_width=detection.image_width,
            image_height=detection.image_height,
            keypoints=detection.keypoints,
        )

        if not validation.valid_pose:
            measurements = self.estimator.estimate({}, height_cm)
            status = "invalid_pose"
        elif not validation.valid_for_measurement:
            measurements = self.estimator.estimate({}, height_cm)
            status = "low_quality"
        else:
            measurements = self.estimator.estimate(detection.keypoints, height_cm)
            status = "pending_review"

        return InferenceOutput(
            inference_version=self.config.inference_version,
            ruleset_version=self.config.ruleset_version,
            status=status,
            input=input_data.__dict__,
            validation=validation,
            measurements=measurements,
            meta={"num_keypoints": len(detection.keypoints)},
        )
