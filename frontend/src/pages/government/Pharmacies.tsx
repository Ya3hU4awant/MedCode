import { useEffect, useState } from "react";
import { getGovPharmacies } from "../../services/government";
import type { Pharmacy } from "../../types/pharmacy";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import { Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function GovPharmacies() {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const res = await getGovPharmacies();
            setPharmacies(res.data.data);
        } catch {
            setError("Failed to load pharmacies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    const filtered = pharmacies.filter(p =>
        p.pharmacy_name.toLowerCase().includes(search.toLowerCase()) ||
        p.district.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Registered Pharmacies</h1>

            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or district..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                            <th className="px-5 py-3">Pharmacy</th>
                            <th className="px-5 py-3">License No.</th>
                            <th className="px-5 py-3">Location</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                                <td className="px-5 py-3 font-medium text-slate-800">{p.pharmacy_name}</td>
                                <td className="px-5 py-3 text-slate-600 text-xs font-mono">{p.license_number}</td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-1 text-slate-600"><MapPin size={14} /> {p.district}, {p.state}</div>
                                </td>
                                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                                <td className="px-5 py-3">
                                    <Link to={`/government/pharmacies/${p.id}`} className="text-cyan-600 font-medium hover:underline">View Details</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
