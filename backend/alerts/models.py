import uuid
from django.db import models
from medicines.models import Medicine
from pharmacies.models import Pharmacy

class Alert(models.Model):
    class Severity(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        CRITICAL = 'CRITICAL', 'Critical'
        
    class AlertType(models.TextChoices):
        SHORTAGE = 'SHORTAGE', 'Shortage'
        PRICE = 'PRICE', 'Price Anomaly'
        EXPIRY = 'EXPIRY', 'Expiry Warning'
        REPORT = 'REPORT', 'Shortage Report'
        OTHER = 'OTHER', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alert_type = models.CharField(max_length=20, choices=AlertType.choices, default=AlertType.OTHER)
    title = models.CharField(max_length=200)
    message = models.TextField()
    severity = models.CharField(max_length=20, choices=Severity.choices, default=Severity.LOW)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, null=True, blank=True, related_name='alerts')
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE, null=True, blank=True, related_name='alerts')
    state = models.CharField(max_length=100, null=True, blank=True)
    district = models.CharField(max_length=100, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
