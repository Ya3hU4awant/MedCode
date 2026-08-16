import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import GovernmentDashboard from "./pages/GovernmentDashboard";

function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "PHARMACIST" | "GOVERNMENT";
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading MedCode...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route
        path="/pharmacist/dashboard"
        element={
          <ProtectedRoute role="PHARMACIST">
            <PharmacistDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/government/dashboard"
        element={
          <ProtectedRoute role="GOVERNMENT">
            <GovernmentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        <AppRoutes />
      </AuthProvider>

    </BrowserRouter>
  );
}