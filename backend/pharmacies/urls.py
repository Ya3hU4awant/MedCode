from django.urls import path
from .views import (
    MyPharmacyView,
    InventoryListView,
    InventoryDetailView,
    BatchListView,
    BatchDetailView,
    ShortageListView,
    ShortageDetailView
)

urlpatterns = [
    path('profile/', MyPharmacyView.as_view(), name='pharmacy-profile'), # standard naming
    path('my-pharmacy/', MyPharmacyView.as_view(), name='my-pharmacy'),
    path('inventory/', InventoryListView.as_view(), name='inventory-list'),
    path('inventory/<uuid:pk>/', InventoryDetailView.as_view(), name='inventory-detail'),
    path('batches/', BatchListView.as_view(), name='batch-list'),
    path('batches/<uuid:pk>/', BatchDetailView.as_view(), name='batch-detail'),
    path('shortages/', ShortageListView.as_view(), name='shortage-list'),
    path('shortages/<uuid:pk>/', ShortageDetailView.as_view(), name='shortage-detail'),
]