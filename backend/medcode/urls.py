"""
MedCode URL Configuration
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    """Simple health check endpoint for testing connectivity."""
    return JsonResponse({
        "success": True,
        "message": "MedCode API is running",
        "version": "0.1.0",
        "status": "healthy",
    })


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/health/",
        include("core.urls"),
    ),

    path(
        "api/auth/",
        include("accounts.urls"),
    ),

    path(
        "api/pharmacy/",
        include("pharmacies.urls"),
    ),

    path(
        "api/medicines/",
        include("medicines.urls"),
    ),

    path(
        "api/government/",
        include("government.urls"),
    ),

    path(
        "api/public/",
        include("public_api.urls"),
    ),
]
