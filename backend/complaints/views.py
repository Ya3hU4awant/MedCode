from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.responses import success_response, error_response, created_response
from accounts.permissions import IsGovernment
from .models import Complaint
from .serializers import ComplaintSerializer, ComplaintListSerializer


class PublicComplaintCreateView(APIView):
    """Allow anyone (citizen) to submit a complaint - no auth required."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ComplaintSerializer(data=request.data)
        if serializer.is_valid():
            complaint = serializer.save()
            return created_response(
                data={
                    'reference_number': complaint.reference_number,
                    'id': str(complaint.id),
                    'status': complaint.status,
                    'created_at': complaint.created_at.isoformat(),
                },
                message="Complaint submitted successfully."
            )
        return error_response("Validation Error", errors=serializer.errors)


class GovernmentComplaintListView(APIView):
    """Government can view all complaints."""
    permission_classes = [IsAuthenticated, IsGovernment]

    def get(self, request):
        status_filter = request.query_params.get('status', None)
        complaints = Complaint.objects.all()
        if status_filter:
            complaints = complaints.filter(status=status_filter)
        serializer = ComplaintListSerializer(complaints, many=True)
        
        # Also return summary counts
        summary = {
            'total': Complaint.objects.count(),
            'pending': Complaint.objects.filter(status='PENDING').count(),
            'in_progress': Complaint.objects.filter(status='IN_PROGRESS').count(),
            'resolved': Complaint.objects.filter(status='RESOLVED').count(),
        }
        
        return success_response(data={
            'complaints': serializer.data,
            'summary': summary,
        })
