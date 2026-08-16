import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getGovDashboard, getGovPharmacies } from "../../services/government";
import type { DashboardData } from "../../types";
import type { Pharmacy } from "../../types/pharmacy";
import StatCard from "../../components/common/StatCard";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import { Building2, Pill, AlertTriangle, TrendingUp, ShieldCheck, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function GovDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [dashRes, pharmRes] = await Promise.all([getGovDashboard(), getGovPharmacies()]);
            setData(dashRes.data.data);
            setPharmacies(pharmRes.data.data);
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

    const COLORS: Record<string, string> = { CRITICAL: "#DC2626", HIGH: "#F97316", MEDIUM: "#F59E0B", LOW: "#1769E0" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Government Monitoring Center</h1>
                    <p className="text-slate-500 font-medium">Real-time medicine availability, shortage and price intelligence.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard label="Total Pharmacies" value={data.total_pharmacies} subtitle={`${data.active_pharmacies} active`} icon={<Building2 size={20} />} color="text-[#0B1F3A] bg-[#0B1F3A]/10" />
                <StatCard label="Medicines Monitored" value={data.medicines_monitored} icon={<Pill size={20} />} color="text-[#19B5D8] bg-[#19B5D8]/10" />
                <StatCard label="Shortage Alerts" value={data.shortage_alerts} subtitle={`${data.critical_shortages} critical`} icon={<AlertTriangle size={20} />} color="text-red-600 bg-red-100" />
                <StatCard label="Price Anomalies" value={data.price_alerts} icon={<TrendingUp size={20} />} color="text-amber-600 bg-amber-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Alerts by severity */}
                <motion.div
                    whileHover={{ y: -3, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                    className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all"
                >
                    <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wide">Alert Severity Breakdown</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={severityData} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.4} />
                            <XAxis type="number" fontSize={12} tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" fontSize={12} tick={{ fill: "#64748b", fontWeight: 600 }} width={80} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                {severityData.map((entry) => (
                                    <Cell key={entry.name} fill={COLORS[entry.name] || "#1769E0"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Leaflet MAP */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative" style={{ minHeight: "350px" }}>
                    <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between z-10 relative shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            <MapPin size={16} className="text-[#1769E0]" /> Regional Pharmacy Network
                        </h3>
                        <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">Live view</span>
                    </div>
                    <div className="flex-1 w-full h-full relative z-0">
                        <MapContainer center={[19.8762, 75.3433]} zoom={6} className="w-full h-full min-h-[300px]">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                            {pharmacies.filter(p => p.latitude && p.longitude).map(p => (
                                <Marker key={p.id} position={[p.latitude, p.longitude]}>
                                    <Popup>
                                        <div className="font-sans">
                                            <strong className="block text-sm mb-1">{p.pharmacy_name}</strong>
                                            <span className="text-xs text-gray-500 block">{p.district}, {p.state}</span>
                                            <button onClick={() => navigate(`/government/pharmacies/${p.id}`)} className="mt-2 w-full text-xs bg-[#1769E0] text-white py-1 rounded">View Details</button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide pt-4">Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.button whileHover={{ y: -3, scale: 1.02 }} onClick={() => navigate("/government/pharmacies")} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-[#19B5D8] hover:shadow-md transition-all">
                    <span className="flex items-center gap-3 text-slate-800 font-semibold"><Building2 size={20} className="text-[#19B5D8]" /> View Pharmacies</span>
                </motion.button>
                <motion.button whileHover={{ y: -3, scale: 1.02 }} onClick={() => navigate("/government/shortages")} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-red-400 hover:shadow-md transition-all">
                    <span className="flex items-center gap-3 text-slate-800 font-semibold"><AlertTriangle size={20} className="text-red-500" /> Shortages</span>
                </motion.button>
                <motion.button whileHover={{ y: -3, scale: 1.02 }} onClick={() => navigate("/government/prices")} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-amber-400 hover:shadow-md transition-all">
                    <span className="flex items-center gap-3 text-slate-800 font-semibold"><TrendingUp size={20} className="text-amber-500" /> Monitor Prices</span>
                </motion.button>
                <motion.button whileHover={{ y: -3, scale: 1.02 }} onClick={() => navigate("/government/alerts")} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-[#1769E0] hover:shadow-md transition-all">
                    <span className="flex items-center gap-3 text-slate-800 font-semibold"><ShieldCheck size={20} className="text-[#1769E0]" /> System Alerts</span>
                </motion.button>
            </div>
        </motion.div>
    );
}
