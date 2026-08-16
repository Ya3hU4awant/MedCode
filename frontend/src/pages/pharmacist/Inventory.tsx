import { useEffect, useState, type FormEvent } from "react";
import { getInventory, createInventory, updateInventory, deleteInventory } from "../../services/inventory";
import { getMedicines } from "../../services/medicines";
import type { InventoryItem } from "../../types/inventory";
import type { Medicine } from "../../types/medicine";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { useToast } from "../../context/ToastContext";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

function getStockStatus(qty: number) {
    if (qty === 0) return "OUT OF STOCK";
    if (qty <= 5) return "CRITICAL";
    if (qty <= 15) return "LOW";
    return "AVAILABLE";
}

export default function InventoryPage() {
    const { toast } = useToast();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);

    // Form state
    const [formMedicine, setFormMedicine] = useState("");
    const [formQty, setFormQty] = useState(0);
    const [formPrice, setFormPrice] = useState("");

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [invRes, medRes] = await Promise.all([getInventory(), getMedicines()]);
            setInventory(invRes.data.data);
            setMedicines(medRes.data.data);
        } catch {
            setError("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setFormMedicine("");
        setFormQty(0);
        setFormPrice("");
        setModalOpen(true);
    };

    const openEdit = (item: InventoryItem) => {
        setEditItem(item);
        setFormMedicine(item.medicine);
        setFormQty(item.quantity);
        setFormPrice(item.selling_price);
        setModalOpen(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (editItem) {
                await updateInventory(editItem.id, { quantity: formQty, selling_price: formPrice });
                toast("Inventory updated successfully");
            } else {
                await createInventory({ medicine: formMedicine, quantity: formQty, selling_price: formPrice });
                toast("Medicine added to inventory");
            }
            setModalOpen(false);
            load();
        } catch {
            toast("Failed to save inventory", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this inventory item?")) return;
        try {
            await deleteInventory(id);
            toast("Inventory item deleted");
            load();
        } catch {
            toast("Failed to delete", "error");
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    const filtered = inventory.filter((item) => {
        const matchSearch = item.medicine_name.toLowerCase().includes(search.toLowerCase());
        const status = getStockStatus(item.quantity);
        const matchFilter = filter === "ALL" || status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
                    <p className="text-slate-500 text-sm">Manage your pharmacy stock</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                    <Plus size={16} /> Add Medicine
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search medicines..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="ALL">All Status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="LOW">Low</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="OUT OF STOCK">Out of Stock</option>
                </select>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <EmptyState title="No inventory items" message="Add medicines to your inventory to get started." />
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                                <th className="px-5 py-3">Medicine</th>
                                <th className="px-5 py-3">Stock</th>
                                <th className="px-5 py-3">Price (₹)</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Updated</th>
                                <th className="px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-800">{item.medicine_name}</td>
                                    <td className="px-5 py-3">{item.quantity}</td>
                                    <td className="px-5 py-3">₹{item.selling_price}</td>
                                    <td className="px-5 py-3"><StatusBadge status={getStockStatus(item.quantity)} /></td>
                                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(item.updated_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex gap-1">
                                            <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-slate-100"><Pencil size={14} /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Update Inventory" : "Add Medicine to Inventory"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!editItem && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Medicine</label>
                            <select value={formMedicine} onChange={(e) => setFormMedicine(e.target.value)} required
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                <option value="">Select medicine</option>
                                {medicines.map((m) => <option key={m.id} value={m.id}>{m.medicine_name}</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                        <input type="number" min={0} value={formQty} onChange={(e) => setFormQty(Number(e.target.value))} required
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                        <input type="number" step="0.01" min={0} value={formPrice} onChange={(e) => setFormPrice(e.target.value)} required
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                        {editItem ? "Update" : "Add to Inventory"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
