from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, UserSerializer, PharmacistRegisterSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "data": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserSerializer(user).data,
                },
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "success": True,
                "message": "User retrieved successfully.",
                "data": UserSerializer(request.user).data,
            },
            status=status.HTTP_200_OK,
        )


class RegisterPharmacistView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PharmacistRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        from django.contrib.auth import get_user_model
        from pharmacies.models import Pharmacy

        User = get_user_model()

        # Build unique username from email prefix
        base_username = data["email"].split("@")[0]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=data["email"],
            password=data["password"],
            full_name=data["full_name"],
            phone=data["phone"],
            role="PHARMACIST",
            is_active=True,
        )

        Pharmacy.objects.create(
            owner=user,
            pharmacy_name=data["pharmacy_name"],
            license_number=data["license_number"],
            address=data["address"],
            district=data["district"],
            state=data["state"],
            pincode=data["pincode"],
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            status="PENDING",
        )

        return Response(
            {
                "success": True,
                "message": "Pharmacist account created successfully. Your pharmacy is pending verification.",
                "data": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )