from __future__ import annotations

from .schemas import MeasurementResult


def _distance(a: tuple[float, float, float], b: tuple[float, float, float]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def estimate_measurements(
    keypoints: dict[str, tuple[float, float, float]],
    height_cm: float,
) -> MeasurementResult:
    if not keypoints:
        return MeasurementResult()

    ys = [y for _, y, _ in keypoints.values()]
    body_px = max(ys) - min(ys)
    if body_px <= 0:
        return MeasurementResult()

    cm_per_px = height_cm / body_px

    values_cm: dict[str, float] = {}
    confidence: dict[str, float] = {}

    def add_linear_measure(name: str, a: str, b: str) -> None:
        if a not in keypoints or b not in keypoints:
            return
        px = _distance(keypoints[a], keypoints[b])
        values_cm[name] = round(px * cm_per_px, 2)
        confidence[name] = round(min(keypoints[a][2], keypoints[b][2]), 3)

    add_linear_measure("shoulder_width", "left_shoulder", "right_shoulder")
    add_linear_measure("hip_width", "left_hip", "right_hip")
    add_linear_measure("left_arm_length", "left_shoulder", "left_wrist")
    add_linear_measure("right_arm_length", "right_shoulder", "right_wrist")
    add_linear_measure("left_leg_length", "left_hip", "left_ankle")
    add_linear_measure("right_leg_length", "right_hip", "right_ankle")

    # Rough torso proxy from shoulder midpoint to hip midpoint.
    if all(k in keypoints for k in ("left_shoulder", "right_shoulder", "left_hip", "right_hip")):
        sx = (keypoints["left_shoulder"][0] + keypoints["right_shoulder"][0]) / 2
        sy = (keypoints["left_shoulder"][1] + keypoints["right_shoulder"][1]) / 2
        hx = (keypoints["left_hip"][0] + keypoints["right_hip"][0]) / 2
        hy = (keypoints["left_hip"][1] + keypoints["right_hip"][1]) / 2
        torso_px = ((sx - hx) ** 2 + (sy - hy) ** 2) ** 0.5
        values_cm["torso_length"] = round(torso_px * cm_per_px, 2)
        confidence["torso_length"] = round(
            min(
                keypoints["left_shoulder"][2],
                keypoints["right_shoulder"][2],
                keypoints["left_hip"][2],
                keypoints["right_hip"][2],
            ),
            3,
        )

    notes = {
        "hip_width": "Estimated from pose landmarks (skeletal proxy), not body silhouette circumference.",
        "shoulder_width": "Estimated from pose landmarks; useful proxy but not a garment-width measurement.",
    }
    return MeasurementResult(
        values_cm=values_cm,
        confidence_by_measurement=confidence,
        measurement_notes=notes,
    )
