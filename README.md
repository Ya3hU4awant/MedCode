# MedCode — Medicine Shortage & Price Monitoring System

MedCode is a central coordination platform connecting pharmacy-level information with government-level monitoring to detect medicine shortages, track prices, and facilitate rapid response.

## Architecture

* **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
* **Backend**: Python + Django + Django REST Framework + Postgres (Supabase)

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to project root
cd MedCode

# Create virtual environment
python -m venv backend/venv

# Activate virtual environment
# Windows:
backend\venv\Scripts\activate
# Mac/Linux:
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Environment Variables
cp backend/.env.example backend/.env
# Edit backend/.env as needed

# Run migrations
cd backend
python manage.py migrate

# Start backend server
python manage.py runserver 8000
```

### 2. Frontend Setup

```bash
# Open a new terminal
cd MedCode/frontend

# Install dependencies
npm install

# Environment Variables
cp .env.example .env

# Start frontend development server
npm run dev
```

The frontend will start at `http://localhost:5173` and the backend will start at `http://localhost:8000`.
They are connected via Vite proxy and Django CORS configuration.

## Deployment

### Render Deployment (Backend)
1. Provide a `DATABASE_URL` pointing to **Supabase PostgreSQL**.
2. Connect your repository to Render using a Web Service.
3. Render is automatically configured by `render.yaml`.
   - Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - Start Command: `gunicorn medcode.wsgi:application`

### UptimeRobot Setup
To keep the Render backend active and monitor its health:
Monitor Type: HTTP(s)
URL: `https://YOUR-RENDER-BACKEND.onrender.com/api/health/`
Interval: 5 minutes
