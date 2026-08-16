from rest_framework import serializers
from .models import Pharmacy


class PharmacySerializer(serializers.ModelSerializer):

    class Meta:
        model = Pharmacy
        fields = [
            "id",
            "pharmacy_name",
            "license_number",
            "address",
            "district",
            "state",
            "pincode",
            "latitude",
            "longitude",
            "phone",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
            "updated_at",
        ]