from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pharmacy
from .serializers import PharmacySerializer


class MyPharmacyView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "PHARMACIST":
            return Response(
                {
                    "success": False,
                    "message": "Only pharmacists can access this endpoint.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            pharmacy = request.user.pharmacy
        except Pharmacy.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Pharmacy profile not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PharmacySerializer(pharmacy)

        return Response(
            {
                "success": True,
                "message": "Pharmacy profile retrieved successfully.",
                "data": serializer.data,
            }
        )