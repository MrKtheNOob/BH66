from __future__ import annotations

from .schemas import ValidationReport

REQUIRED_KEYPOINTS = [
    "nose",
    "left_shoulder",
    "right_shoulder",
    "left_hip",
    "right_hip",
    "left_knee",
    "right_knee",
    "left_ankle",
    "right_ankle",
]


def _compute_body_height_px(keypoints: dict[str, tuple[float, float, float]]) -> float:
    if not keypoints:
        return 0.0
    ys = [y for _, y, _ in keypoints.values()]
    return max(ys) - min(ys)


def _asymmetry_ratio(a: float | None, b: float | None) -> float | None:
    if a is None or b is None:
        return None
    avg = (a + b) / 2
    if avg <= 0:
        return None
    return abs(a - b) / avg


def validate_pose(
    image_width: int,
    image_height: int,
    keypoints: dict[str, tuple[float, float, float]],
    min_confidence: float = 0.5,
    min_body_height_ratio: float = 0.6,
    min_image_width: int = 480,
    min_image_height: int = 720,
    min_body_height_px: float = 500.0,
    max_arm_asymmetry_ratio: float = 0.08,
    max_leg_asymmetry_ratio: float = 0.06,
) -> ValidationReport:
    reject_reasons: list[str] = []
    warnings: list[str] = []
    checks: dict[str, object] = {}

    missing = [k for k in REQUIRED_KEYPOINTS if k not in keypoints]
    if missing:
        reject_reasons.append(f"missing_keypoints:{','.join(missing)}")

    low_conf = [k for k, (_, _, c) in keypoints.items() if c < min_confidence]
    if low_conf:
        reject_reasons.append(f"low_confidence_keypoints:{','.join(low_conf)}")

    body_px = _compute_body_height_px(keypoints)
    ratio = body_px / max(image_height, 1)

    valid_pose = not reject_reasons
    if ratio < min_body_height_ratio:
        reject_reasons.append("body_too_small_in_frame_ratio")
        valid_pose = False

    if image_width < min_image_width:
        warnings.append("image_width_below_recommended_min")
    if image_height < min_image_height:
        warnings.append("image_height_below_recommended_min")
    if body_px < min_body_height_px:
        warnings.append("body_height_px_below_recommended_min")

    left_arm = right_arm = left_leg = right_leg = None
    if "left_shoulder" in keypoints and "left_wrist" in keypoints:
        lx, ly, _ = keypoints["left_shoulder"]
        wx, wy, _ = keypoints["left_wrist"]
        left_arm = ((lx - wx) ** 2 + (ly - wy) ** 2) ** 0.5
    if "right_shoulder" in keypoints and "right_wrist" in keypoints:
        rx, ry, _ = keypoints["right_shoulder"]
        wx, wy, _ = keypoints["right_wrist"]
        right_arm = ((rx - wx) ** 2 + (ry - wy) ** 2) ** 0.5
    if "left_hip" in keypoints and "left_ankle" in keypoints:
        hx, hy, _ = keypoints["left_hip"]
        ax, ay, _ = keypoints["left_ankle"]
        left_leg = ((hx - ax) ** 2 + (hy - ay) ** 2) ** 0.5
    if "right_hip" in keypoints and "right_ankle" in keypoints:
        hx, hy, _ = keypoints["right_hip"]
        ax, ay, _ = keypoints["right_ankle"]
        right_leg = ((hx - ax) ** 2 + (hy - ay) ** 2) ** 0.5

    arm_asymmetry_ratio = _asymmetry_ratio(left_arm, right_arm)
    leg_asymmetry_ratio = _asymmetry_ratio(left_leg, right_leg)
    if arm_asymmetry_ratio is not None and arm_asymmetry_ratio > max_arm_asymmetry_ratio:
        warnings.append("arms_asymmetry_detected")
    if leg_asymmetry_ratio is not None and leg_asymmetry_ratio > max_leg_asymmetry_ratio:
        warnings.append("legs_asymmetry_detected")

    valid_for_measurement = valid_pose and not any(
        w in warnings
        for w in (
            "image_width_below_recommended_min",
            "image_height_below_recommended_min",
            "body_height_px_below_recommended_min",
            "arms_asymmetry_detected",
            "legs_asymmetry_detected",
        )
    )

    quality = "good"
    if not valid_pose:
        quality = "invalid_pose"
    elif not valid_for_measurement:
        quality = "low_quality"

    checks["image_width"] = image_width
    checks["image_height"] = image_height
    checks["body_height_px"] = round(body_px, 2)
    checks["body_height_ratio"] = round(ratio, 3)
    checks["min_confidence"] = min_confidence
    checks["min_body_height_ratio"] = min_body_height_ratio
    checks["min_image_width"] = min_image_width
    checks["min_image_height"] = min_image_height
    checks["min_body_height_px"] = min_body_height_px
    checks["arm_asymmetry_ratio"] = None if arm_asymmetry_ratio is None else round(arm_asymmetry_ratio, 3)
    checks["leg_asymmetry_ratio"] = None if leg_asymmetry_ratio is None else round(leg_asymmetry_ratio, 3)
    checks["max_arm_asymmetry_ratio"] = max_arm_asymmetry_ratio
    checks["max_leg_asymmetry_ratio"] = max_leg_asymmetry_ratio

    return ValidationReport(
        valid_pose=valid_pose,
        valid_for_measurement=valid_for_measurement,
        quality=quality,
        reject_reasons=reject_reasons,
        warnings=warnings,
        checks=checks,
    )
