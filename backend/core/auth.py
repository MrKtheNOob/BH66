from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from django.conf import settings
from ninja.errors import HttpError
from ninja.security import HttpBearer

from users.models import User


ALGORITHM = "HS256"
ACCESS_TTL_MINUTES = 15
REFRESH_TTL_DAYS = 7


class JWTAuth(HttpBearer):
    def authenticate(self, request, token: str) -> User:
        payload = decode_token(token, expected_type="access")
        user_id = payload.get("sub")
        if not user_id:
            raise HttpError(401, "Invalid token subject")
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist as exc:
            raise HttpError(401, "User not found") from exc


def _encode(payload: dict[str, Any]) -> str:
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def _decode(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError as exc:
        raise HttpError(401, "Token expired") from exc
    except jwt.InvalidTokenError as exc:
        raise HttpError(401, "Invalid token") from exc


def create_access_token(user: User) -> str:
    now = datetime.now(tz=timezone.utc)
    payload = {
        "sub": str(user.id),
        "type": "access",
        "username": user.username,
        "is_staff": user.is_staff,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=ACCESS_TTL_MINUTES)).timestamp()),
    }
    return _encode(payload)


def create_refresh_token(user: User) -> str:
    now = datetime.now(tz=timezone.utc)
    payload = {
        "sub": str(user.id),
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(days=REFRESH_TTL_DAYS)).timestamp()),
    }
    return _encode(payload)


def decode_token(token: str, *, expected_type: str) -> dict[str, Any]:
    payload = _decode(token)
    token_type = payload.get("type")
    if token_type != expected_type:
        raise HttpError(401, f"Expected {expected_type} token")
    return payload
