from django.urls import path
from .views import PublicComplaintCreateView, GovernmentComplaintListView

urlpatterns = [
    path('submit/', PublicComplaintCreateView.as_view(), name='public-complaint-submit'),
    path('government/', GovernmentComplaintListView.as_view(), name='gov-complaints'),
]
