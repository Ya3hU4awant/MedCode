import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";

// Pharmacist Pages
import PharmaDashboard from "./pages/pharmacist/Dashboard";
import PharmaInventory from "./pages/pharmacist/Inventory";
import PharmaBatches from "./pages/pharmacist/Batches";
import PharmaShortages from "./pages/pharmacist/Shortages";
import PharmaMedicines from "./pages/pharmacist/Medicines";
import PharmacyProfile from "./pages/pharmacist/PharmacyProfile";
import GenerateBill from "./pages/pharmacist/GenerateBill";

// Government Pages
import GovDashboard from "./pages/government/Dashboard";
import GovPharmacies from "./pages/government/Pharmacies";
import GovPharmacyDetail from "./pages/government/PharmacyDetail";
import GovShortages from "./pages/government/Shortages";
import GovPrices from "./pages/government/Prices";
import GovAlerts from "./pages/government/Alerts";

import PharmacistSignup from "./pages/auth/PharmacistSignup";

// Citizen Pages
import CitizenPortal from "./pages/citizen/CitizenPortal";
import CitizenMedicines from "./pages/citizen/CitizenMedicines";
import CitizenComplaint from "./pages/citizen/CitizenComplaint";

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: "PHARMACIST" | "GOVERNMENT" }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium animate-pulse">Loading MedCode...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "PHARMACIST" ? "/pharmacist/dashboard" : "/government/dashboard"} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/pharmacist/signup" element={<PharmacistSignup />} />

            {/* Citizen Routes */}
            <Route path="/citizen" element={<CitizenPortal />} />
            <Route path="/citizen/medicines" element={<CitizenMedicines />} />
            <Route path="/citizen/complaint" element={<CitizenComplaint />} />

            {/* Pharmacist Routes */}
            <Route path="/pharmacist" element={<ProtectedRoute role="PHARMACIST"><AppLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<PharmaDashboard />} />
              <Route path="inventory" element={<PharmaInventory />} />
              <Route path="batches" element={<PharmaBatches />} />
              <Route path="shortages" element={<PharmaShortages />} />
              <Route path="medicines" element={<PharmaMedicines />} />
              <Route path="pharmacy" element={<PharmacyProfile />} />
              <Route path="billing" element={<GenerateBill />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Government Routes */}
            <Route path="/government" element={<ProtectedRoute role="GOVERNMENT"><AppLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<GovDashboard />} />
              <Route path="pharmacies" element={<GovPharmacies />} />
              <Route path="pharmacies/:id" element={<GovPharmacyDetail />} />
              <Route path="shortages" element={<GovShortages />} />
              <Route path="prices" element={<GovPrices />} />
              <Route path="alerts" element={<GovAlerts />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Default */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}