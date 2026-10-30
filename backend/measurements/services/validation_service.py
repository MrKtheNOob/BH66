from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ValidationResult:
    valid: bool
    reasons: list[str]
    quality_metrics: dict


def validate_image(image) -> ValidationResult:
    """Stub validation service.

    Real CV and quality analysis should be implemented in dedicated workers later.
    """
    size_bytes = getattr(image, "size", 0)
    name = getattr(image, "name", "")
    content_type = getattr(image, "content_type", "")

    reasons: list[str] = []
    if size_bytes <= 0:
        reasons.append("empty_file")
    if content_type and not content_type.startswith("image/"):
        reasons.append("invalid_content_type")
    if not name:
        reasons.append("missing_filename")

    quality_metrics = {
        "size_bytes": size_bytes,
        "content_type": content_type,
        "filename": name,
    }

    return ValidationResult(valid=not reasons, reasons=reasons, quality_metrics=quality_metrics)
