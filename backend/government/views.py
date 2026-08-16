from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, Min, Max, F
from django.shortcuts import get_object_or_404
from rest_framework import status

from core.responses import success_response, error_response, created_response
from accounts.permissions import IsGovernment
from pharmacies.models import Pharmacy
from pharmacies.serializers import PharmacySerializer
from medicines.models import Medicine, Inventory, PriceHistory
from medicines.serializers import MedicineSerializer, InventorySerializer
from shortages.models import ShortageReport
from shortages.serializers import ShortageReportSerializer
from alerts.models import Alert
from alerts.serializers import AlertSerializer
from .models import GovernmentAction
from .serializers import GovernmentActionSerializer

class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsGovernment]

    def get(self, request):
        total_pharmacies = Pharmacy.objects.count()
        active_pharmacies = Pharmacy.objects.filter(status=Pharmacy.Status.ACTIVE).count()
        medicines_monitored = Medicine.objects.count()
        shortage_alerts = Alert.objects.filter(alert_type__in=[Alert.AlertType.SHORTAGE, Alert.AlertType.REPORT]).count()
        critical_shortages = ShortageReport.objects.filter(severity=ShortageReport.Severity.CRITICAL, status__in=[ShortageReport.Status.OPEN, ShortageReport.Status.ACKNOWLEDGED]).count()
        price_alerts = Alert.objects.filter(alert_type=Alert.AlertType.PRICE).count()
        
        # Simple stats for charts (shortage trend by severity)
        severity_breakdown = {
            'CRITICAL': Alert.objects.filter(severity=Alert.Severity.CRITICAL).count(),
            'HIGH': Alert.objects.filter(severity=Alert.Severity.HIGH).count(),
            'MEDIUM': Alert.objects.filter(severity=Alert.Severity.MEDIUM).count(),
            'LOW': Alert.objects.filter(severity=Alert.Severity.LOW).count(),
        }

        data = {
            "total_pharmacies": total_pharmacies,
            "active_pharmacies": active_pharmacies,
            "medicines_monitored": medicines_monitored,
            "shortage_alerts": shortage_alerts,
            "critical_shortages": critical_shortages,
            "price_alerts": price_alerts,
            "alert_severity_breakdown": severity_breakdown,
        }
        return success_response(data=data)

class PharmacyListView(APIView):
    permission_classes = [IsAuthenticated, IsGovernment]

    def get(self, request):
        pharmacies = Pharmacy.objects.all()
        # Optionally filter by state, district
        serializer = PharmacySerializer(pharmacies, many=True)
        return success_response(data=serializer.data)

class PharmacyDetailView(APIView):
    permission_classes = [IsAuthenticated, IsGovernment]

    def get(self, request, pk):
        pharmacy = get_object_or_404(Pharmacy, pk=pk)
        pharmacy_data = PharmacySerializer(pharmacy).data
        # also include inventory
        inventory = Inventory.objects.filter(pharmacy=pharmacy)
        pharmacy_data['inventory'] = InventorySerializer(inventory, many=True).data
        return success_response(data=pharmacy_data)

class ShortageListView(APIView):
    permission_classes = [IsAuthenticated, IsGovernment]

    def get(self, request):
        shortages = ShortageReport.objects.all().order_by('-created_at')
        serializer = ShortageReportSerializer(shortages, many=True)
        return success_response(data=serializer.data)

class AlertListView(APIView):
    permission_classes = [IsAuthenticated, IsGovernment]

    def get(self, request):
        alerts = Alert.objects.all().order_by('-created_at')
        serializer = AlertSerializer(alerts, many=True)
        return success_response(data=serializer.data)

class PriceMonitoringView(APIView):
    permission_classes = [IsAuthenticated, IsGovernment]

    def get(self, request):
        # Aggregate price variation across pharmacies
        medicines = Inventory.objects.values('medicine__id', 'medicine__medicine_name').annotate(
            avg_price=Avg('selling_price'),
            min_price=Min('selling_price'),
            max_price=Max('selling_price'),
            pharmacies_affected=Count('pharmacy', distinct=True)
        )
        
        results = []
        for item in medicines:
            avg_price = item['avg_price'] or 0
            min_price = item['min_price'] or 0
            max_price = item['max_price'] or 0
            
            # basic variation calc
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
                
            results.append({
                "medicine_id": item['medicine__id'],
                "medicine_name": item['medicine__medicine_name'],
                "avg_price": float(avg_price),
                "min_price": float(min_price),
                "max_price": float(max_price),
                "price_variation": float(variation),
                "pharmacies_affected": item['pharmacies_affected'],
                "risk": risk
            })
            
        # sorts by variation descending
        results.sort(key=lambda x: x["price_variation"], reverse=True)
        return success_response(data=results)

class ActionCreateView(APIView):
    permission_classes = [IsAuthenticated, IsGovernment]

    def post(self, request):
        serializer = GovernmentActionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(government_user=request.user)
            # Update alert status or shortage report status if needed
            return created_response(data=serializer.data, message="Action recorded.")
        return error_response("Validation Error", errors=serializer.errors)
