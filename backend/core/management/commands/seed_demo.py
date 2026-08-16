import random
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from pharmacies.models import Pharmacy
from medicines.models import Medicine, Inventory, Batch, PriceHistory
from shortages.models import ShortageReport
from alerts.models import Alert

User = get_user_model()

MEDICINES = [
    {"medicine_name": "Paracetamol", "generic_name": "Acetaminophen", "category": "Analgesic"},
    {"medicine_name": "Amoxicillin", "generic_name": "Amoxicillin", "category": "Antibiotic"},
    {"medicine_name": "Azithromycin", "generic_name": "Azithromycin", "category": "Antibiotic"},
    {"medicine_name": "Ibuprofen", "generic_name": "Ibuprofen", "category": "NSAID"},
    {"medicine_name": "Metformin", "generic_name": "Metformin", "category": "Antidiabetic"},
    {"medicine_name": "Insulin", "generic_name": "Human Insulin", "category": "Antidiabetic"},
    {"medicine_name": "ORS", "generic_name": "Oral Rehydration Salts", "category": "Supplement"},
    {"medicine_name": "Amlodipine", "generic_name": "Amlodipine", "category": "Antihypertensive"},
    {"medicine_name": "Atorvastatin", "generic_name": "Atorvastatin", "category": "Statin"},
    {"medicine_name": "Cetirizine", "generic_name": "Cetirizine", "category": "Antihistamine"},
    {"medicine_name": "Pantoprazole", "generic_name": "Pantoprazole", "category": "Antacid"},
    {"medicine_name": "Salbutamol", "generic_name": "Albuterol", "category": "Bronchodilator"},
    {"medicine_name": "Doxycycline", "generic_name": "Doxycycline", "category": "Antibiotic"},
    {"medicine_name": "Cefixime", "generic_name": "Cefixime", "category": "Antibiotic"},
    {"medicine_name": "Losartan", "generic_name": "Losartan", "category": "Antihypertensive"},
    {"medicine_name": "Omeprazole", "generic_name": "Omeprazole", "category": "Antacid"}
]

class Command(BaseCommand):
    help = 'Seed the database with demo data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # 1. Accounts
        pharma_user, _ = User.objects.update_or_create(
            email="pharmacist@medcode.demo",
            defaults={
                "username": "pharmacist_demo",
                "full_name": "Demo Pharmacist",
                "role": "PHARMACIST",
            }
        )
        pharma_user.set_password("MedCode@12345!")
        pharma_user.save()

        gov_user, _ = User.objects.update_or_create(
            email="government@medcode.demo",
            defaults={
                "username": "government_demo",
                "full_name": "Government Officer",
                "role": "GOVERNMENT",
            }
        )
        gov_user.set_password("MedCode@12345!")
        gov_user.save()

        # 2. Pharmacy
        pharmacy, _ = Pharmacy.objects.update_or_create(
            owner=pharma_user,
            defaults={
                "pharmacy_name": "Demo Care Pharmacy",
                "license_number": "MH-CSP-2026-001",
                "address": "Main Street",
                "district": "Chhatrapati Sambhajinagar",
                "state": "Maharashtra",
                "pincode": "431001",
                "latitude": 19.8762,
                "longitude": 75.3433,
                "status": "ACTIVE"
            }
        )
        
        # Another pharmacy for government map demo
        other_pharma_user, _ = User.objects.update_or_create(
            email="pharma2@medcode.demo",
            defaults={
                "username": "other_demo",
                "full_name": "Other Pharmacist",
                "role": "PHARMACIST",
            }
        )
        other_pharma_user.set_password("MedCode@12345!")
        other_pharma_user.save()

        pharmacy2, _ = Pharmacy.objects.update_or_create(
            owner=other_pharma_user,
            defaults={
                "pharmacy_name": "City Health Pharmacy",
                "license_number": "MH-CSP-2026-002",
                "address": "Station Road",
                "district": "Pune",
                "state": "Maharashtra",
                "pincode": "411001",
                "latitude": 18.5204,
                "longitude": 73.8567,
                "status": "ACTIVE"
            }
        )

        # 3. Medicines
        med_objects = []
        for d in MEDICINES:
            med, _ = Medicine.objects.update_or_create(
                medicine_name=d["medicine_name"],
                defaults={
                    "generic_name": d["generic_name"],
                    "category": d["category"],
                    "manufacturer": "Pharma Corp"
                }
            )
            med_objects.append(med)

        # 4. Inventory & Batches
        Inventory.objects.all().delete()
        Batch.objects.all().delete()
        ShortageReport.objects.all().delete()
        Alert.objects.all().delete()

        for med in med_objects:
            q1 = random.choice([0, 2, 10, 50, 100])
            price = Decimal(str(random.randint(20, 200)))
            inv = Inventory.objects.create(
                pharmacy=pharmacy,
                medicine=med,
                quantity=q1,
                selling_price=price
            )
            PriceHistory.objects.create(pharmacy=pharmacy, medicine=med, price=price)

            q2 = random.choice([0, 5, 20, 60])
            Inventory.objects.create(
                pharmacy=pharmacy2,
                medicine=med,
                quantity=q2,
                selling_price=price * Decimal("1.2")  # higher price
            )
            
            Batch.objects.create(
                pharmacy=pharmacy,
                medicine=med,
                batch_number=f"B-{med.id}-{random.randint(100, 999)}",
                manufacturing_date=timezone.now().date() - timedelta(days=90),
                expiry_date=timezone.now().date() + timedelta(days=random.choice([10, 40, 100, 400])),
                quantity=q1
            )
            
            if q1 <= 5:
                # Severity
                sev = ShortageReport.Severity.CRITICAL if q1 == 0 else ShortageReport.Severity.LOW
                rep = ShortageReport.objects.create(
                    pharmacy=pharmacy,
                    medicine=med,
                    reported_quantity=q1,
                    severity=sev,
                    status=ShortageReport.Status.OPEN
                )
                Alert.objects.create(
                    alert_type=Alert.AlertType.SHORTAGE,
                    title=f"Shortage: {med.medicine_name}",
                    severity=sev,
                    medicine=med,
                    pharmacy=pharmacy,
                    state=pharmacy.state,
                    district=pharmacy.district
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))
