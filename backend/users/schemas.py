from uuid import UUID

from ninja import Schema


class UserCreateIn(Schema):
    username: str
    email: str
    password: str
    phone: str | None = None


class UserLoginIn(Schema):
    email: str
    password: str


class TokenOut(Schema):
    access_token: str
    token_type: str = "bearer"


class UserOut(Schema):
    id: UUID
    username: str
    email: str
    phone: str
    is_staff: bool


class UserUpdateMeIn(Schema):
    email: str | None = None
    phone: str | None = None
    password: str | None = None
