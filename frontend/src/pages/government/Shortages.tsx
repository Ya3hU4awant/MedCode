import { useEffect, useState } from "react";
import { getGovShortages } from "../../services/government";
import type { ShortageReport } from "../../types/shortage";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import { Search } from "lucide-react";

export default function GovShortages() {
    const [shortages, setShortages] = useState<ShortageReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const res = await getGovShortages();
            setShortages(res.data.data);
        } catch {
            setError("Failed to load shortages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    const filtered = shortages.filter(s =>
        s.medicine_name.toLowerCase().includes(search.toLowerCase()) ||
        s.pharmacy_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Shortage Reports</h1>

            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicine or pharmacy..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Medicine</th>
                            <th className="px-5 py-3">Pharmacy</th>
                            <th className="px-5 py-3">Qty Reported</th>
                            <th className="px-5 py-3">Severity</th>
                            <th className="px-5 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((s) => (
                            <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50">
                                <td className="px-5 py-3 text-slate-500">{new Date(s.created_at).toLocaleDateString()}</td>
                                <td className="px-5 py-3 font-medium text-slate-800">{s.medicine_name}</td>
                                <td className="px-5 py-3 font-medium text-slate-600">{s.pharmacy_name}</td>
                                <td className="px-5 py-3">{s.reported_quantity}</td>
                                <td className="px-5 py-3"><StatusBadge status={s.severity} /></td>
                                <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
