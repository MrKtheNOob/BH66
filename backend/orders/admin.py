from django.contrib import admin

from orders.models import Order, Promotion, TailorModel


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ("label", "percentage", "active", "starts_at", "ends_at", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("label",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(TailorModel)
class TailorModelAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "base_price", "is_active", "promotion", "created_at")
    list_filter = ("category", "is_active", "created_at")
    search_fields = ("title", "category")
    autocomplete_fields = ("promotion",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "profile", "tailor_model", "status", "paid", "final_price", "delivery_date", "created_at")
    list_filter = ("status", "paid", "delivery_date", "created_at")
    search_fields = ("id", "user__username", "user__email", "profile__id")
    autocomplete_fields = ("user", "profile", "tailor_model")
    readonly_fields = ("created_at", "updated_at")
