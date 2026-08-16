from django.urls import path
from .views import (
    DashboardView,
    PharmacyListView,
    PharmacyDetailView,
    ShortageListView,
    AlertListView,
    PriceMonitoringView,
    ActionCreateView
)

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='gov-dashboard'),
    path('pharmacies/', PharmacyListView.as_view(), name='gov-pharmacies'),
    path('pharmacies/<uuid:pk>/', PharmacyDetailView.as_view(), name='gov-pharmacy-detail'),
    path('shortages/', ShortageListView.as_view(), name='gov-shortages'),
    path('alerts/', AlertListView.as_view(), name='gov-alerts'),
    path('prices/', PriceMonitoringView.as_view(), name='gov-prices'),
    path('actions/', ActionCreateView.as_view(), name='gov-actions'),
]
