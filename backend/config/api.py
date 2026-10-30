from ninja import NinjaAPI

from measurements.api.routes import router as measurement_router
from notifications.api.routes import router as notification_router
from orders.api.routes import router as order_router
from users.api.routes import auth_router, user_router

api = NinjaAPI(title="BH66 Tailoring API", version="1.0.0")
api.add_router("/profiles", measurement_router, tags=["profiles"])
api.add_router("/auth", auth_router, tags=["auth"])
api.add_router("/users", user_router, tags=["users"])
api.add_router("/orders", order_router, tags=["orders"])
api.add_router("/notifications", notification_router, tags=["notifications"])
