from django.urls import path
from .views import (
    PublicMedicineListView,
    PublicMedicineDetailView,
    PublicPharmacyListView,
    PublicPharmacyDetailView
)

urlpatterns = [
    path('medicines/', PublicMedicineListView.as_view(), name='public-medicines'),
    path('medicines/<uuid:pk>/', PublicMedicineDetailView.as_view(), name='public-medicine-detail'),
    path('pharmacies/', PublicPharmacyListView.as_view(), name='public-pharmacies'),
    path('pharmacies/<uuid:pk>/', PublicPharmacyDetailView.as_view(), name='public-pharmacy-detail'),
]
