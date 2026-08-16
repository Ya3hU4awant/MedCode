from rest_framework import serializers

from .models import (
    Medicine,
    Inventory,
    Batch,
    PriceHistory,
)


class MedicineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medicine
        fields = [
            "id",
            "medicine_name",
            "generic_name",
            "category",
            "manufacturer",
            "unit",
            "description",
            "created_at",
            "updated_at",
        ]


class InventorySerializer(serializers.ModelSerializer):

    medicine_name = serializers.CharField(
        source="medicine.medicine_name",
        read_only=True
    )

    class Meta:
        model = Inventory
        fields = [
            "id",
            "medicine",
            "medicine_name",
            "quantity",
            "selling_price",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "updated_at",
            "medicine_name",
        ]


class BatchSerializer(serializers.ModelSerializer):

    medicine_name = serializers.CharField(
        source="medicine.medicine_name",
        read_only=True
    )

    class Meta:
        model = Batch
        fields = [
            "id",
            "medicine",
            "medicine_name",
            "batch_number",
            "manufacturing_date",
            "expiry_date",
            "quantity",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "medicine_name",
        ]


class PriceHistorySerializer(serializers.ModelSerializer):

    medicine_name = serializers.CharField(
        source="medicine.medicine_name",
        read_only=True
    )

    class Meta:
        model = PriceHistory
        fields = [
            "id",
            "medicine",
            "medicine_name",
            "price",
            "recorded_at",
        ]
        read_only_fields = [
            "id",
            "recorded_at",
            "medicine_name",
        ]