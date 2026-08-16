import { useEffect, useState } from "react";
import { getMyPharmacy, updatePharmacy } from "../../services/pharmacy";
import type { Pharmacy } from "../../types/pharmacy";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/common/StatusBadge";
import { useToast } from "../../context/ToastContext";
import { Building2, MapPin, Phone, FileText } from "lucide-react";

export default function PharmacyProfile() {
    const { toast } = useToast();
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [formPhone, setFormPhone] = useState("");
    const [formAddress, setFormAddress] = useState("");

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getMyPharmacy();
            setPharmacy(res.data.data);
            setFormPhone(res.data.data.phone || "");
            setFormAddress(res.data.data.address || "");
        } catch {
            setError("Failed to load pharmacy profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        try {
            await updatePharmacy({ phone: formPhone, address: formAddress });
            toast("Profile updated successfully");
            setEditing(false);
            load();
        } catch {
            toast("Failed to update profile", "error");
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;
    if (!pharmacy) return null;

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-900">Pharmacy Profile</h1>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{pharmacy.pharmacy_name}</h2>
                        <StatusBadge status={pharmacy.status} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-medium">License Number</label>
                        <p className="text-sm text-slate-800 flex items-center gap-1"><FileText size={14} /> {pharmacy.license_number}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-medium">District</label>
                        <p className="text-sm text-slate-800 flex items-center gap-1"><MapPin size={14} /> {pharmacy.district}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-medium">State</label>
                        <p className="text-sm text-slate-800">{pharmacy.state}</p>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase font-medium">Pincode</label>
                        <p className="text-sm text-slate-800">{pharmacy.pincode}</p>
                    </div>
                </div>

                {editing ? (
                    <div className="space-y-3 pt-3 border-t border-slate-200">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                            <textarea value={formAddress} onChange={(e) => setFormAddress(e.target.value)} rows={2}
                                className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium">Save</button>
                            <button onClick={() => setEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="pt-3 border-t border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase">Phone</label>
                                <p className="text-sm text-slate-800 flex items-center gap-1"><Phone size={14} /> {pharmacy.phone || "Not set"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase">Address</label>
                                <p className="text-sm text-slate-800">{pharmacy.address}</p>
                            </div>
                        </div>
                        <button onClick={() => setEditing(true)} className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
