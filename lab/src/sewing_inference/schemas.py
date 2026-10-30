from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class InferenceInput:
    image_path: str
    height_cm: float
    side_image_path: str | None = None


@dataclass
class ValidationReport:
    valid_pose: bool
    valid_for_measurement: bool
    quality: str = "unknown"
    reject_reasons: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    checks: dict[str, Any] = field(default_factory=dict)


@dataclass
class MeasurementResult:
    values_cm: dict[str, float] = field(default_factory=dict)
    confidence_by_measurement: dict[str, float] = field(default_factory=dict)
    measurement_notes: dict[str, str] = field(default_factory=dict)


@dataclass
class InferenceOutput:
    inference_version: str
    ruleset_version: str
    status: str
    input: dict[str, Any]
    validation: ValidationReport
    measurements: MeasurementResult
    meta: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
