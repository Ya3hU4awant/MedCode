from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medicine.medicine_name', read_only=True)
    pharmacy_name = serializers.CharField(source='pharmacy.pharmacy_name', read_only=True)

    class Meta:
        model = Alert
        fields = [
            'id', 'alert_type', 'title', 'message', 'severity', 
            'medicine', 'medicine_name', 'pharmacy', 'pharmacy_name', 
            'state', 'district', 'is_read', 'created_at'
        ]
