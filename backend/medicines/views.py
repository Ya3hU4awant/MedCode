from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q

from core.responses import success_response, error_response
from .models import Medicine
from .serializers import MedicineSerializer

class MedicineListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Medicine.objects.all()
        # Basic search
        search_term = request.query_params.get('search', None)
        category = request.query_params.get('category', None)
        
        if search_term:
            queryset = queryset.filter(
                Q(medicine_name__icontains=search_term) |
                Q(generic_name__icontains=search_term)
            )
        if category:
            queryset = queryset.filter(category=category)
            
        serializer = MedicineSerializer(queryset[:50], many=True) # limit for prototype
        return success_response(data=serializer.data)

class MedicineDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        medicine = get_object_or_404(Medicine, pk=pk)
        serializer = MedicineSerializer(medicine)
        return success_response(data=serializer.data)
