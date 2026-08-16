from django.urls import path
from .views import MedicineListView, MedicineDetailView

urlpatterns = [
    path('', MedicineListView.as_view(), name='medicine-list'),
    path('<uuid:pk>/', MedicineDetailView.as_view(), name='medicine-detail'),
]
