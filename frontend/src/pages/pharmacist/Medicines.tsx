import { useEffect, useState } from "react";
import { getMedicines } from "../../services/medicines";
import type { Medicine } from "../../types/medicine";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { Search, Pill } from "lucide-react";

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getMedicines();
            setMedicines(res.data.data);
        } catch {
            setError("Failed to load medicines");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    const filtered = medicines.filter((m) =>
        m.medicine_name.toLowerCase().includes(search.toLowerCase()) ||
        m.generic_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Medicine Catalog</h1>

            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>

            {filtered.length === 0 ? (
                <EmptyState title="No medicines found" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((m) => (
                        <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                                    <Pill size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">{m.medicine_name}</h3>
                                    <p className="text-xs text-slate-500">{m.generic_name}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {m.category && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{m.category}</span>}
                                        {m.manufacturer && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{m.manufacturer}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
