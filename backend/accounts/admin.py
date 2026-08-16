
# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "full_name",
        "role",
        "is_active",
    )

    list_filter = (
        "role",
        "is_active",
    )

    search_fields = (
        "username",
        "email",
        "full_name",
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            "MedCode Information",
            {
                "fields": (
                    "full_name",
                    "phone",
                    "role",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "MedCode Information",
            {
                "fields": (
                    "email",
                    "full_name",
                    "phone",
                    "role",
                )
            },
        ),
    )