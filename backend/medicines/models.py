
# Create your models here.
import uuid

from django.db import models


class Medicine(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    medicine_name = models.CharField(
        max_length=200,
        db_index=True,
    )

    generic_name = models.CharField(
        max_length=200,
        blank=True,
    )

    category = models.CharField(
        max_length=100,
        blank=True,
    )

    manufacturer = models.CharField(
        max_length=200,
        blank=True,
    )

    unit = models.CharField(
        max_length=50,
        default="unit",
    )

    description = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.medicine_name

class Inventory(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    pharmacy = models.ForeignKey(
        "pharmacies.Pharmacy",
        on_delete=models.CASCADE,
        related_name="inventory",
    )

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        related_name="inventory_records",
    )

    quantity = models.PositiveIntegerField(default=0)

    selling_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["pharmacy", "medicine"],
                name="unique_pharmacy_medicine_inventory",
            )
        ]

    def __str__(self):
        return (
            f"{self.pharmacy.pharmacy_name} - "
            f"{self.medicine.medicine_name}"
        )

class Batch(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    pharmacy = models.ForeignKey(
        "pharmacies.Pharmacy",
        on_delete=models.CASCADE,
        related_name="batches",
    )

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        related_name="batches",
    )

    batch_number = models.CharField(max_length=100)

    manufacturing_date = models.DateField()

    expiry_date = models.DateField()

    quantity = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.medicine.medicine_name} - {self.batch_number}"

class PriceHistory(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    pharmacy = models.ForeignKey(
        "pharmacies.Pharmacy",
        on_delete=models.CASCADE,
        related_name="price_history",
    )

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        related_name="price_history",
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.medicine.medicine_name} - "
            f"₹{self.price}"
        )