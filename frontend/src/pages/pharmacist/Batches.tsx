import { useEffect, useState, type FormEvent } from "react";
import { getBatches, createBatch } from "../../services/batches";
import { getMedicines } from "../../services/medicines";
import type { Medicine } from "../../types/medicine";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import { useToast } from "../../context/ToastContext";
import { Plus } from "lucide-react";

interface BatchItem {
    id: string;
    medicine: string;
    medicine_name: string;
    batch_number: string;
    manufacturing_date: string;
    expiry_date: string;
    quantity: number;
}

function getExpiryStatus(expiryDate: string) {
    const now = new Date();
    const exp = new Date(expiryDate);
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "EXPIRED";
    if (diff <= 30) return "CRITICAL";
    if (diff <= 90) return "LOW";
    return "AVAILABLE";
}

function expiryLabel(expiryDate: string) {
    const status = getExpiryStatus(expiryDate);
    const labels: Record<string, string> = { EXPIRED: "Expired", CRITICAL: "Expiring <30d", LOW: "Expiring <90d", AVAILABLE: "Normal" };
    return labels[status] || "Normal";
}

export default function BatchesPage() {
    const { toast } = useToast();
    const [batches, setBatches] = useState<BatchItem[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState("ALL");

    const [fMed, setFMed] = useState("");
    const [fBatch, setFBatch] = useState("");
    const [fMfg, setFMfg] = useState("");
    const [fExp, setFExp] = useState("");
    const [fQty, setFQty] = useState(0);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [bRes, mRes] = await Promise.all([getBatches(), getMedicines()]);
            setBatches(bRes.data.data);
            setMedicines(mRes.data.data);
        } catch {
            setError("Failed to load batches");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await createBatch({ medicine: fMed, batch_number: fBatch, manufacturing_date: fMfg, expiry_date: fExp, quantity: fQty });
            toast("Batch added successfully");
            setModalOpen(false);
            load();
        } catch {
            toast("Failed to add batch", "error");
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    const filtered = filter === "ALL" ? batches : batches.filter((b) => {
        const s = getExpiryStatus(b.expiry_date);
        if (filter === "EXPIRING") return s === "CRITICAL" || s === "LOW";
        if (filter === "EXPIRED") return s === "EXPIRED";
        return true;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Batch Management</h1>
                <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                    <Plus size={16} /> Add Batch
                </button>
            </div>

            <div className="flex gap-2">
                {["ALL", "EXPIRING", "EXPIRED"].map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filter === f ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white text-slate-600 border-slate-200"}`}>
                        {f === "ALL" ? "All" : f === "EXPIRING" ? "Expiring Soon" : "Expired"}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <EmptyState title="No batches found" />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                                <th className="px-5 py-3">Medicine</th>
                                <th className="px-5 py-3">Batch No.</th>
                                <th className="px-5 py-3">Mfg Date</th>
                                <th className="px-5 py-3">Expiry Date</th>
                                <th className="px-5 py-3">Qty</th>
                                <th className="px-5 py-3">Expiry Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((b) => (
                                <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-800">{b.medicine_name}</td>
                                    <td className="px-5 py-3 text-slate-600">{b.batch_number}</td>
                                    <td className="px-5 py-3">{b.manufacturing_date}</td>
                                    <td className="px-5 py-3">{b.expiry_date}</td>
                                    <td className="px-5 py-3">{b.quantity}</td>
                                    <td className="px-5 py-3"><StatusBadge status={expiryLabel(b.expiry_date)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Batch">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Medicine</label>
                        <select value={fMed} onChange={(e) => setFMed(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                            <option value="">Select</option>
                            {medicines.map((m) => <option key={m.id} value={m.id}>{m.medicine_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
                        <input value={fBatch} onChange={(e) => setFBatch(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mfg Date</label>
                            <input type="date" value={fMfg} onChange={(e) => setFMfg(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                            <input type="date" value={fExp} onChange={(e) => setFExp(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                        <input type="number" min={0} value={fQty} onChange={(e) => setFQty(Number(e.target.value))} required className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800">Add Batch</button>
                </form>
            </Modal>
        </div>
    );
}
