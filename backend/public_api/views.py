from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q

from core.responses import success_response, error_response
from medicines.models import Medicine, Inventory
from medicines.serializers import MedicineSerializer, InventorySerializer
from pharmacies.models import Pharmacy
from pharmacies.serializers import PharmacySerializer

class PublicMedicineListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Medicine.objects.all()
        # Basic search
        search_term = request.query_params.get('search', None)
        
        if search_term:
            queryset = queryset.filter(
                Q(medicine_name__icontains=search_term) |
                Q(generic_name__icontains=search_term)
            )
            
        serializer = MedicineSerializer(queryset[:50], many=True)
        return success_response(data=serializer.data)

class PublicMedicineDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        medicine = get_object_or_404(Medicine, pk=pk)
        data = MedicineSerializer(medicine).data
        
        # also return available pharmacies (inventory with quantity > 0)
        inventories = Inventory.objects.filter(medicine=medicine, quantity__gt=0).select_related('pharmacy')
        data['available_at'] = []
        for inv in inventories:
            data['available_at'].append({
                "pharmacy_name": inv.pharmacy.pharmacy_name,
                "pharmacy_id": inv.pharmacy.id,
                "district": inv.pharmacy.district,
                "state": inv.pharmacy.state,
                "latitude": inv.pharmacy.latitude,
                "longitude": inv.pharmacy.longitude,
                "quantity": inv.quantity,
                "price": inv.selling_price
            })
        return success_response(data=data)

class PublicPharmacyListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Only ACTIVE pharmacies
        pharmacies = Pharmacy.objects.filter(status=Pharmacy.Status.ACTIVE)
        serializer = PharmacySerializer(pharmacies, many=True)
        return success_response(data=serializer.data)

class PublicPharmacyDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        pharmacy = get_object_or_404(Pharmacy, pk=pk, status=Pharmacy.Status.ACTIVE)
        data = PharmacySerializer(pharmacy).data
        # Public generally wouldn't see full inventory but we can expose a few details or just basic info
        return success_response(data=data)
