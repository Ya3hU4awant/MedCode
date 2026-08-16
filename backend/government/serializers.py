from rest_framework import serializers
from .models import GovernmentAction

class GovernmentActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentAction
        fields = '__all__'
        read_only_fields = ['id', 'government_user', 'created_at']
