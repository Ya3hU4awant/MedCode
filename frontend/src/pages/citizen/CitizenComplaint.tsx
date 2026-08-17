import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, LogOut, Send, CheckCircle } from "lucide-react";
import { submitComplaint } from "../../services/complaints";

const COMPLAINT_TYPES = [
    { value: "MEDICINE_UNAVAILABLE", label: "Medicine Unavailable" },
    { value: "INCORRECT_PRICE", label: "Incorrect Medicine Price" },
    { value: "PHARMACY_ISSUE", label: "Pharmacy Issue" },
    { value: "EXPIRED_MEDICINE", label: "Expired Medicine" },
    { value: "OTHER", label: "Other" },
];

export default function CitizenComplaint() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [refNumber, setRefNumber] = useState("");
    const [error, setError] = useState("");

    const [complaintType, setComplaintType] = useState("");
    const [medicineName, setMedicineName] = useState("");
    const [pharmacyName, setPharmacyName] = useState("");
    const [description, setDescription] = useState("");
    const [citizenName, setCitizenName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await submitComplaint({
                complaint_type: complaintType,
                medicine_name: medicineName,
                pharmacy_name: pharmacyName,
                description,
                citizen_name: citizenName,
                contact_number: contactNumber,
                location,
            });
            setRefNumber(res.data.data.reference_number);
            setSuccess(true);
        } catch {
            setError("Failed to submit complaint. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses =
        "w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#19B5D8]/20 focus:border-[#19B5D8] transition-all";
    const labelClasses = "block text-sm font-semibold text-[#0F172A] mb-1.5";

    return (
        <div className="min-h-screen bg-[#F5F8FC]">
            {/* Header */}
            <header className="bg-white border-b border-[#CBD5E1] shadow-sm sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/citizen")}
                            className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="w-9 h-9 bg-[#0B1F3A] rounded-xl flex items-center justify-center">
                            <ShieldCheck className="text-[#19B5D8]" size={20} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#0B1F3A]">
                            Med<span className="text-[#19B5D8]">Code</span>
                        </span>
                        <span className="hidden sm:inline-block text-xs font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full ml-1">
                            Report Complaint
                        </span>
                    </div>
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                    >
                        <LogOut size={16} />
                        Exit
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {success ? (
                        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-10 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="text-emerald-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                                Complaint Submitted Successfully
                            </h2>
                            <p className="text-[#64748B] mb-4">
                                Your complaint has been registered and will be reviewed.
                            </p>
                            <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 mb-6">
                                <p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold mb-1">
                                    Your Reference Number
                                </p>
                                <p className="text-2xl font-bold text-[#1769E0] tracking-wide">
                                    {refNumber}
                                </p>
                            </div>
                            <p className="text-xs text-[#94A3B8] mb-6">
                                Please save this reference number for future correspondence.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => navigate("/citizen")}
                                    className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white font-semibold text-sm hover:bg-[#1E293B] transition-all"
                                >
                                    Back to Portal
                                </button>
                                <button
                                    onClick={() => {
                                        setSuccess(false);
                                        setComplaintType("");
                                        setDescription("");
                                        setMedicineName("");
                                        setPharmacyName("");
                                        setCitizenName("");
                                        setContactNumber("");
                                        setLocation("");
                                    }}
                                    className="px-6 py-2.5 rounded-xl border border-[#CBD5E1] text-[#0F172A] font-semibold text-sm hover:bg-[#F1F5F9] transition-all"
                                >
                                    Submit Another
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-[#0F172A]">Report a Complaint</h1>
                                <p className="text-[#64748B] text-sm mt-1">
                                    Report medicine availability, pricing or pharmacy-related issues.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-5">
                                {error && (
                                    <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className={labelClasses}>
                                        Complaint Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={complaintType}
                                        onChange={(e) => setComplaintType(e.target.value)}
                                        required
                                        className={inputClasses}
                                    >
                                        <option value="">Select complaint type</option>
                                        {COMPLAINT_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Medicine Name</label>
                                        <input
                                            type="text"
                                            value={medicineName}
                                            onChange={(e) => setMedicineName(e.target.value)}
                                            placeholder="e.g. Paracetamol 500mg"
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Pharmacy Name</label>
                                        <input
                                            type="text"
                                            value={pharmacyName}
                                            onChange={(e) => setPharmacyName(e.target.value)}
                                            placeholder="e.g. City Pharmacy"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>
                                        Complaint Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows={4}
                                        placeholder="Describe the issue in detail..."
                                        className={inputClasses + " resize-none"}
                                    />
                                </div>

                                <div className="border-t border-[#E2E8F0] pt-5">
                                    <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-4">
                                        Contact Information (Optional)
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>Your Name</label>
                                            <input
                                                type="text"
                                                value={citizenName}
                                                onChange={(e) => setCitizenName(e.target.value)}
                                                placeholder="Your name"
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Contact Number</label>
                                            <input
                                                type="tel"
                                                value={contactNumber}
                                                onChange={(e) => setContactNumber(e.target.value)}
                                                placeholder="e.g. 9876543210"
                                                className={inputClasses}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className={labelClasses}>Location</label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. City, District"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#1769E0] hover:bg-[#0B1F3A] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        "Submitting..."
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Submit Complaint
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
