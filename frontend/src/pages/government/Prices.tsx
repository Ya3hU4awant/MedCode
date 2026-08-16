import { useEffect, useState } from "react";
import { getGovPrices } from "../../services/government";
import type { PriceMonitorItem } from "../../types";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";

export default function GovPrices() {
    const [prices, setPrices] = useState<PriceMonitorItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const res = await getGovPrices();
            setPrices(res.data.data);
        } catch {
            setError("Failed to load price data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Price Monitoring</h1>
                <p className="text-slate-500 text-sm">Monitor medicine price variations across pharmacies.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                            <th className="px-5 py-3">Medicine</th>
                            <th className="px-5 py-3 text-right">Avg Price</th>
                            <th className="px-5 py-3 text-right">Min Price</th>
                            <th className="px-5 py-3 text-right">Max Price</th>
                            <th className="px-5 py-3 text-right">Variation (%)</th>
                            <th className="px-5 py-3 text-center">Pharmacies</th>
                            <th className="px-5 py-3">Risk Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map((p) => (
                            <tr key={p.medicine_id} className="border-t border-slate-100 hover:bg-slate-50">
                                <td className="px-5 py-3 font-medium text-slate-800">{p.medicine_name}</td>
                                <td className="px-5 py-3 text-right font-mono">₹{p.avg_price.toFixed(2)}</td>
                                <td className="px-5 py-3 text-right font-mono text-emerald-600">₹{p.min_price}</td>
                                <td className="px-5 py-3 text-right font-mono text-red-600">₹{p.max_price}</td>
                                <td className="px-5 py-3 text-right font-medium">{p.price_variation.toFixed(1)}%</td>
                                <td className="px-5 py-3 text-center">{p.pharmacies_affected}</td>
                                <td className="px-5 py-3"><StatusBadge status={p.risk} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
