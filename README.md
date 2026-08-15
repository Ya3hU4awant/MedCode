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
