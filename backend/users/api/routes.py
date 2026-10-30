from __future__ import annotations

from typing import cast

from django.conf import settings
from django.contrib.auth import authenticate
from django.http import HttpResponse
from ninja import Router
from ninja.params import Cookie
from ninja.errors import HttpError

from core.auth import (
    JWTAuth,
    REFRESH_TTL_DAYS,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from users.models import User
from users.schemas import (
    TokenOut,
    UserCreateIn,
    UserLoginIn,
    UserOut,
    UserUpdateMeIn,
)

auth_router = Router()
user_router = Router()
auth = JWTAuth()
REFRESH_COOKIE_NAME = "bh66_refresh_token"
REFRESH_COOKIE_PATH = "/api/auth/"
REFRESH_COOKIE_MAX_AGE = REFRESH_TTL_DAYS * 24 * 60 * 60


def _set_refresh_cookie(response: HttpResponse, token: str) -> None:
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        token,
        max_age=REFRESH_COOKIE_MAX_AGE,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        path=REFRESH_COOKIE_PATH,
    )


def _clear_refresh_cookie(response: HttpResponse) -> None:
    response.delete_cookie(REFRESH_COOKIE_NAME, path=REFRESH_COOKIE_PATH)


def _serialize_user(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        username=user.username,
        email=user.email,
        phone=user.phone,
        is_staff=user.is_staff,
    )


@auth_router.post("/register", response=UserOut)
def register_user(request, payload: UserCreateIn):
    if User.objects.filter(username=payload.username).exists():
        raise HttpError(400, "username already exists")
    if User.objects.filter(email=payload.email).exists():
        raise HttpError(400, "email already exists")

    user = User(username=payload.username, email=payload.email, phone=payload.phone or "")
    user.set_password(payload.password)
    user.save()
    return _serialize_user(user)


@auth_router.post("/login", response=TokenOut)
def login_user(request, payload: UserLoginIn):
    user = authenticate(request, email=payload.email, password=payload.password)
    if user is None:
        raise HttpError(401, "invalid credentials")
    user = cast(User, user)
    _set_refresh_cookie(response, create_refresh_token(user))
    return TokenOut(access_token=create_access_token(user))


@auth_router.post("/refresh", response=TokenOut)
def refresh_token(
    request,
    response: HttpResponse,
    refresh_token: str | None = Cookie(None, alias=REFRESH_COOKIE_NAME),
):
    if not refresh_token:
        raise HttpError(401, "missing refresh token")

    token_payload = decode_token(refresh_token, expected_type="refresh")
    user_id = token_payload.get("sub")
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist as exc:
        raise HttpError(401, "user not found") from exc

    _set_refresh_cookie(response, create_refresh_token(user))
    return TokenOut(access_token=create_access_token(user))


@auth_router.post("/logout")
def logout_user(request, response: HttpResponse):
    _clear_refresh_cookie(response)
    return {"success": True, "message": "Stateless logout. Discard tokens client-side."}


@user_router.get("/me", auth=auth, response=UserOut)
def get_me(request):
    return _serialize_user(request.auth)


@user_router.patch("/me", auth=auth, response=UserOut)
def update_me(request, payload: UserUpdateMeIn):
    user = request.auth
    if payload.email is not None:
        user.email = payload.email
    if payload.phone is not None:
        user.phone = payload.phone
    if payload.password is not None:
        user.set_password(payload.password)
    user.save()
    return _serialize_user(user)


@user_router.get("", auth=auth, response=list[UserOut])
def list_users(request):
    if not request.auth.is_staff:
        raise HttpError(403, "admin only")
    return [_serialize_user(user) for user in User.objects.all().order_by("username")]


@user_router.get("/{user_id}", auth=auth, response=UserOut)
def get_user(request, user_id: str):
    if not request.auth.is_staff and str(request.auth.id) != user_id:
        raise HttpError(403, "forbidden")
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist as exc:
        raise HttpError(404, "user not found") from exc
    return _serialize_user(user)
