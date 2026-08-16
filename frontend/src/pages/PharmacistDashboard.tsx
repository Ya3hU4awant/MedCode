import { useAuth } from "../context/AuthContext";

export default function PharmacistDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="bg-white border-b px-8 py-5 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Med<span className="text-rose-600">Code</span>
          </h1>

          <p className="text-sm text-slate-500">
            Pharmacist Dashboard
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white"
        >
          Logout
        </button>

      </header>

      <main className="p-8">

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.full_name}
        </h2>

        <p className="text-slate-500 mt-2">
          Manage medicine inventory, prices and shortage reports.
        </p>

      </main>

    </div>
  );
}