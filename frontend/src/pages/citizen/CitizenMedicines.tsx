import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Search, ArrowLeft, LogOut, Filter } from "lucide-react";
import { getPublicPrices, type PublicPriceItem } from "../../services/citizen";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

export default function CitizenMedicines() {
    const navigate = useNavigate();
    const [prices, setPrices] = useState<PublicPriceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getPublicPrices();
            setPrices(res.data.data);
        } catch {
            setError("Unable to load medicine data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = prices.filter((item) => {
        const matchSearch = item.medicine_name.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || item.availability === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="min-h-screen bg-[#F5F8FC]">
            {/* Header */}
            <header className="bg-white border-b border-[#CBD5E1] shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/citizen")}
                            className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="w-9 h-9 bg-[#0B1F3A] rounded-xl flex items-center justify-center">
                            <ShieldCheck className="text-[#19B5D8]" size={20} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#0B1F3A]">
                            Med<span className="text-[#19B5D8]">Code</span>
                        </span>
                        <span className="hidden sm:inline-block text-xs font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full ml-1">
                            Medicine Tracker
                        </span>
                    </div>
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                    >
                        <LogOut size={16} />
                        Exit
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[#0F172A]">Medicine Price & Availability</h1>
                        <p className="text-[#64748B] text-sm mt-1">Track real-time medicine prices and availability across pharmacies.</p>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search medicines..."
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#19B5D8]/20 focus:border-[#19B5D8] transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-9 pr-8 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#19B5D8]/20 focus:border-[#19B5D8] transition-all appearance-none"
                            >
                                <option value="ALL">All Status</option>
                                <option value="Available">Available</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <ErrorState message={error} onRetry={load} />
                    ) : filtered.length === 0 ? (
                        <EmptyState title="No medicines found" message="Try adjusting your search or filter." />
                    ) : (
                        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#F8FAFC] text-left text-xs text-[#64748B] uppercase tracking-wider">
                                        <th className="px-5 py-3.5">Medicine</th>
                                        <th className="px-5 py-3.5 text-right">Avg Price</th>
                                        <th className="px-5 py-3.5 text-right">Min Price</th>
                                        <th className="px-5 py-3.5 text-right">Max Price</th>
                                        <th className="px-5 py-3.5 text-right">Variation</th>
                                        <th className="px-5 py-3.5 text-center">Pharmacies</th>
                                        <th className="px-5 py-3.5">Availability</th>
                                        <th className="px-5 py-3.5">Risk</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p) => (
                                        <tr key={p.medicine_id} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                                            <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{p.medicine_name}</td>
                                            <td className="px-5 py-3.5 text-right font-mono text-[#334155]">₹{p.avg_price.toFixed(2)}</td>
                                            <td className="px-5 py-3.5 text-right font-mono text-emerald-600">₹{p.min_price.toFixed(2)}</td>
                                            <td className="px-5 py-3.5 text-right font-mono text-red-600">₹{p.max_price.toFixed(2)}</td>
                                            <td className="px-5 py-3.5 text-right font-medium text-[#334155]">{p.price_variation.toFixed(1)}%</td>
                                            <td className="px-5 py-3.5 text-center font-medium">{p.pharmacies_count}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.availability === "Available"
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : p.availability === "Low Stock"
                                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                            : "bg-red-50 text-red-700 border border-red-200"
                                                    }`}>
                                                    {p.availability}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5"><StatusBadge status={p.risk} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
