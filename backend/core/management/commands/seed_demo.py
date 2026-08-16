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
    {"medicine_name": "Paracetamol 500mg", "generic_name": "Acetaminophen", "category": "Analgesic", "manufacturer": "Sun Pharma"},
    {"medicine_name": "Amoxicillin 500mg", "generic_name": "Amoxicillin", "category": "Antibiotic", "manufacturer": "Cipla"},
    {"medicine_name": "Azithromycin 250mg", "generic_name": "Azithromycin", "category": "Antibiotic", "manufacturer": "Dr Reddy's"},
    {"medicine_name": "Ibuprofen 400mg", "generic_name": "Ibuprofen", "category": "NSAID", "manufacturer": "Alkem"},
    {"medicine_name": "Metformin 500mg", "generic_name": "Metformin HCl", "category": "Antidiabetic", "manufacturer": "Lupin"},
    {"medicine_name": "Insulin (Regular)", "generic_name": "Human Insulin", "category": "Antidiabetic", "manufacturer": "Novo Nordisk"},
    {"medicine_name": "ORS Sachet", "generic_name": "Oral Rehydration Salts", "category": "Supplement", "manufacturer": "Govt. Supply"},
    {"medicine_name": "Amlodipine 5mg", "generic_name": "Amlodipine Besylate", "category": "Antihypertensive", "manufacturer": "Torrent"},
    {"medicine_name": "Atorvastatin 10mg", "generic_name": "Atorvastatin Calcium", "category": "Statin", "manufacturer": "Zydus"},
    {"medicine_name": "Cetirizine 10mg", "generic_name": "Cetirizine HCl", "category": "Antihistamine", "manufacturer": "Glenmark"},
    {"medicine_name": "Pantoprazole 40mg", "generic_name": "Pantoprazole", "category": "Proton Pump Inhibitor", "manufacturer": "Alkem"},
    {"medicine_name": "Salbutamol Inhaler", "generic_name": "Albuterol", "category": "Bronchodilator", "manufacturer": "Sun Pharma"},
    {"medicine_name": "Doxycycline 100mg", "generic_name": "Doxycycline Hyclate", "category": "Antibiotic", "manufacturer": "Cipla"},
    {"medicine_name": "Cefixime 200mg", "generic_name": "Cefixime", "category": "Antibiotic", "manufacturer": "Mankind"},
    {"medicine_name": "Losartan 50mg", "generic_name": "Losartan Potassium", "category": "Antihypertensive", "manufacturer": "Glenmark"},
    {"medicine_name": "Omeprazole 20mg", "generic_name": "Omeprazole", "category": "Antacid", "manufacturer": "Torrent"},
    {"medicine_name": "Metronidazole 400mg", "generic_name": "Metronidazole", "category": "Antibiotic", "manufacturer": "Abbott"},
    {"medicine_name": "Vitamin D3 1000IU", "generic_name": "Cholecalciferol", "category": "Supplement", "manufacturer": "Elder"},
    {"medicine_name": "Lisinopril 10mg", "generic_name": "Lisinopril", "category": "Antihypertensive", "manufacturer": "Sun Pharma"},
    {"medicine_name": "Enalapril 5mg", "generic_name": "Enalapril Maleate", "category": "ACE Inhibitor", "manufacturer": "Lupin"},
]

# 20 demo pharmacies around Chhatrapati Sambhajinagar (CSN), Maharashtra
PHARMACIES = [
    {"name": "MedCare Pharmacy",          "license": "MH-CSN-2026-001", "address": "Station Road, CSN",           "district": "Chhatrapati Sambhajinagar", "pincode": "431001", "lat": 19.8762, "lng": 75.3433},
    {"name": "City Health Pharmacy",       "license": "MH-CSN-2026-002", "address": "Aurangpura, CSN",              "district": "Chhatrapati Sambhajinagar", "pincode": "431001", "lat": 19.8780, "lng": 75.3380},
    {"name": "Jeevan Medicals",            "license": "MH-CSN-2026-003", "address": "Nirala Bazaar, CSN",           "district": "Chhatrapati Sambhajinagar", "pincode": "431001", "lat": 19.8710, "lng": 75.3500},
    {"name": "Aarogya Pharmacy",           "license": "MH-CSN-2026-004", "address": "City Chowk, CSN",              "district": "Chhatrapati Sambhajinagar", "pincode": "431001", "lat": 19.8690, "lng": 75.3420},
    {"name": "Sai Medical Store",          "license": "MH-CSN-2026-005", "address": "Kranti Chowk, CSN",            "district": "Chhatrapati Sambhajinagar", "pincode": "431005", "lat": 19.8750, "lng": 75.3350},
    {"name": "LifeLine Pharma",            "license": "MH-CSN-2026-006", "address": "Garkheda, CSN",                "district": "Chhatrapati Sambhajinagar", "pincode": "431009", "lat": 19.8610, "lng": 75.3600},
    {"name": "Sunrise Medicals",           "license": "MH-CSN-2026-007", "address": "CIDCO N-2, CSN",               "district": "Chhatrapati Sambhajinagar", "pincode": "431003", "lat": 19.8830, "lng": 75.3310},
    {"name": "Wellness Pharmacy",          "license": "MH-CSN-2026-008", "address": "Padegaon, CSN",                "district": "Chhatrapati Sambhajinagar", "pincode": "431005", "lat": 19.8650, "lng": 75.3280},
    {"name": "JanAushadhi Care",           "license": "MH-CSN-2026-009", "address": "MGM Hospital Road, CSN",       "district": "Chhatrapati Sambhajinagar", "pincode": "431003", "lat": 19.8920, "lng": 75.3450},
    {"name": "HealthFirst Pharmacy",       "license": "MH-CSN-2026-010", "address": "Osmanpura, CSN",               "district": "Chhatrapati Sambhajinagar", "pincode": "431005", "lat": 19.8860, "lng": 75.3520},
    {"name": "Shree Medicals",             "license": "MH-CSN-2026-011", "address": "Mukundwadi, CSN",              "district": "Chhatrapati Sambhajinagar", "pincode": "431008", "lat": 19.8580, "lng": 75.3680},
    {"name": "Guardian Pharmacy",          "license": "MH-CSN-2026-012", "address": "Waluj MIDC Area, CSN",         "district": "Chhatrapati Sambhajinagar", "pincode": "431136", "lat": 19.8540, "lng": 75.3750},
    {"name": "Hope Healthcare",            "license": "MH-CSN-2026-013", "address": "Cantonment, CSN",              "district": "Chhatrapati Sambhajinagar", "pincode": "431002", "lat": 19.8950, "lng": 75.3380},
    {"name": "CityMed Pharmacy",           "license": "MH-CSN-2026-014", "address": "TV Centre, CSN",               "district": "Chhatrapati Sambhajinagar", "pincode": "431001", "lat": 19.8720, "lng": 75.3260},
    {"name": "CarePlus Medicals",          "license": "MH-CSN-2026-015", "address": "Bajajnagar, CSN",              "district": "Chhatrapati Sambhajinagar", "pincode": "431136", "lat": 19.8490, "lng": 75.3820},
    {"name": "Aarogya Life Pharmacy",      "license": "MH-CSN-2026-016", "address": "Gut Road, CSN",                "district": "Chhatrapati Sambhajinagar", "pincode": "431007", "lat": 19.8430, "lng": 75.3700},
    {"name": "MedPoint Pharmacy",          "license": "MH-CSN-2026-017", "address": "Harsul, CSN",                  "district": "Chhatrapati Sambhajinagar", "pincode": "431007", "lat": 19.8380, "lng": 75.3550},
    {"name": "Royal Medicals",             "license": "MH-CSN-2026-018", "address": "Paithan Road, CSN",            "district": "Chhatrapati Sambhajinagar", "pincode": "431010", "lat": 19.8310, "lng": 75.3480},
    {"name": "GreenCross Pharmacy",        "license": "MH-CSN-2026-019", "address": "Beed Bypass Road, CSN",        "district": "Chhatrapati Sambhajinagar", "pincode": "431005", "lat": 19.8270, "lng": 75.3580},
    {"name": "VitalCare Pharmacy",         "license": "MH-CSN-2026-020", "address": "Chikalthana, CSN",             "district": "Chhatrapati Sambhajinagar", "pincode": "431210", "lat": 19.8200, "lng": 75.3750},
]


class Command(BaseCommand):
    help = 'Seed the database with 20 demo pharmacies and comprehensive data'

    def handle(self, *args, **kwargs):
        self.stdout.write("--- Seeding MedCode demo database ---")

        # ── 1. Core demo users ─────────────────────────────────────────
        gov_user, _ = User.objects.update_or_create(
            email="government@medcode.demo",
            defaults={
                "username": "government_demo",
                "full_name": "Government Officer",
                "role": "GOVERNMENT",
                "is_active": True,
                "phone": "9876543211",
            }
        )
        gov_user.set_password("MedCode@12345!")
        gov_user.save()
        self.stdout.write("  [ok] Government user")

        pharma_main, _ = User.objects.update_or_create(
            email="pharmacist@medcode.demo",
            defaults={
                "username": "pharmacist_demo",
                "full_name": "Demo Pharmacist",
                "role": "PHARMACIST",
                "is_active": True,
                "phone": "9876543210",
            }
        )
        pharma_main.set_password("MedCode@12345!")
        pharma_main.save()
        self.stdout.write("  [ok] Primary pharmacist user")

        # ── 2. Medicines ───────────────────────────────────────────────
        med_objects = []
        for d in MEDICINES:
            med, _ = Medicine.objects.update_or_create(
                medicine_name=d["medicine_name"],
                defaults={
                    "generic_name": d["generic_name"],
                    "category": d["category"],
                    "manufacturer": d["manufacturer"],
                }
            )
            med_objects.append(med)
        self.stdout.write(f"  [ok] {len(med_objects)} medicines")

        # ── 3. 20 Pharmacies + owners ──────────────────────────────────
        # Clear pharmacy-linked transactional data first
        Inventory.objects.all().delete()
        Batch.objects.all().delete()
        ShortageReport.objects.all().delete()
        Alert.objects.all().delete()
        PriceHistory.objects.all().delete()
        Pharmacy.objects.all().delete()  # safe now – no FK cascades remaining

        pharmacy_objects = []
        for idx, p in enumerate(PHARMACIES, start=1):
            if idx == 1:
                # Primary demo pharmacist owns the first pharmacy
                owner = pharma_main
            else:
                email = f"pharmacy{idx:02d}@medcode.demo"
                username = f"pharmacy{idx:02d}"
                owner, _ = User.objects.update_or_create(
                    email=email,
                    defaults={
                        "username": username,
                        "full_name": f"Pharmacist {idx:02d}",
                        "role": "PHARMACIST",
                        "is_active": True,
                    }
                )
                owner.set_password("MedCode@12345!")
                owner.save()

            status_choice = "ACTIVE" if idx <= 16 else ("PENDING" if idx <= 18 else "INACTIVE")
            pharm, _ = Pharmacy.objects.update_or_create(
                license_number=p["license"],
                defaults={
                    "owner": owner,
                    "pharmacy_name": p["name"],
                    "address": p["address"],
                    "district": p["district"],
                    "state": "Maharashtra",
                    "pincode": p["pincode"],
                    "latitude": p["lat"],
                    "longitude": p["lng"],
                    "phone": f"963000{idx:04d}",
                    "status": status_choice,
                }
            )
            pharmacy_objects.append(pharm)
        self.stdout.write(f"  [ok] {len(pharmacy_objects)} pharmacies")

        shortage_count = 0
        alert_count = 0

        for pharm in pharmacy_objects:
            is_active = (pharm.status == "ACTIVE")
            num_meds = random.randint(14, 20) if is_active else random.randint(5, 12)
            chosen_meds = random.sample(med_objects, num_meds)

            for i, med in enumerate(chosen_meds):
                # Quantities vary to tell a story
                if i < 3:
                    qty = random.choice([0, 2, 4])  # critical/out
                elif i < 6:
                    qty = random.choice([5, 8, 12])  # low
                else:
                    qty = random.choice([25, 50, 80, 120])  # healthy

                base_price = Decimal(str(random.randint(15, 250)))
                variation = Decimal(str(random.uniform(0.9, 1.4)))
                sell_price = (base_price * variation).quantize(Decimal("0.01"))

                inv = Inventory.objects.create(
                    pharmacy=pharm,
                    medicine=med,
                    quantity=qty,
                    selling_price=sell_price,
                )
                PriceHistory.objects.create(
                    pharmacy=pharm,
                    medicine=med,
                    price=sell_price,
                )

                # Batch
                days_to_expiry = random.choice([-30, 15, 45, 90, 200, 400])
                pid = str(pharm.id)[:4].upper()
                mid = str(med.id)[:4].upper()
                Batch.objects.create(
                    pharmacy=pharm,
                    medicine=med,
                    batch_number=f"B{pid}{mid}{i}",
                    manufacturing_date=timezone.now().date() - timedelta(days=180),
                    expiry_date=timezone.now().date() + timedelta(days=days_to_expiry),
                    quantity=qty,
                )

                # Shortages for critical stocks in active pharmacies
                if qty <= 4 and is_active:
                    sev = ShortageReport.Severity.CRITICAL if qty == 0 else ShortageReport.Severity.HIGH
                    rep = ShortageReport.objects.create(
                        pharmacy=pharm,
                        medicine=med,
                        reported_quantity=qty,
                        severity=sev,
                        status=ShortageReport.Status.OPEN,
                        description=f"Stock critically low at {pharm.pharmacy_name}.",
                    )
                    Alert.objects.create(
                        alert_type=Alert.AlertType.SHORTAGE,
                        title=f"Shortage Alert: {med.medicine_name}",
                        message=f"{pharm.pharmacy_name} ({pharm.district}) reports only {qty} units of {med.medicine_name}.",
                        severity=sev,
                        medicine=med,
                        pharmacy=pharm,
                        state=pharm.state,
                        district=pharm.district,
                    )
                    shortage_count += 1
                    alert_count += 1

        self.stdout.write(f"  [ok] Inventory and batches seeded")
        self.stdout.write(f"  [ok] {shortage_count} shortage reports created")
        self.stdout.write(f"  [ok] {alert_count} alerts created")
        self.stdout.write(self.style.SUCCESS("\nMedCode demo database seeded successfully!\n"))
        self.stdout.write("  Government:   government@medcode.demo  / MedCode@12345!")
        self.stdout.write("  Pharmacist:   pharmacist@medcode.demo  / MedCode@12345!")
