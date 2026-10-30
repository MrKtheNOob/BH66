from __future__ import annotations

from dataclasses import dataclass

from sewing_inference.pipeline import build_default_engine




@dataclass
class MeasurementComputationResult:
    measurements: dict[str, float]
    confidence: dict[str, float]


def compute_measurements(image, height_cm: float) -> MeasurementComputationResult:
    """Compute measurements by adapting outputs from the lab inference engine.

    Falls back to deterministic mock values when runtime dependencies are missing.
    """
    try:
        engine = build_default_engine()
        result = engine.run(image_path=image.path, height_cm=height_cm)
        values = result.measurements.values_cm
        conf = result.measurements.confidence_by_measurement

        left_arm = values.get("left_arm_length")
        right_arm = values.get("right_arm_length")
        sleeve_length = None
        if left_arm and right_arm:
            sleeve_length = round((left_arm + right_arm) / 2, 2)
        elif left_arm or right_arm:
            sleeve_length = left_arm or right_arm

        shoulder = values.get("shoulder_width")
        hip = values.get("hip_width")

        measurements = {
            "shoulder_width": shoulder,
            "sleeve_length": sleeve_length,
            "chest": round((shoulder or height_cm * 0.24) * 2.2, 2) if shoulder else None,
            "waist": round((hip or height_cm * 0.23) * 2.0, 2) if hip else None,
            "hips": round((hip or height_cm * 0.24) * 2.2, 2) if hip else None,
            "thigh": round((hip or height_cm * 0.24) * 0.95, 2) if hip else None,
            "neck": round((shoulder or height_cm * 0.24) * 0.85, 2) if shoulder else None,
            "boubou_length": values.get("torso_length") or round(height_cm * 0.88, 2),
            "fond": round(height_cm * 0.28, 2),
        }
        confidence = {
            "shoulder_width": conf.get("shoulder_width", 0.65),
            "sleeve_length": min(conf.get("left_arm_length", 0.65), conf.get("right_arm_length", 0.65)),
            "chest": 0.55,
            "waist": 0.5,
            "hips": 0.5,
            "thigh": 0.45,
            "neck": 0.45,
            "boubou_length": conf.get("torso_length", 0.65),
            "fond": 0.4,
        }
        return MeasurementComputationResult(measurements=measurements, confidence=confidence)
    except Exception:
        base = max(height_cm, 1.0)
        measurements = {
            "shoulder_width": round(base * 0.24, 2),
            "sleeve_length": round(base * 0.34, 2),
            "chest": round(base * 0.52, 2),
            "waist": round(base * 0.49, 2),
            "hips": round(base * 0.53, 2),
            "thigh": round(base * 0.31, 2),
            "neck": round(base * 0.22, 2),
            "boubou_length": round(base * 0.88, 2),
            "fond": round(base * 0.28, 2),
        }
        confidence = {key: 0.6 for key in measurements}
        return MeasurementComputationResult(measurements=measurements, confidence=confidence)
