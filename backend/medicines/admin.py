# Register your models here.

from django.contrib import admin

from .models import (
    Medicine,
    Inventory,
    Batch,
    PriceHistory,
)


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = (
        "medicine_name",
        "generic_name",
        "category",
        "manufacturer",
    )

    search_fields = (
        "medicine_name",
        "generic_name",
        "manufacturer",
    )


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = (
        "pharmacy",
        "medicine",
        "quantity",
        "selling_price",
        "updated_at",
    )

    list_filter = ("medicine",)


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = (
        "medicine",
        "pharmacy",
        "batch_number",
        "expiry_date",
        "quantity",
    )

    list_filter = ("expiry_date",)


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "medicine",
        "pharmacy",
        "price",
        "recorded_at",
    )