from __future__ import annotations

from urllib.parse import quote

from django.conf import settings


class StorageService:
    @staticmethod
    def build_public_image_url(raw_url: str) -> str:
        if not raw_url:
            return ""

        provider = getattr(settings, "MEDIA_PROVIDER", "local")
        if provider != "cloudinary":
            return raw_url

        marker = "/upload/"
        if marker in raw_url and "/upload/f_auto,q_auto/" not in raw_url:
            return raw_url.replace(marker, "/upload/f_auto,q_auto/", 1)

        # Fallback for unexpected url formats.
        return raw_url + ("&" if "?" in raw_url else "?") + "f_auto,q_auto"

    @staticmethod
    def build_file_key(path: str) -> str:
        return quote(path.strip("/"))
