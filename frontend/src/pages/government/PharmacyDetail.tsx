import { useEffect, useState } from "react";
import { getGovPharmacy } from "../../services/government";
import type { Pharmacy, InventoryItem } from "../../types";
import { useParams, Link } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import { ArrowLeft, Building2, MapPin, Phone, FileText } from "lucide-react";

export default function GovPharmacyDetail() {
    const { id } = useParams();
    const [data, setData] = useState<(Pharmacy & { inventory: InventoryItem[] }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await getGovPharmacy(id);
            setData(res.data.data);
        } catch {
            setError("Failed to load pharmacy details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [id]);

    if (loading) return <LoadingSkeleton />;
    if (error || !data) return <ErrorState message={error} onRetry={load} />;

    return (
        <div className="space-y-6">
            <Link to="/government/pharmacies" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft size={16} /> Back to Pharmacies
            </Link>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                    <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{data.pharmacy_name}</h2>
                        <div className="flex gap-2 mt-1">
                            <StatusBadge status={data.status} />
                            <span className="text-xs text-slate-500 flex items-center gap-1 font-mono"><FileText size={12} /> {data.license_number}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-medium">District</label>
                        <p className="text-sm text-slate-800 flex items-center gap-1"><MapPin size={14} /> {data.district}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-medium">State</label>
                        <p className="text-sm text-slate-800">{data.state}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-medium">Phone</label>
                        <p className="text-sm text-slate-800 flex items-center gap-1"><Phone size={14} /> {data.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-medium">Address</label>
                        <p className="text-sm text-slate-800 w-full truncate">{data.address}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-800">Inventory Contents ({data.inventory?.length || 0})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                                <th className="px-5 py-3">Medicine</th>
                                <th className="px-5 py-3 text-right">Quantity</th>
                                <th className="px-5 py-3 text-right">Selling Price</th>
                                <th className="px-5 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.inventory?.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-slate-500">No inventory data available</td></tr>
                            ) : (
                                data.inventory?.map((inv) => (
                                    <tr key={inv.id} className="border-t border-slate-100 hover:bg-slate-50">
                                        <td className="px-5 py-3 font-medium text-slate-800">{inv.medicine_name}</td>
                                        <td className="px-5 py-3 text-right">{inv.quantity}</td>
                                        <td className="px-5 py-3 text-right">₹{inv.selling_price}</td>
                                        <td className="px-5 py-3 text-center">
                                            <StatusBadge status={inv.quantity === 0 ? 'OUT OF STOCK' : inv.quantity <= 15 ? 'LOW' : 'AVAILABLE'} />
                                        </td>
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
