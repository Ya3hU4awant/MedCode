from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q, Avg, Min, Max, Count, Sum

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
        return success_response(data=data)


class PublicPriceIntelligenceView(APIView):
    """Public price intelligence - same data as government prices, no auth needed."""
    permission_classes = [AllowAny]

    def get(self, request):
        search_term = request.query_params.get('search', None)

        medicines = Inventory.objects.values(
            'medicine__id', 'medicine__medicine_name'
        ).annotate(
            avg_price=Avg('selling_price'),
            min_price=Min('selling_price'),
            max_price=Max('selling_price'),
            pharmacies_count=Count('pharmacy', distinct=True),
            total_stock=Sum('quantity'),
        )

        results = []
        for item in medicines:
            name = item['medicine__medicine_name'] or ''
            if search_term and search_term.lower() not in name.lower():
                continue

            avg_price = item['avg_price'] or 0
            min_price = item['min_price'] or 0
            max_price = item['max_price'] or 0
            total_stock = item['total_stock'] or 0

            variation = 0
            if min_price > 0:
                variation = ((max_price - min_price) / min_price) * 100

            risk = "Normal"
            if variation > 50:
                risk = "Critical"
            elif variation > 25:
                risk = "High"
            elif variation > 10:
                risk = "Watch"

            if total_stock == 0:
                availability = "Out of Stock"
            elif total_stock <= 10:
                availability = "Low Stock"
            else:
                availability = "Available"

            results.append({
                "medicine_id": str(item['medicine__id']),
                "medicine_name": name,
                "avg_price": float(avg_price),
                "min_price": float(min_price),
                "max_price": float(max_price),
                "price_variation": float(variation),
                "pharmacies_count": item['pharmacies_count'],
                "total_stock": total_stock,
                "availability": availability,
                "risk": risk,
            })

        results.sort(key=lambda x: x["medicine_name"])
        return success_response(data=results)
