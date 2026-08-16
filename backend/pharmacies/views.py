from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from core.responses import success_response, error_response, created_response
from accounts.permissions import IsPharmacist
from .models import Pharmacy
from .serializers import PharmacySerializer
from medicines.models import Inventory, Batch
from medicines.serializers import InventorySerializer, BatchSerializer
from shortages.models import ShortageReport
from shortages.serializers import ShortageReportSerializer
from alerts.models import Alert

class MyPharmacyView(APIView):
    permission_classes = [IsAuthenticated, IsPharmacist]

    def get_pharmacy(self, user):
        try:
            return user.pharmacy
        except Pharmacy.DoesNotExist:
            return None

    def get(self, request):
        pharmacy = self.get_pharmacy(request.user)
        if not pharmacy:
            return error_response("Pharmacy profile not found.", status_code=status.HTTP_404_NOT_FOUND)
            
        serializer = PharmacySerializer(pharmacy)
        return success_response(data=serializer.data, message="Pharmacy profile retrieved successfully.")

    def patch(self, request):
        pharmacy = self.get_pharmacy(request.user)
        if not pharmacy:
            return error_response("Pharmacy profile not found.", status_code=status.HTTP_404_NOT_FOUND)
            
        serializer = PharmacySerializer(pharmacy, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, message="Pharmacy profile updated successfully.")
        return error_response("Validation Error", errors=serializer.errors)

class InventoryListView(APIView):
    permission_classes = [IsAuthenticated, IsPharmacist]

    def get(self, request):
        try:
            inventory = Inventory.objects.filter(pharmacy=request.user.pharmacy).select_related('medicine')
            serializer = InventorySerializer(inventory, many=True)
            return success_response(data=serializer.data, message="Inventory retrieved.")
        except Exception as e:
            return error_response(str(e))

    def post(self, request):
        # expects medicine_id, quantity, selling_price
        # and attach pharmacy automatically
        data = request.data.copy()
        serializer = InventorySerializer(data=data)
        if serializer.is_valid():
            try:
                # Catch integrity error for unique constraint
                serializer.save(pharmacy=request.user.pharmacy)
                return created_response(data=serializer.data, message="Inventory created.")
            except Exception as e:
                return error_response("Inventory for this medicine might already exist.")
        return error_response("Validation Error", errors=serializer.errors)

class InventoryDetailView(APIView):
    permission_classes = [IsAuthenticated, IsPharmacist]

    def get_object(self, pk, user):
        return get_object_or_404(Inventory, pk=pk, pharmacy=user.pharmacy)

    def patch(self, request, pk):
        inventory = self.get_object(pk, request.user)
        serializer = InventorySerializer(inventory, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, message="Inventory updated.")
        return error_response("Validation Error", errors=serializer.errors)

    def delete(self, request, pk):
        inventory = self.get_object(pk, request.user)
        inventory.delete()
        return success_response(message="Inventory deleted.")

class BatchListView(APIView):
    permission_classes = [IsAuthenticated, IsPharmacist]

    def get(self, request):
        try:
            batches = Batch.objects.filter(pharmacy=request.user.pharmacy)
            serializer = BatchSerializer(batches, many=True)
            return success_response(data=serializer.data)
        except Exception as e:
            return error_response(str(e))

    def post(self, request):
        serializer = BatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(pharmacy=request.user.pharmacy)
            return created_response(data=serializer.data, message="Batch added.")
        return error_response("Validation Error", errors=serializer.errors)

class BatchDetailView(APIView):
    permission_classes = [IsAuthenticated, IsPharmacist]

    def get_object(self, pk, user):
        return get_object_or_404(Batch, pk=pk, pharmacy=user.pharmacy)
        
    def patch(self, request, pk):
        batch = self.get_object(pk, request.user)
        serializer = BatchSerializer(batch, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, message="Batch updated.")
        return error_response("Validation Error", errors=serializer.errors)

    def delete(self, request, pk):
        batch = self.get_object(pk, request.user)
        batch.delete()
        return success_response(message="Batch deleted.")

class ShortageListView(APIView):
    permission_classes = [IsAuthenticated, IsPharmacist]
    
    def get(self, request):
        try:
            shortages = ShortageReport.objects.filter(pharmacy=request.user.pharmacy).order_by('-created_at')
            serializer = ShortageReportSerializer(shortages, many=True)
            return success_response(data=serializer.data)
        except Exception as e:
            return error_response(str(e))

    def post(self, request):
        serializer = ShortageReportSerializer(data=request.data)
        if serializer.is_valid():
            report = serializer.save(pharmacy=request.user.pharmacy)
            # Create alert automatically
            Alert.objects.create(
                alert_type=Alert.AlertType.REPORT,
                title=f"Shortage Reported: {report.medicine.medicine_name}",
                message=f"{request.user.pharmacy.pharmacy_name} reported a shortage of {report.medicine.medicine_name} (Severity: {report.severity})",
                severity=report.severity,
                medicine=report.medicine,
                pharmacy=report.pharmacy,
                state=report.pharmacy.state,
                district=report.pharmacy.district,
            )
            return created_response(data=serializer.data, message="Shortage reported.")
        return error_response("Validation Error", errors=serializer.errors)

class ShortageDetailView(APIView):
    permission_classes = [IsAuthenticated, IsPharmacist]
    
    def patch(self, request, pk):
        report = get_object_or_404(ShortageReport, pk=pk, pharmacy=request.user.pharmacy)
        serializer = ShortageReportSerializer(report, data=request.data, partial=True)
        if serializer.is_valid():
            if serializer.validated_data.get('status') == ShortageReport.Status.RESOLVED:
                serializer.save(resolved_by=request.user)
            else:
                serializer.save()
            return success_response(data=serializer.data, message="Shortage report updated.")
        return error_response("Validation Error", errors=serializer.errors)