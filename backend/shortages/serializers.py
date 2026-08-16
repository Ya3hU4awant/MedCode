from rest_framework import serializers
from .models import ShortageReport

class ShortageReportSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medicine.medicine_name', read_only=True)
    pharmacy_name = serializers.CharField(source='pharmacy.pharmacy_name', read_only=True)
    
    class Meta:
        model = ShortageReport
        fields = [
            'id', 'pharmacy', 'pharmacy_name', 'medicine', 'medicine_name', 
            'reported_quantity', 'threshold', 'severity', 'status', 
            'description', 'created_at', 'updated_at', 'resolved_at', 'resolved_by'
        ]
        read_only_fields = ['id', 'pharmacy', 'created_at', 'updated_at', 'resolved_at', 'resolved_by']
