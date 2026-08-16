import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getInventory } from "../../services/inventory";
import { getMyPharmacy } from "../../services/pharmacy";
import { getBatches } from "../../services/batches";
import { getShortages } from "../../services/shortages";
import type { InventoryItem } from "../../types/inventory";
import type { Pharmacy } from "../../types/pharmacy";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import { Package, AlertTriangle, XCircle, Clock, Plus, FileWarning, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

function getStockStatus(qty: number) {
    if (qty === 0) return "OUT OF STOCK";
    if (qty <= 5) return "CRITICAL";
    if (qty <= 15) return "LOW";
    return "AVAILABLE";
}

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function PharmacistDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [batchCount, setBatchCount] = useState(0);
    const [shortagesCount, setShortagesCount] = useState(0);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [invRes, phRes, bRes, sRes] = await Promise.all([
                getInventory(), getMyPharmacy(), getBatches(), getShortages()
            ]);
            setInventory(invRes.data.data);
            setPharmacy(phRes.data.data);
            setBatchCount(Array.isArray(bRes.data.data) ? bRes.data.data.length : 0);
            setShortagesCount(Array.isArray(sRes.data.data) ? sRes.data.data.length : 0);
        } catch {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    const totalMeds = inventory.length;
    const lowStock = inventory.filter((i) => i.quantity > 0 && i.quantity <= 15).length;
    const outOfStock = inventory.filter((i) => i.quantity === 0).length;
    const totalValue = inventory.reduce((s, i) => s + Number(i.selling_price) * i.quantity, 0);

    // Category chart data
    const catMap: Record<string, number> = {};
    inventory.forEach(() => {
        // We don't have category on inventory, use medicine_name first char as placeholder category
    });

    // Stock pie data
    const available = inventory.filter((i) => i.quantity > 15).length;
    const pieData = [
        { name: "Available", value: available },
        { name: "Low Stock", value: lowStock },
        { name: "Out of Stock", value: outOfStock },
    ].filter((d) => d.value > 0);

    // Bar chart - top medicines by quantity
    const barData = [...inventory]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 8)
        .map((i) => ({ name: i.medicine_name.substring(0, 12), qty: i.quantity }));

    const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{greeting}, {user?.full_name}</h1>
                    <p className="text-slate-500">{pharmacy?.pharmacy_name} &middot; Last updated: just now</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => navigate("/pharmacist/inventory")} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                        <Plus size={16} /> Add Stock
                    </button>
                    <button onClick={() => navigate("/pharmacist/shortages")} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                        <FileWarning size={16} /> Report Shortage
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Medicines" value={totalMeds} icon={<Pill size={20} />} color="text-cyan-600 bg-cyan-50" />
                <StatCard label="Low Stock" value={lowStock} icon={<AlertTriangle size={20} />} color="text-amber-600 bg-amber-50" />
                <StatCard label="Out of Stock" value={outOfStock} icon={<XCircle size={20} />} color="text-red-600 bg-red-50" />
                <StatCard label="Inventory Value" value={`₹${totalValue.toLocaleString()}`} icon={<Package size={20} />} color="text-emerald-600 bg-emerald-50"
                    subtitle={`${batchCount} batches · ${shortagesCount} reports`} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Bar Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Top Medicines by Stock</h3>
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" fontSize={11} tick={{ fill: "#64748b" }} />
                                <YAxis fontSize={11} tick={{ fill: "#64748b" }} />
                                <Tooltip />
                                <Bar dataKey="qty" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-slate-400 text-sm">No data</p>}
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Stock Status Distribution</h3>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                    {pieData.map((_, idx) => (
                                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-slate-400 text-sm">No data</p>}
                </div>
            </div>

            {/* Low Stock Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">Low Stock & Out of Stock Medicines</h3>
                    <button onClick={() => navigate("/pharmacist/inventory")} className="text-xs text-cyan-600 font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                                <th className="px-5 py-3">Medicine</th>
                                <th className="px-5 py-3">Stock</th>
                                <th className="px-5 py-3">Price</th>
                                <th className="px-5 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.filter((i) => i.quantity <= 15).length === 0 ? (
                                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">All medicines are well-stocked 🎉</td></tr>
                            ) : (
                                inventory.filter((i) => i.quantity <= 15).slice(0, 10).map((item) => (
                                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                                        <td className="px-5 py-3 font-medium text-slate-800">{item.medicine_name}</td>
                                        <td className="px-5 py-3">{item.quantity}</td>
                                        <td className="px-5 py-3">₹{item.selling_price}</td>
                                        <td className="px-5 py-3"><StatusBadge status={getStockStatus(item.quantity)} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
