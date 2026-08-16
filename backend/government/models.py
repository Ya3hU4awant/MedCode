import uuid
from django.db import models
from django.conf import settings
from alerts.models import Alert

class GovernmentAction(models.Model):
    class ActionType(models.TextChoices):
        ACKNOWLEDGE = 'ACKNOWLEDGE', 'Acknowledge'
        INVESTIGATE = 'INVESTIGATE', 'Investigate'
        CONTACT_PHARMACY = 'CONTACT_PHARMACY', 'Contact Pharmacy'
        REDISTRIBUTE = 'REDISTRIBUTE', 'Redistribute'
        RESOLVE = 'RESOLVE', 'Resolve'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE, related_name='government_actions')
    government_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='government_actions')
    action_type = models.CharField(max_length=30, choices=ActionType.choices)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action_type} for Alert {self.alert.id}"
