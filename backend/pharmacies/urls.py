from django.urls import path

from .views import MyPharmacyView


urlpatterns = [
    path(
        "my-pharmacy/",
        MyPharmacyView.as_view(),
        name="my-pharmacy",
    ),
]