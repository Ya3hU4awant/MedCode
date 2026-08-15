# MEDCODE — PHASE 0: PROJECT PLANNING

> **Medicine Shortage & Price Monitoring System**
> Date: 2026-08-15
> Status: Planning Complete — Awaiting Phase 1 Approval

---

## 1. PROJECT OVERVIEW

MedCode is a centralized medicine shortage and price monitoring platform that connects **pharmacy-level inventory data** with a **government monitoring and response layer**. It is NOT a standalone pharmacy management system — it is a coordination network.

### Core Value Proposition

```
Pharmacy Data + Government Oversight = Early Warning + Fair Distribution + Price Transparency
```

### Key Differentiator

Existing pharmacy software manages individual pharmacies. MedCode aggregates pharmacy-level data to enable government-level shortage detection, price monitoring, and coordinated response.

---

## 2. SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│          React + TypeScript + Vite + Tailwind             │
│          shadcn/ui + Recharts + React Leaflet             │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Public   │  │  Auth    │  │Pharmacist│  │Government│ │
│  │  Portal   │  │  Pages   │  │  Module  │  │  Module  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │ REST API (JSON over HTTPS)
                         │ JWT Authentication
┌────────────────────────┴─────────────────────────────────┐
│                      BACKEND                             │
│            Python + Django + DRF                          │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Auth    │  │Pharmacies│  │Medicines │  │Shortages │ │
│  │  App     │  │  App     │  │  App     │  │  App     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │Government│  │  Alerts  │  │ Public   │               │
│  │  App     │  │  App     │  │  App     │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                          │
│         Services Layer (Business Logic)                   │
│    shortage_detection / price_analysis / demand           │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────┐
│                    DATABASE                              │
│             Supabase PostgreSQL                          │
│          + Supabase Storage (optional)                   │
│          + Supabase Realtime (selective)                  │
└──────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Separation of Concerns**: Frontend handles UI, Backend handles business logic, Database handles persistence.
2. **Django Apps = Domain Boundaries**: Each Django app maps to a business domain.
3. **Service Layer**: Complex business logic (shortage detection, price analysis) lives in dedicated service modules, NOT in views.
4. **JWT-Based Stateless Auth**: Frontend stores JWT tokens; backend validates on every request.
5. **Role-Based Access Control**: Every API endpoint checks user role (PHARMACIST / GOVERNMENT).
6. **Privacy by Design**: Government sees aggregated data; sensitive details stay at pharmacy level.

---

## 3. FOLDER STRUCTURE

```
MedCode/
│
├── frontend/                          # React + Vite Application
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/                    # Static assets (logos, images)
│   │   ├── components/                # Reusable UI components
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── layout/                # Sidebar, Topbar, Layout wrappers
│   │   │   ├── common/                # Cards, Badges, StatusIndicator, etc.
│   │   │   ├── charts/                # Recharts wrappers
│   │   │   └── map/                   # React Leaflet map components
│   │   ├── pages/                     # Page-level components
│   │   │   ├── public/                # Home, MedicineSearch, PharmacyMap
│   │   │   ├── auth/                  # Login
│   │   │   ├── pharmacist/            # Dashboard, Inventory, Reports, etc.
│   │   │   └── government/            # Dashboard, Monitoring, Map, Actions
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── services/                  # API service functions
│   │   │   └── api.ts                 # Axios/fetch configuration
│   │   ├── context/                   # React Context (Auth, Theme)
│   │   ├── types/                     # TypeScript type definitions
│   │   ├── utils/                     # Utility functions
│   │   ├── constants/                 # App constants, config
│   │   ├── App.tsx                    # Main App with routing
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Global styles + design tokens
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                           # Django Application
│   ├── medcode/                       # Django project config
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── accounts/                      # User auth & roles
│   │   ├── models.py                  # Custom User model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py             # IsPharmacist, IsGovernment
│   │   └── admin.py
│   ├── pharmacies/                    # Pharmacy management
│   │   ├── models.py                  # Pharmacy model
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── medicines/                     # Medicine catalog & inventory
│   │   ├── models.py                  # Medicine, Inventory, Batch, PriceHistory
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── shortages/                     # Shortage reports & detection
│   │   ├── models.py                  # ShortageReport, DemandData
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services/                  # Business logic
│   │   │   ├── detection.py           # Rule-based shortage detection
│   │   │   └── prediction.py          # Stock depletion estimation
│   │   └── admin.py
│   ├── alerts/                        # Alert & notification system
│   │   ├── models.py                  # Alert, Notification
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── government/                    # Government actions & monitoring
│   │   ├── models.py                  # GovernmentAction
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services/                  # Price analysis, aggregation
│   │   │   └── price_analysis.py
│   │   └── admin.py
│   ├── public_api/                    # Public endpoints (no auth required)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── core/                          # Shared utilities
│   │   ├── utils.py
│   │   ├── pagination.py
│   │   └── responses.py              # Consistent API response format
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── seed_data.py                   # Demo data seeder (Phase 16)
│
├── .gitignore
├── README.md
└── PHASE0_PLAN.md                     # This file
```

---

## 4. DATABASE ENTITY PLAN

### Entity Relationship Overview

```
User (Custom)
 ├── 1:1 ── Pharmacy (if role=PHARMACIST)
 │            ├── 1:N ── Inventory ──── N:1 ── Medicine
 │            ├── 1:N ── Batch ──────── N:1 ── Medicine
 │            ├── 1:N ── PriceHistory ─ N:1 ── Medicine
 │            ├── 1:N ── ShortageReport ─ N:1 ── Medicine
 │            └── 1:N ── DemandData ──── N:1 ── Medicine
 │
 └── (if role=GOVERNMENT) ── reads aggregated data

Alert ── N:1 ── Medicine (optional)
GovernmentAction ── N:1 ── Alert
Notification ── N:1 ── User (recipient)
```

### Table Definitions (Planned)

#### `User` (extends Django AbstractUser)

| Field       | Type         | Notes                           |
|-------------|-------------|----------------------------------|
| id          | UUID (PK)   | Auto-generated                   |
| email       | Email        | Unique, used for login           |
| full_name   | CharField    |                                  |
| role        | CharField    | PHARMACIST / GOVERNMENT          |
| phone       | CharField    | Optional                         |
| is_active   | Boolean      | Default True                     |
| created_at  | DateTime     | Auto                             |
| updated_at  | DateTime     | Auto                             |

#### `Pharmacy`

| Field            | Type         | Notes                        |
|-----------------|-------------|-------------------------------|
| id              | UUID (PK)   |                               |
| owner           | FK → User   | OneToOne                      |
| pharmacy_name   | CharField    |                               |
| license_number  | CharField    | Unique                        |
| address         | TextField    |                               |
| district        | CharField    |                               |
| state           | CharField    |                               |
| pincode         | CharField    |                               |
| latitude        | Decimal      |                               |
| longitude       | Decimal      |                               |
| phone           | CharField    |                               |
| status          | CharField    | ACTIVE / INACTIVE / SUSPENDED |
| created_at      | DateTime     |                               |
| updated_at      | DateTime     |                               |

#### `Medicine`

| Field          | Type         | Notes                          |
|---------------|-------------|--------------------------------|
| id            | UUID (PK)   |                                |
| medicine_name | CharField    |                                |
| generic_name  | CharField    |                                |
| category      | CharField    | e.g., Endocrine, Cardiac, etc. |
| manufacturer  | CharField    |                                |
| unit          | CharField    | e.g., tablet, vial, strip      |
| description   | TextField    | Optional                       |
| reference_price| Decimal     | Baseline price for comparison  |
| created_at    | DateTime     |                                |

#### `Inventory`

| Field         | Type         | Notes                        |
|--------------|-------------|-------------------------------|
| id           | UUID (PK)   |                               |
| pharmacy     | FK → Pharmacy|                              |
| medicine     | FK → Medicine|                              |
| quantity     | Integer      | Current stock count           |
| selling_price| Decimal      | Current selling price         |
| reorder_level| Integer      | Low-stock threshold           |
| updated_at   | DateTime     |                               |

*Unique constraint on (pharmacy, medicine)*

#### `Batch`

| Field              | Type         | Notes               |
|-------------------|-------------|----------------------|
| id                | UUID (PK)   |                      |
| pharmacy          | FK → Pharmacy|                     |
| medicine          | FK → Medicine|                     |
| batch_number      | CharField    |                      |
| manufacturing_date| Date         |                      |
| expiry_date       | Date         |                      |
| quantity          | Integer      |                      |
| created_at        | DateTime     |                      |

#### `PriceHistory`

| Field       | Type          | Notes                  |
|------------|--------------|------------------------|
| id         | UUID (PK)    |                        |
| pharmacy   | FK → Pharmacy|                        |
| medicine   | FK → Medicine|                        |
| price      | Decimal       |                        |
| recorded_at| DateTime      | Auto                   |

#### `ShortageReport`

| Field             | Type         | Notes                               |
|------------------|-------------|---------------------------------------|
| id               | UUID (PK)   |                                       |
| pharmacy         | FK → Pharmacy|                                      |
| medicine         | FK → Medicine|                                      |
| reported_quantity| Integer      | Stock at time of report               |
| description      | TextField    |                                       |
| severity         | CharField    | LOW / MEDIUM / HIGH / CRITICAL        |
| status           | CharField    | PENDING / REVIEWED / RESOLVED         |
| created_at       | DateTime     |                                       |

#### `DemandData`

| Field             | Type         | Notes                     |
|------------------|-------------|---------------------------|
| id               | UUID (PK)   |                           |
| pharmacy         | FK → Pharmacy|                          |
| medicine         | FK → Medicine|                          |
| quantity_requested| Integer     | Units sold/requested      |
| recorded_at      | DateTime     |                           |

#### `Alert`

| Field       | Type         | Notes                                  |
|------------|-------------|----------------------------------------|
| id         | UUID (PK)   |                                        |
| medicine   | FK → Medicine| Nullable                              |
| area       | CharField    | District/region                        |
| alert_type | CharField    | SHORTAGE / PRICE_ANOMALY / EXPIRY / DEMAND_SPIKE |
| severity   | CharField    | LOW / MEDIUM / HIGH / CRITICAL         |
| message    | TextField    |                                        |
| status     | CharField    | ACTIVE / ACKNOWLEDGED / RESOLVED       |
| created_at | DateTime     |                                        |

#### `GovernmentAction`

| Field       | Type         | Notes                                 |
|------------|-------------|---------------------------------------|
| id         | UUID (PK)   |                                       |
| alert      | FK → Alert   |                                       |
| initiated_by| FK → User  | Government user                       |
| action_type| CharField    | REDISTRIBUTE / SUPPLY_TOPUP / NOTIFY / REPORT |
| description| TextField    |                                       |
| status     | CharField    | PLANNED / IN_PROGRESS / COMPLETED     |
| created_at | DateTime     |                                       |
| updated_at | DateTime     |                                       |

#### `Notification`

| Field       | Type         | Notes                     |
|------------|-------------|---------------------------|
| id         | UUID (PK)   |                           |
| recipient  | FK → User   |                           |
| title      | CharField    |                           |
| message    | TextField    |                           |
| type       | CharField    | ALERT / INFO / ACTION     |
| is_read    | Boolean      | Default False             |
| created_at | DateTime     |                           |

---

## 5. API PLAN

### Authentication

| Method | Endpoint              | Access    | Description              |
|--------|----------------------|-----------|--------------------------|
| POST   | /api/auth/register/  | Public    | Register user            |
| POST   | /api/auth/login/     | Public    | Login, returns JWT       |
| POST   | /api/auth/refresh/   | Auth      | Refresh JWT token        |
| POST   | /api/auth/logout/    | Auth      | Invalidate token         |
| GET    | /api/auth/me/        | Auth      | Get current user profile |

### Pharmacist APIs

| Method | Endpoint                     | Access      | Description                    |
|--------|------------------------------|-------------|--------------------------------|
| GET    | /api/pharmacies/me/          | Pharmacist  | Get own pharmacy               |
| PUT    | /api/pharmacies/me/          | Pharmacist  | Update own pharmacy            |
| GET    | /api/inventory/              | Pharmacist  | List own inventory             |
| POST   | /api/inventory/              | Pharmacist  | Add inventory item             |
| PUT    | /api/inventory/{id}/         | Pharmacist  | Update stock/price             |
| DELETE | /api/inventory/{id}/         | Pharmacist  | Remove inventory item          |
| GET    | /api/medicines/              | Auth        | List medicines (catalog)       |
| POST   | /api/medicines/              | Auth        | Add medicine to catalog        |
| GET    | /api/batches/                | Pharmacist  | List batches                   |
| POST   | /api/batches/                | Pharmacist  | Add batch                      |
| PUT    | /api/batches/{id}/           | Pharmacist  | Update batch                   |
| POST   | /api/shortages/report/       | Pharmacist  | Submit shortage report         |
| GET    | /api/shortages/my-reports/   | Pharmacist  | View own shortage reports      |
| GET    | /api/alerts/                 | Auth        | View relevant alerts           |
| GET    | /api/notifications/          | Auth        | View notifications             |
| PUT    | /api/notifications/{id}/read/| Auth        | Mark notification read         |

### Government APIs

| Method | Endpoint                          | Access     | Description                      |
|--------|-----------------------------------|------------|----------------------------------|
| GET    | /api/government/dashboard/        | Government | Dashboard aggregate stats        |
| GET    | /api/government/pharmacies/       | Government | List all pharmacies              |
| GET    | /api/government/pharmacies/{id}/  | Government | Pharmacy detail (aggregated)     |
| GET    | /api/government/medicines/        | Government | Medicine monitoring data         |
| GET    | /api/government/shortages/        | Government | All shortage reports             |
| GET    | /api/government/alerts/           | Government | All alerts                       |
| PUT    | /api/government/alerts/{id}/      | Government | Update alert status              |
| GET    | /api/government/price-monitoring/ | Government | Price anomaly data               |
| GET    | /api/government/demand/           | Government | Demand analytics                 |
| GET    | /api/government/map-data/         | Government | Map markers + severity           |
| POST   | /api/government/actions/          | Government | Create government action         |
| GET    | /api/government/actions/          | Government | List actions                     |
| PUT    | /api/government/actions/{id}/     | Government | Update action status             |

### Public APIs (No Auth)

| Method | Endpoint                         | Access  | Description                         |
|--------|----------------------------------|---------|-------------------------------------|
| GET    | /api/public/medicines/search/    | Public  | Search medicines                    |
| GET    | /api/public/availability/{med}/  | Public  | Availability + nearby pharmacies    |
| GET    | /api/public/pharmacies/nearby/   | Public  | Pharmacies near lat/lng             |

---

## 6. DEVELOPMENT PHASES (DETAILED PLAN)

### Phase 1 — Project Initialization
- Scaffold frontend (Vite + React + TypeScript + Tailwind + shadcn/ui)
- Scaffold backend (Django + DRF)
- Create `.gitignore`, `.env.example`, `README.md`
- Verify both servers run independently
- **Estimated duration**: 1 session

### Phase 2 — Database & Supabase
- Configure Django to connect to Supabase PostgreSQL
- Create custom User model (accounts app)
- Create Pharmacy, Medicine, Inventory models
- Run migrations, test CRUD via Django admin/shell
- **Estimated duration**: 1 session

### Phase 3 — Authentication
- JWT auth with `djangorestframework-simplejwt`
- Login/logout/refresh endpoints
- Custom User serializer with role field
- Permission classes: `IsPharmacist`, `IsGovernment`
- Frontend login page + auth context + protected routes
- Role-based redirect after login
- **Estimated duration**: 1–2 sessions

### Phase 4 — Frontend Design System
- Design tokens (colors, typography, spacing)
- Layout components (Sidebar, Topbar, PageWrapper)
- Common components (Card, Badge, StatusBadge, DataTable, Modal, EmptyState, LoadingState)
- Responsive sidebar with role-based menu items
- **Estimated duration**: 1–2 sessions

### Phase 5 — Pharmacist Module
- Pharmacist dashboard (stats cards, recent activity)
- Inventory CRUD (add/edit/delete medicines + stock)
- Shortage report submission
- Alerts view
- Backend APIs for all pharmacist operations
- **Estimated duration**: 2 sessions

### Phase 6 — Government Dashboard
- Government dashboard (aggregate stats)
- Pharmacy monitoring table
- Medicine monitoring view
- Backend aggregation APIs
- **Estimated duration**: 1–2 sessions

### Phase 7 — Map
- React Leaflet integration
- Pharmacy markers with severity colors
- Popup details on markers
- Filters (medicine, district, severity)
- **Estimated duration**: 1 session

### Phase 8 — Shortage Detection
- `shortages/services/detection.py` — rule-based engine
- Stock depletion estimation
- Demand spike detection
- Multi-pharmacy shortage correlation
- Backend management command or periodic check
- **Estimated duration**: 1 session

### Phase 9 — Alert Mode
- Alert generation from detection results
- Notification creation and delivery
- Government dashboard alert feed
- Alert detail view with action options
- **Estimated duration**: 1 session

### Phase 10 — Price Monitoring
- PriceHistory model + auto-recording on price update
- Reference price comparison
- Deviation calculation
- Price anomaly alerts
- Government price monitoring dashboard with charts
- **Estimated duration**: 1 session

### Phase 11 — Government Actions
- Action creation (redistribute, supply top-up, notify, report)
- Action status tracking
- Action history view
- **Estimated duration**: 1 session

### Phase 12 — Batch & Expiry
- Batch management CRUD
- Expiry date tracking
- Expiry alert generation (configurable days threshold)
- Dashboard warnings
- **Estimated duration**: 1 session

### Phase 13 — Public Portal
- Public home page (MedCode branding)
- Medicine search
- Availability results with pharmacy list
- Public pharmacy map
- Privacy: no sensitive data exposed
- **Estimated duration**: 1 session

### Phase 14 — Reports & Analytics
- Recharts integration for demand, stock, price trends
- District comparison charts
- Government reports page
- CSV/PDF export if feasible
- **Estimated duration**: 1–2 sessions

### Phase 15 — Polish
- Responsive design pass
- Loading/error/empty states everywhere
- Framer Motion animations
- Form validation
- Accessibility improvements
- UI consistency review
- **Estimated duration**: 1–2 sessions

### Phase 16 — Demo Preparation
- Seed data script with realistic Indian pharmacies/medicines
- Demo flow walkthrough (14-step story)
- Final testing
- **Estimated duration**: 1 session

---

## 7. DEPENDENCIES

### Frontend

| Package                | Purpose                      |
|-----------------------|------------------------------|
| react                 | UI framework                 |
| react-dom             | DOM rendering                |
| react-router-dom      | Client-side routing          |
| typescript            | Type safety                  |
| vite                  | Build tool                   |
| tailwindcss           | Utility-first CSS            |
| @shadcn/ui            | Component library            |
| lucide-react          | Icon library                 |
| framer-motion         | Animations                   |
| recharts              | Charts & graphs              |
| react-leaflet         | Map component                |
| leaflet               | Map library                  |
| axios                 | HTTP client                  |
| react-hot-toast / sonner | Toast notifications       |
| date-fns              | Date utilities               |
| clsx / tailwind-merge | Class utilities              |

### Backend

| Package                        | Purpose                    |
|-------------------------------|----------------------------|
| django                        | Web framework              |
| djangorestframework           | REST API                   |
| djangorestframework-simplejwt | JWT authentication         |
| django-cors-headers           | CORS for frontend          |
| django-environ                | Environment variables      |
| psycopg2-binary               | PostgreSQL driver          |
| gunicorn                      | Production WSGI server     |
| django-filter                 | API filtering              |
| whitenoise                    | Static file serving        |

---

## 8. ASSUMPTIONS

1. **Supabase PostgreSQL** is used as the database; connection string will be provided via `.env`.
2. **No real government API** integration — government actions are internal records for the hackathon.
3. **No SMS/email** notifications in MVP — notifications are in-app only.
4. **No real payment/billing** system — billing is out of scope unless explicitly requested.
5. **Shortage detection** uses rule-based logic, not ML, for the initial prototype.
6. **Price anomaly** detection uses percentage deviation from reference price.
7. **Map data** uses OpenStreetMap tiles (free, no API key required).
8. **Demo data** will use realistic Indian pharmacy names, locations (Maharashtra focus), and common medicines (insulin, metformin, levothyroxine, etc.).
9. **Single-tenant** architecture — one MedCode instance for one region/state.
10. **No mobile app** — responsive web only.
11. **Supabase Realtime** will only be used for alert notifications if time permits; not a core dependency.

---

## 9. MVP vs FUTURE FEATURES

### ✅ MVP (Hackathon Scope)

| Feature                          | Phase |
|----------------------------------|-------|
| Project setup & architecture     | 1     |
| Database models & Supabase       | 2     |
| JWT authentication + roles       | 3     |
| Design system & layouts          | 4     |
| Pharmacist dashboard             | 5     |
| Inventory management (CRUD)      | 5     |
| Shortage reporting               | 5     |
| Government dashboard             | 6     |
| Pharmacy & medicine monitoring   | 6     |
| Map with pharmacy locations      | 7     |
| Rule-based shortage detection    | 8     |
| Alert system                     | 9     |
| Basic price monitoring           | 10    |
| Government actions (record)      | 11    |
| Batch & expiry tracking          | 12    |
| Public medicine search           | 13    |
| Basic analytics/charts           | 14    |
| Polish & demo data               | 15-16 |

### 🔮 FUTURE (Post-Hackathon)

| Feature                                  | Notes                                    |
|------------------------------------------|------------------------------------------|
| ML-based shortage prediction             | Replace rule-based with trained model     |
| SMS/Email notifications                  | Twilio / SendGrid integration             |
| Real government API integration          | Connect to actual supply chain systems    |
| Multi-region/multi-state support         | Tenant-based architecture                 |
| Advanced demand forecasting              | Time-series analysis                      |
| Mobile application                       | React Native or Flutter                   |
| Billing / Invoice generation             | GST-compliant billing                     |
| Patient prescription tracking            | Privacy-sensitive feature                 |
| Supplier integration                     | Connect to pharmaceutical distributors    |
| Audit logs                               | Full action audit trail                   |
| Advanced role management                 | Sub-roles within government               |
| Data export (PDF/Excel reports)          | Comprehensive reporting                   |
| Supabase Realtime live dashboards        | WebSocket-based live updates              |
| Dark mode                                | Theme toggle                              |
| Localization (Hindi/Marathi)             | Multi-language support                    |

---

## 10. RISK ASSESSMENT

| Risk                                    | Mitigation                                    |
|-----------------------------------------|-----------------------------------------------|
| Database connection issues              | Test Supabase connectivity early in Phase 2   |
| Scope creep                             | Strict phase-based development                |
| UI taking too long                      | Use shadcn/ui pre-built components            |
| Complex business logic in views         | Service layer from the start                  |
| CORS issues                             | django-cors-headers configured in Phase 1     |
| Demo data not realistic                 | Prepare seed data script early                |
| Map performance with many markers       | Marker clustering (leaflet.markercluster)     |

---

## 11. DESIGN SYSTEM (Planned)

### Color Palette

```
Primary:        #1E3A5F  (Dark Navy)
Primary Light:  #2D5F8A  (Medium Blue)
Accent:         #0EA5E9  (Sky Blue — medical accent)
Success:        #22C55E  (Green — available/healthy)
Warning:        #F59E0B  (Amber — low stock/warning)
Danger:         #EF4444  (Red — critical/out of stock)
Background:     #F8FAFC  (Light Gray)
Surface:        #FFFFFF  (White)
Text Primary:   #0F172A  (Slate 900)
Text Secondary: #64748B  (Slate 500)
Border:         #E2E8F0  (Slate 200)
```

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Semi-bold / Bold
- **Body**: Regular 14-16px
- **Monospace**: JetBrains Mono (for data/codes)

### Status Colors (consistent across app)

```
NORMAL       → Green  (#22C55E)
LOW          → Yellow (#F59E0B)
CRITICAL     → Orange (#F97316)
OUT_OF_STOCK → Red    (#EF4444)
```

---

## 12. KEY TECHNICAL DECISIONS

| Decision                              | Rationale                                         |
|---------------------------------------|---------------------------------------------------|
| Custom User model from Day 1          | Django best practice; can't change later           |
| UUID primary keys                     | Better for distributed systems & Supabase          |
| Service layer for business logic      | Keeps views thin; testable logic                   |
| Consistent API response format        | `{success, message, data}` — predictable frontend  |
| Axios with interceptors               | Auto-attach JWT, handle 401 redirects              |
| React Context for auth state          | Simple, sufficient for this scale                  |
| shadcn/ui                             | Copy-paste components, full control, no lock-in    |
| Role field on User (not groups)       | Simple for 2 roles; Django groups are overkill     |

---

## 13. SUMMARY

MedCode is architected as a **two-layer platform**:

1. **Pharmacy Layer** — ground-level data input (stock, price, batch, shortage reports)
2. **Government Layer** — monitoring, analysis, alerts, and coordinated response

The system bridges these layers through:
- **Automated shortage detection** (rule-based)
- **Price anomaly detection** (threshold-based)
- **Map-based geographic awareness**
- **Alert and action workflows**
- **Public transparency** (medicine search without sensitive data)

The architecture is designed for **incremental development** across 16 phases, starting with infrastructure and building up to a polished hackathon demo.

---

**✅ Phase 0 Complete. Awaiting instruction to proceed to Phase 1 — Project Initialization.**
