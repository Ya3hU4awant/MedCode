import { useEffect, useState, type FormEvent } from "react";
import { getShortages, createShortage } from "../../services/shortages";
import { getMedicines } from "../../services/medicines";
import type { ShortageReport } from "../../types/shortage";
import type { Medicine } from "../../types/medicine";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import { useToast } from "../../context/ToastContext";
import { Plus } from "lucide-react";

export default function ShortagesPage() {
    const { toast } = useToast();
    const [shortages, setShortages] = useState<ShortageReport[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const [fMed, setFMed] = useState("");
    const [fQty, setFQty] = useState(0);
    const [fSev, setFSev] = useState("LOW");
    const [fDesc, setFDesc] = useState("");

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [sRes, mRes] = await Promise.all([getShortages(), getMedicines()]);
            setShortages(sRes.data.data);
            setMedicines(mRes.data.data);
        } catch {
            setError("Failed to load shortage reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await createShortage({ medicine: fMed, reported_quantity: fQty, severity: fSev, description: fDesc });
            toast("Shortage report submitted");
            setModalOpen(false);
            load();
        } catch {
            toast("Failed to submit report", "error");
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Shortage Reports</h1>
                <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                    <Plus size={16} /> Report Shortage
                </button>
            </div>

            {shortages.length === 0 ? (
                <EmptyState title="No shortage reports" message="All medicines are adequately stocked." />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                                <th className="px-5 py-3">Medicine</th>
                                <th className="px-5 py-3">Qty</th>
                                <th className="px-5 py-3">Severity</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Reported</th>
                                <th className="px-5 py-3">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shortages.map((s) => (
                                <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-800">{s.medicine_name}</td>
                                    <td className="px-5 py-3">{s.reported_quantity}</td>
                                    <td className="px-5 py-3"><StatusBadge status={s.severity} /></td>
                                    <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-3 text-slate-600 text-xs max-w-[200px] truncate">{s.description || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Report Shortage">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Medicine</label>
                        <select value={fMed} onChange={(e) => setFMed(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            <option value="">Select</option>
                            {medicines.map((m) => <option key={m.id} value={m.id}>{m.medicine_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Quantity</label>
                        <input type="number" min={0} value={fQty} onChange={(e) => setFQty(Number(e.target.value))} required className="w-full px-3 py-2 rounded-lg border text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                        <select value={fSev} onChange={(e) => setFSev(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea value={fDesc} onChange={(e) => setFDesc(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border text-sm" />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Submit Report</button>
                </form>
            </Modal>
        </div>
    );
}
