import { useEffect, useState } from "react";
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

// Default options
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const getMarkerIcon = (status: string) => {
    let color = "#16A34A"; // ACTIVE
    if (status === "PENDING") color = "#F59E0B";
    if (status === "INACTIVE") color = "#DC2626";

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
};

export default function GovDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const filteredPharmacies = pharmacies.filter(p => p.pharmacy_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.district.toLowerCase().includes(searchQuery.toLowerCase()));

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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
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
                        <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">{pharmacies.length} monitored pharmacies</span>
                    </div>
                    <div className="flex-1 w-full h-full relative z-0">
                        <MapContainer center={[19.8762, 75.3433]} zoom={12} className="w-full h-full min-h-[300px]">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                            {pharmacies.filter(p => p.latitude && p.longitude).map(p => (
                                <Marker
                                    key={p.id}
                                    position={[p.latitude as number, p.longitude as number]}
                                    icon={getMarkerIcon(p.status)}
                                >
                                    <Popup>
                                        <div className="font-sans min-w-[200px]">
                                            <strong className="block text-sm mb-1">{p.pharmacy_name}</strong>
                                            <span className="text-xs text-gray-500 block mb-1">{p.address}, {p.district}</span>
                                            <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded-sm font-bold ${p.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                                                p.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                                }`}>{p.status}</span>
                                            <button onClick={() => navigate(`/government/pharmacies/${p.id}`)} className="mt-3 w-full text-xs font-semibold bg-[#1769E0] hover:bg-[#0B1F3A] text-white py-1.5 transition-colors rounded">View Details</button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Sidebar Network List */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col max-h-[420px] overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                            Network Focus
                            <span className="bg-[#1769E0] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full leading-none">{pharmacies.length}</span>
                        </h3>
                        <input
                            type="text"
                            placeholder="Search pharmacies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-3 w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {filteredPharmacies.length === 0 ? (
                            <p className="text-center text-slate-500 text-xs py-4">No pharmacies match search.</p>
                        ) : (
                            filteredPharmacies.map(p => (
                                <div key={p.id} onClick={() => navigate(`/government/pharmacies/${p.id}`)} className="p-3 mb-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all">
                                    <div className="flex items-start justify-between mb-1">
                                        <h4 className="text-sm font-bold text-slate-800 truncate pr-2">{p.pharmacy_name}</h4>
                                        <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${p.status === 'ACTIVE' ? 'bg-emerald-500' : p.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{p.district}</p>
                                    <p className="text-[10px] font-mono text-slate-400 mt-1">{p.license_number}</p>
                                </div>
                            ))
                        )}
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
