"""
MedCode URL Configuration
"""

from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # Health check
    path(
        "api/health/",
        include("core.urls"),
    ),

    # Authentication
    path(
        "api/auth/",
        include("accounts.urls"),
    ),

    # Pharmacist / Pharmacy
    path(
        "api/pharmacy/",
        include("pharmacies.urls"),
    ),

    # Medicines & Inventory
    path(
        "api/medicines/",
        include("medicines.urls"),
    ),

    # Government Dashboard
    path(
        "api/government/",
        include("government.urls"),
    ),

    # Citizen / Public APIs
    path(
        "api/public/",
        include("public_api.urls"),
    ),

    # Citizen Complaints
    path(
        "api/complaints/",
        include("complaints.urls"),
    ),
]