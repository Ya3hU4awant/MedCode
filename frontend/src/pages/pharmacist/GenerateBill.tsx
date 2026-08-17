import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getInventory } from "../../services/inventory";
import { getMedicines } from "../../services/medicines";
import { getMyPharmacy } from "../../services/pharmacy";
import type { InventoryItem } from "../../types/inventory";
import type { Medicine } from "../../types/medicine";
import type { Pharmacy } from "../../types/pharmacy";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import { Plus, Trash2, FileText, Download } from "lucide-react";
import { jsPDF } from "jspdf";

interface BillItem {
    id: string;
    medicine_name: string;
    quantity: number;
    unit_price: number;
    gst_rate: number;
    gst_amount: number;
    total: number;
}

const GST_RATE = 18;

function generateBillNo() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `INV-${y}${m}-${rand}`;
}

export default function GenerateBill() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Bill state
    const [billItems, setBillItems] = useState<BillItem[]>([]);
    const [billNo] = useState(generateBillNo());
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    // Form state
    const [selectedMedicine, setSelectedMedicine] = useState("");
    const [qty, setQty] = useState(1);
    const [unitPrice, setUnitPrice] = useState("");

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [invRes, medRes] = await Promise.all([
                getInventory(),
                getMedicines(),
            ]);
            setInventory(invRes.data.data);
            setMedicines(medRes.data.data);
            try {
                const phRes = await getMyPharmacy();
                setPharmacy(phRes.data.data);
            } catch {
                // Pharmacy data not available - use fallback
            }
        } catch {
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // Auto-populate price when medicine is selected
    useEffect(() => {
        if (selectedMedicine) {
            const invItem = inventory.find(
                (i) => i.medicine === selectedMedicine || i.medicine_name === selectedMedicine
            );
            if (invItem) {
                setUnitPrice(invItem.selling_price);
            } else {
                setUnitPrice("");
            }
        }
    }, [selectedMedicine, inventory]);

    const addMedicine = () => {
        if (!selectedMedicine || qty < 1 || !unitPrice) {
            toast("Please select a medicine, quantity and price.", "warning");
            return;
        }
        const price = parseFloat(unitPrice);
        if (isNaN(price) || price <= 0) {
            toast("Enter a valid price.", "warning");
            return;
        }

        // Resolve medicine name
        const med = medicines.find((m) => m.id === selectedMedicine);
        const invItem = inventory.find(
            (i) => i.medicine === selectedMedicine || i.medicine_name === selectedMedicine
        );
        const name = med?.medicine_name ?? invItem?.medicine_name ?? selectedMedicine;

        const subtotal = price * qty;
        const gstAmt = (subtotal * GST_RATE) / 100;

        const item: BillItem = {
            id: Date.now().toString(),
            medicine_name: name,
            quantity: qty,
            unit_price: price,
            gst_rate: GST_RATE,
            gst_amount: gstAmt,
            total: subtotal + gstAmt,
        };

        setBillItems((prev) => [...prev, item]);
        setSelectedMedicine("");
        setQty(1);
        setUnitPrice("");
        toast("Medicine added to bill.");
    };

    const removeItem = (id: string) => {
        setBillItems((prev) => prev.filter((i) => i.id !== id));
    };

    const subtotal = billItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const totalGst = billItems.reduce((s, i) => s + i.gst_amount, 0);
    const grandTotal = subtotal + totalGst;

    const pharmacyName = pharmacy?.pharmacy_name ?? "MedCode Demo Pharmacy";
    const pharmacyAddress = pharmacy?.address
        ? `${pharmacy.address}, ${pharmacy.district}, ${pharmacy.state} - ${pharmacy.pincode}`
        : "123 Medical Lane, New Delhi, India";
    const pharmacyPhone = pharmacy?.phone ?? user?.phone ?? "9876543210";

    const generatePDF = () => {
        if (billItems.length === 0) {
            toast("Add at least one medicine to generate a bill.", "warning");
            return;
        }

        const doc = new jsPDF();
        const pw = doc.internal.pageSize.getWidth();
        let y = 15;

        // Header
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(11, 31, 58); // #0B1F3A
        doc.text("MEDCODE", pw / 2, y, { align: "center" });
        y += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(pharmacyName, pw / 2, y, { align: "center" });
        y += 5;
        doc.setFontSize(9);
        doc.text(pharmacyAddress, pw / 2, y, { align: "center" });
        y += 5;
        doc.text(`Phone: ${pharmacyPhone}`, pw / 2, y, { align: "center" });
        y += 8;

        // Horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.line(15, y, pw - 15, y);
        y += 8;

        // TAX INVOICE title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(23, 105, 224); // #1769E0
        doc.text("TAX INVOICE", pw / 2, y, { align: "center" });
        y += 10;

        // Bill info
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text(`Bill No: ${billNo}`, 15, y);
        doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, pw - 15, y, { align: "right" });
        y += 6;
        if (customerName) {
            doc.text(`Customer: ${customerName}`, 15, y);
            y += 5;
        }
        if (customerPhone) {
            doc.text(`Phone: ${customerPhone}`, 15, y);
            y += 5;
        }
        y += 5;

        // Table header
        doc.setDrawColor(200, 200, 200);
        doc.line(15, y, pw - 15, y);
        y += 6;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        const cols = [15, 85, 105, 130, 155, 175];
        doc.text("Medicine", cols[0], y);
        doc.text("Qty", cols[1], y);
        doc.text("Price (₹)", cols[2], y);
        doc.text("GST (%)", cols[3], y);
        doc.text("GST (₹)", cols[4], y);
        doc.text("Total (₹)", cols[5], y);
        y += 4;
        doc.line(15, y, pw - 15, y);
        y += 5;

        // Table rows
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        for (const item of billItems) {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }
            doc.text(item.medicine_name.substring(0, 30), cols[0], y);
            doc.text(String(item.quantity), cols[1], y);
            doc.text(item.unit_price.toFixed(2), cols[2], y);
            doc.text(`${item.gst_rate}%`, cols[3], y);
            doc.text(item.gst_amount.toFixed(2), cols[4], y);
            doc.text(item.total.toFixed(2), cols[5], y);
            y += 6;
        }

        y += 2;
        doc.line(15, y, pw - 15, y);
        y += 8;

        // Totals
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Subtotal:", pw - 70, y);
        doc.text(`₹${subtotal.toFixed(2)}`, pw - 15, y, { align: "right" });
        y += 6;
        doc.text(`GST (${GST_RATE}%):`, pw - 70, y);
        doc.text(`₹${totalGst.toFixed(2)}`, pw - 15, y, { align: "right" });
        y += 7;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(11, 31, 58);
        doc.text("Grand Total:", pw - 70, y);
        doc.text(`₹${grandTotal.toFixed(2)}`, pw - 15, y, { align: "right" });
        y += 12;

        doc.line(15, y, pw - 15, y);
        y += 8;

        // Footer
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text("Thank you for choosing our pharmacy.", pw / 2, y, { align: "center" });
        y += 5;
        doc.setFontSize(8);
        doc.text("This is a digitally generated demo invoice.", pw / 2, y, { align: "center" });

        doc.save(`MedCode_Bill_${billNo}.pdf`);
        toast("Bill generated successfully.");
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    // Determine available medicines for dropdown - prefer inventory items (has price), fallback to catalog
    const medicineOptions = inventory.length > 0
        ? inventory.map((i) => ({ value: i.medicine, label: i.medicine_name }))
        : medicines.map((m) => ({ value: m.id, label: m.medicine_name }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={24} className="text-[#1769E0]" />
                    Generate Bill
                </h1>
                <p className="text-slate-500 text-sm mt-1">Create a medicine bill for your customer.</p>
            </div>

            {/* Bill Info & Customer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Bill Information</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-[#64748B] text-xs">Bill Number</span>
                            <p className="font-semibold text-[#0F172A]">{billNo}</p>
                        </div>
                        <div>
                            <span className="text-[#64748B] text-xs">Date</span>
                            <p className="font-semibold text-[#0F172A]">{new Date().toLocaleDateString("en-IN")}</p>
                        </div>
                        <div>
                            <span className="text-[#64748B] text-xs">Pharmacy</span>
                            <p className="font-semibold text-[#0F172A]">{pharmacyName}</p>
                        </div>
                        <div>
                            <span className="text-[#64748B] text-xs">Address</span>
                            <p className="font-semibold text-[#0F172A] text-xs leading-tight">{pharmacyAddress}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Customer Details (Optional)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Customer Name</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Customer name"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="Phone number"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Medicine Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4">Add Medicine</p>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Medicine</label>
                        <select
                            value={selectedMedicine}
                            onChange={(e) => setSelectedMedicine(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="">Select medicine</option>
                            {medicineOptions.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-24">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Qty</label>
                        <input
                            type="number"
                            min={1}
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="w-32">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Price (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <button
                        onClick={addMedicine}
                        className="flex items-center gap-2 px-5 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all whitespace-nowrap"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
            </div>

            {/* Bill Table */}
            {billItems.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto"
                >
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase">
                                <th className="px-5 py-3">Medicine</th>
                                <th className="px-5 py-3 text-center">Qty</th>
                                <th className="px-5 py-3 text-right">Unit Price</th>
                                <th className="px-5 py-3 text-right">GST ({GST_RATE}%)</th>
                                <th className="px-5 py-3 text-right">Total</th>
                                <th className="px-5 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billItems.map((item) => (
                                <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-800">{item.medicine_name}</td>
                                    <td className="px-5 py-3 text-center">{item.quantity}</td>
                                    <td className="px-5 py-3 text-right font-mono">₹{item.unit_price.toFixed(2)}</td>
                                    <td className="px-5 py-3 text-right font-mono text-amber-600">₹{item.gst_amount.toFixed(2)}</td>
                                    <td className="px-5 py-3 text-right font-mono font-semibold">₹{item.total.toFixed(2)}</td>
                                    <td className="px-5 py-3 text-center">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="border-t border-slate-200 bg-slate-50 p-5">
                        <div className="flex flex-col items-end gap-2 max-w-xs ml-auto">
                            <div className="flex justify-between w-full text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between w-full text-sm text-amber-700">
                                <span>GST ({GST_RATE}%)</span>
                                <span className="font-mono">₹{totalGst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between w-full pt-2 border-t border-slate-300">
                                <span className="text-base font-bold text-[#0F172A]">Grand Total</span>
                                <span className="text-xl font-bold text-[#1769E0] font-mono">₹{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Generate PDF Button */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={generatePDF}
                disabled={billItems.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1769E0] to-[#0B1F3A] text-white rounded-xl font-bold text-base hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
                <Download size={20} />
                Generate Bill PDF
            </motion.button>
        </div>
    );
}
