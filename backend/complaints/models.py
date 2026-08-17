import uuid
from django.db import models


class Complaint(models.Model):
    class ComplaintType(models.TextChoices):
        MEDICINE_UNAVAILABLE = 'MEDICINE_UNAVAILABLE', 'Medicine Unavailable'
        INCORRECT_PRICE = 'INCORRECT_PRICE', 'Incorrect Medicine Price'
        PHARMACY_ISSUE = 'PHARMACY_ISSUE', 'Pharmacy Issue'
        EXPIRED_MEDICINE = 'EXPIRED_MEDICINE', 'Expired Medicine'
        OTHER = 'OTHER', 'Other'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        RESOLVED = 'RESOLVED', 'Resolved'
        CLOSED = 'CLOSED', 'Closed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference_number = models.CharField(max_length=20, unique=True, editable=False)
    complaint_type = models.CharField(max_length=30, choices=ComplaintType.choices)
    medicine_name = models.CharField(max_length=255, blank=True, default='')
    pharmacy_name = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField()
    citizen_name = models.CharField(max_length=255, blank=True, default='')
    contact_number = models.CharField(max_length=20, blank=True, default='')
    location = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.reference_number:
            import datetime
            year = datetime.datetime.now().year
            count = Complaint.objects.count() + 1
            self.reference_number = f"MC-{year}-{count:06d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference_number} - {self.complaint_type}"
