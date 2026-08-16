import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getGovDashboard } from "../../services/government";
import type { DashboardData } from "../../types";
import StatCard from "../../components/common/StatCard";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import { Building2, Pill, AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

export default function GovDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getGovDashboard();
            setData(res.data.data);
        } catch {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <LoadingSkeleton />;
    if (error || !data) return <ErrorState message={error} onRetry={load} />;

    const severityData = Object.entries(data.alert_severity_breakdown).map(([key, val]) => ({
        name: key, count: val
    }));

    const COLORS: Record<string, string> = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#3b82f6" };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Government Dashboard</h1>
                    <p className="text-slate-500">Welcome, {user?.full_name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Pharmacies" value={data.total_pharmacies} subtitle={`${data.active_pharmacies} active`} icon={<Building2 size={20} />} color="text-indigo-600 bg-indigo-50" />
                <StatCard label="Medicines Monitored" value={data.medicines_monitored} icon={<Pill size={20} />} color="text-cyan-600 bg-cyan-50" />
                <StatCard label="Shortage Alerts" value={data.shortage_alerts} subtitle={`${data.critical_shortages} critical`} icon={<AlertTriangle size={20} />} color="text-red-600 bg-red-50" />
                <StatCard label="Price Anomalies" value={data.price_alerts} icon={<TrendingUp size={20} />} color="text-amber-600 bg-amber-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Alerts by severity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Alert Severity Breakdown</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={severityData} layout="vertical" margin={{ left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" fontSize={12} tick={{ fill: "#64748b" }} />
                            <YAxis dataKey="name" type="category" fontSize={12} tick={{ fill: "#64748b" }} width={80} />
                            <Tooltip cursor={{ fill: "#f8fafc" }} />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                {severityData.map((entry) => (
                                    <Cell key={entry.name} fill={COLORS[entry.name] || "#0ea5e9"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Quick Links</h3>
                    <div className="space-y-3">
                        <button onClick={() => navigate("/government/pharmacies")} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 transition-colors">
                            <span className="flex items-center gap-3 text-slate-700 font-medium"><Building2 size={18} className="text-cyan-600" /> View Pharmacies</span>
                        </button>
                        <button onClick={() => navigate("/government/shortages")} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                            <span className="flex items-center gap-3 text-slate-700 font-medium"><AlertTriangle size={18} className="text-red-600" /> Resolve Shortages</span>
                        </button>
                        <button onClick={() => navigate("/government/prices")} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors">
                            <span className="flex items-center gap-3 text-slate-700 font-medium"><TrendingUp size={18} className="text-amber-500" /> Monitor Prices</span>
                        </button>
                        <button onClick={() => navigate("/government/alerts")} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                            <span className="flex items-center gap-3 text-slate-700 font-medium"><ShieldCheck size={18} className="text-indigo-600" /> System Alerts</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
// using Cell from recharts, need to fix imports
