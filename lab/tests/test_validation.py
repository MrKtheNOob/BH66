from sewing_inference.validation import validate_pose


def test_validate_pose_rejects_missing_keypoints() -> None:
    report = validate_pose(image_width=1000, image_height=2000, keypoints={})
    assert report.valid_pose is False
    assert report.valid_for_measurement is False
    assert any("missing_keypoints" in reason for reason in report.reject_reasons)


def test_validate_pose_accepts_good_case() -> None:
    keypoints = {
        "nose": (100, 100, 0.9),
        "left_shoulder": (80, 300, 0.9),
        "right_shoulder": (120, 300, 0.9),
        "left_hip": (85, 900, 0.9),
        "right_hip": (115, 900, 0.9),
        "left_knee": (90, 1300, 0.9),
        "right_knee": (110, 1300, 0.9),
        "left_ankle": (95, 1800, 0.9),
        "right_ankle": (105, 1800, 0.9),
    }
    report = validate_pose(image_width=1000, image_height=2000, keypoints=keypoints)
    assert report.valid_pose is True
    assert report.valid_for_measurement is True
    assert not report.reject_reasons


def test_validate_pose_rejects_low_resolution_for_measurement_quality() -> None:
    keypoints = {
        "nose": (10, 10, 0.9),
        "left_shoulder": (8, 30, 0.9),
        "right_shoulder": (12, 30, 0.9),
        "left_hip": (8, 90, 0.9),
        "right_hip": (12, 90, 0.9),
        "left_knee": (9, 130, 0.9),
        "right_knee": (11, 130, 0.9),
        "left_ankle": (9, 180, 0.9),
        "right_ankle": (11, 180, 0.9),
        "left_wrist": (7, 55, 0.9),
        "right_wrist": (13, 55, 0.9),
    }
    report = validate_pose(image_width=60, image_height=199, keypoints=keypoints)
    assert report.valid_pose is True
    assert report.valid_for_measurement is False
    assert "image_width_below_recommended_min" in report.warnings
