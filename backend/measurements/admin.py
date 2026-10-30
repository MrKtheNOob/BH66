from django.contrib import admin

from media.models import MeasurementImage
from measurements.models import AnalysisRun, MeasurementProfile, MeasurementValues


class MeasurementValuesInline(admin.StackedInline):
    model = MeasurementValues
    extra = 0
    max_num = 1
    can_delete = False


class MeasurementImageInline(admin.TabularInline):
    model = MeasurementImage
    extra = 0
    fields = ("image_file", "image_type", "uploaded_at")
    readonly_fields = ("uploaded_at",)


class AnalysisRunInline(admin.TabularInline):
    model = AnalysisRun
    extra = 0
    fields = ("image", "input_height_cm", "valid_pose", "valid_for_measurement", "engine_version", "created_at")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("image",)


@admin.register(MeasurementProfile)
class MeasurementProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "height_cm", "status", "created_at", "updated_at")
    list_filter = ("status", "created_at", "updated_at")
    search_fields = ("id", "user__username", "user__email", "user__phone")
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [MeasurementValuesInline, MeasurementImageInline, AnalysisRunInline]


@admin.register(MeasurementValues)
class MeasurementValuesAdmin(admin.ModelAdmin):
    list_display = ("id", "profile", "created_at", "updated_at")
    search_fields = ("profile__id", "profile__user__username", "profile__user__email")
    autocomplete_fields = ("profile",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(AnalysisRun)
class AnalysisRunAdmin(admin.ModelAdmin):
    list_display = ("id", "profile", "valid_pose", "valid_for_measurement", "input_height_cm", "engine_version", "created_at")
    list_filter = ("valid_pose", "valid_for_measurement", "engine_version", "created_at")
    search_fields = ("profile__id", "profile__user__username", "profile__user__email")
    autocomplete_fields = ("profile", "image")
    readonly_fields = ("created_at", "updated_at")
