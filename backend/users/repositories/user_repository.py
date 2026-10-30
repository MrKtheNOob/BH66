from users.models import User


class UserRepository:
    @staticmethod
    def get_by_id(user_id: str) -> User:
        return User.objects.get(id=user_id)
