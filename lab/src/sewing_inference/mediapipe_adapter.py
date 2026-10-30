from __future__ import annotations

from dataclasses import dataclass
import os

LANDMARK_INDEX = {
    "nose": 0,
    "left_shoulder": 11,
    "right_shoulder": 12,
    "left_hip": 23,
    "right_hip": 24,
    "left_knee": 25,
    "right_knee": 26,
    "left_ankle": 27,
    "right_ankle": 28,
    "left_wrist": 15,
    "right_wrist": 16,
}


@dataclass
class PoseDetectionResult:
    image_width: int
    image_height: int
    keypoints: dict[str, tuple[float, float, float]]


def check_runtime() -> None:
    try:
        import cv2  # noqa: F401
    except ImportError as exc:  # pragma: no cover - runtime dependency
        raise RuntimeError("opencv-python is not installed. Run: uv add opencv-python") from exc

    try:
        import mediapipe as mp
    except ImportError as exc:  # pragma: no cover - runtime dependency
        raise RuntimeError("mediapipe is not installed. Run: uv add mediapipe") from exc

    if not hasattr(mp, "tasks"):
        raise RuntimeError("This project expects a modern mediapipe build with the Tasks API.")

    pose_model_path = os.environ.get("MEDIAPIPE_POSE_MODEL")
    if not pose_model_path:
        raise RuntimeError("Set MEDIAPIPE_POSE_MODEL to a local pose_landmarker.task file path.")
    if not os.path.isfile(pose_model_path):
        raise RuntimeError(f"MEDIAPIPE_POSE_MODEL does not point to a file: {pose_model_path} {os.curdir}")


def detect_pose(image_path: str) -> PoseDetectionResult:
    check_runtime()

    import cv2
    import mediapipe as mp
    try:
        from mediapipe.tasks import python
        from mediapipe.tasks.python import vision
    except ImportError as exc:  # pragma: no cover - runtime dependency
        raise RuntimeError("Failed to import mediapipe Tasks API modules.") from exc

    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")

    image_height, image_width = image.shape[:2]
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pose_model_path = os.environ.get("MEDIAPIPE_POSE_MODEL")

    base_options = python.BaseOptions(model_asset_path=pose_model_path)
    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.IMAGE,
        num_poses=1,
    )
    with vision.PoseLandmarker.create_from_options(options) as landmarker:
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = landmarker.detect(mp_image)

    if not result.pose_landmarks:
        return PoseDetectionResult(image_width=image_width, image_height=image_height, keypoints={})

    landmarks = result.pose_landmarks[0]
    keypoints = {}
    for name, idx in LANDMARK_INDEX.items():
        lm = landmarks[idx]
        visibility = float(getattr(lm, "visibility", 1.0))
        keypoints[name] = (float(lm.x * image_width), float(lm.y * image_height), visibility)

    return PoseDetectionResult(image_width=image_width, image_height=image_height, keypoints=keypoints)
