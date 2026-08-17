from django.contrib import admin
from .models import Complaint


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['reference_number', 'complaint_type', 'status', 'created_at']
    list_filter = ['complaint_type', 'status']
    search_fields = ['reference_number', 'medicine_name', 'pharmacy_name', 'citizen_name']
    readonly_fields = ['id', 'reference_number', 'created_at']
