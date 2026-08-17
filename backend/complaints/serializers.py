from rest_framework import serializers
from .models import Complaint


class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            'id', 'reference_number', 'complaint_type', 'medicine_name',
            'pharmacy_name', 'description', 'citizen_name', 'contact_number',
            'location', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'reference_number', 'status', 'created_at']


class ComplaintListSerializer(serializers.ModelSerializer):
    """Serializer for government view - shows all fields."""
    class Meta:
        model = Complaint
        fields = [
            'id', 'reference_number', 'complaint_type', 'medicine_name',
            'pharmacy_name', 'description', 'citizen_name', 'contact_number',
            'location', 'status', 'created_at'
        ]
