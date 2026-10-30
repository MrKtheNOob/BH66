from users.models import User


def get_user(user_id: str) -> User:
    return User.objects.get(id=user_id)
