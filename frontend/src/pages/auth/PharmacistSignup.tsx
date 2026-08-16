import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, Phone, Building2, FileText, MapPin, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";

type Step = 1 | 2;

interface FormState {
    full_name: string; email: string; phone: string; password: string; confirm_password: string;
    pharmacy_name: string; license_number: string; address: string; district: string; state: string; pincode: string;
    latitude: number | null; longitude: number | null;
}

const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

export default function PharmacistSignup() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [form, setForm] = useState<FormState>({
        full_name: "", email: "", phone: "", password: "", confirm_password: "",
        pharmacy_name: "", license_number: "", address: "", district: "", state: "Maharashtra", pincode: "",
        latitude: null, longitude: null,
    });

    const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(f => ({ ...f, [field]: e.target.value }));
        setErrors(er => ({ ...er, [field]: undefined }));
    };

    const validateStep1 = () => {
        const e: Partial<Record<keyof FormState, string>> = {};
        if (!form.full_name.trim()) e.full_name = "Full name is required";
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address";
        if (!form.phone.match(/^\d{10}$/)) e.phone = "Enter a valid 10-digit phone number";
        if (form.password.length < 8) e.password = "Password must be at least 8 characters";
        if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        const e: Partial<Record<keyof FormState, string>> = {};
        if (!form.pharmacy_name.trim()) e.pharmacy_name = "Pharmacy name is required";
        if (!form.license_number.trim()) e.license_number = "License number is required";
        if (!form.address.trim()) e.address = "Address is required";
        if (!form.district.trim()) e.district = "District is required";
        if (!form.state) e.state = "State is required";
        if (!form.pincode.match(/^\d{6}$/)) e.pincode = "Enter a valid 6-digit pincode";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const getLocation = () => {
        navigator.geolocation?.getCurrentPosition(
            pos => setForm(f => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
            () => toast("Geolocation denied. You can proceed without coordinates.", "info")
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;
        setLoading(true);
        try {
            await api.post("/api/auth/register/", {
                full_name: form.full_name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                confirm_password: form.confirm_password,
                pharmacy_name: form.pharmacy_name,
                license_number: form.license_number,
                address: form.address,
                district: form.district,
                state: form.state,
                pincode: form.pincode,
                ...(form.latitude !== null && { latitude: form.latitude }),
                ...(form.longitude !== null && { longitude: form.longitude }),
            });
            setSuccess(true);
        } catch (err: any) {
            const data = err?.response?.data;
            if (data?.errors && typeof data.errors === "object") {
                setErrors(data.errors);
                step === 2 && (data.errors.email || data.errors.license_number) && setStep(1);
            } else {
                toast(data?.message || "Registration failed. Please try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Registration Submitted</h2>
                    <p className="text-[#64748B] leading-relaxed mb-8">
                        Your pharmacist account has been created successfully. Your pharmacy profile is <strong className="text-amber-600">pending verification</strong>. You will be notified once approved.
                    </p>
                    <button onClick={() => navigate("/login")} className="w-full bg-[#1769E0] text-white py-3.5 rounded-xl font-bold hover:bg-[#0B1F3A] transition-all shadow-lg">
                        Back to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    const Field = ({ label, field, type = "text", placeholder, icon: Icon }: { label: string; field: keyof FormState; type?: string; placeholder?: string; icon: React.ElementType }) => (
        <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">{label}</label>
            <div className="relative group">
                <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#1769E0] transition-colors pointer-events-none" />
                <input type={type} value={form[field] as string} onChange={set(field)} placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors[field] ? "border-red-400 bg-red-50" : "border-[#CBD5E1] bg-white"} text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20 focus:border-[#1769E0] transition-all shadow-sm`}
                />
            </div>
            {errors[field] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[field]}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="w-10 h-10 bg-[#0B1F3A] rounded-xl flex items-center justify-center">
                        <ShieldCheck className="text-[#19B5D8]" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#0B1F3A]">Med<span className="text-[#19B5D8]">Code</span></span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
                >
                    {/* Step indicator */}
                    <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Create Pharmacist Account</h2>
                        <p className="text-[#64748B] text-sm">Step {step} of 2 — {step === 1 ? "Account Information" : "Pharmacy Details"}</p>
                        <div className="flex gap-2 mt-4">
                            <div className="h-1.5 rounded-full bg-[#1769E0] flex-1" />
                            <div className={`h-1.5 rounded-full flex-1 transition-all ${step === 2 ? "bg-[#1769E0]" : "bg-slate-200"}`} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 py-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    <Field label="Full Name" field="full_name" icon={User} placeholder="Dr. Rajesh Kumar" />
                                    <Field label="Email Address" field="email" type="email" icon={Mail} placeholder="you@example.com" />
                                    <Field label="Phone Number" field="phone" icon={Phone} placeholder="9876543210" />
                                    <div>
                                        <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Password</label>
                                        <div className="relative group">
                                            <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#1769E0] transition-colors pointer-events-none" />
                                            <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min 8 characters"
                                                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${errors.password ? "border-red-400 bg-red-50" : "border-[#CBD5E1]"} text-sm focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20 focus:border-[#1769E0] transition-all`} />
                                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                                                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Confirm Password</label>
                                        <div className="relative">
                                            <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                                            <input type="password" value={form.confirm_password} onChange={set("confirm_password")} placeholder="Repeat password"
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.confirm_password ? "border-red-400 bg-red-50" : "border-[#CBD5E1]"} text-sm focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20 focus:border-[#1769E0] transition-all`} />
                                        </div>
                                        {errors.confirm_password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirm_password}</p>}
                                    </div>
                                    <button type="button" onClick={() => validateStep1() && setStep(2)}
                                        className="w-full mt-2 bg-[#1769E0] hover:bg-[#0B1F3A] text-white py-3 rounded-xl font-bold transition-all shadow-lg">
                                        Continue to Pharmacy Details →
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    <Field label="Pharmacy Name" field="pharmacy_name" icon={Building2} placeholder="e.g. HealthPlus Pharmacy" />
                                    <Field label="License Number" field="license_number" icon={FileText} placeholder="e.g. MH-CSN-2026-001" />
                                    <Field label="Address" field="address" icon={MapPin} placeholder="Street, Area" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="District" field="district" icon={MapPin} placeholder="District" />
                                        <div>
                                            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">State</label>
                                            <select value={form.state} onChange={set("state")}
                                                className={`w-full px-3 py-2.5 rounded-xl border ${errors.state ? "border-red-400" : "border-[#CBD5E1]"} text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20 focus:border-[#1769E0] bg-white`}>
                                                {STATES.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                        </div>
                                    </div>
                                    <Field label="Pincode" field="pincode" icon={MapPin} placeholder="6-digit pincode" />

                                    {form.latitude ? (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-emerald-700 font-medium">
                                            <MapPin size={16} /> Location captured: {form.latitude.toFixed(4)}, {form.longitude?.toFixed(4)}
                                        </div>
                                    ) : (
                                        <button type="button" onClick={getLocation} className="w-full py-2.5 rounded-xl border border-dashed border-[#CBD5E1] text-[#64748B] text-sm font-medium hover:border-[#1769E0] hover:text-[#1769E0] transition-colors flex items-center justify-center gap-2">
                                            <MapPin size={16} /> Use my current location (optional)
                                        </button>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#CBD5E1] text-[#64748B] font-semibold text-sm hover:bg-slate-50 transition-colors">
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                        <button type="submit" disabled={loading} className="flex-1 bg-[#16A34A] hover:bg-[#15803d] disabled:opacity-70 text-white py-3 rounded-xl font-bold transition-all shadow-lg">
                                            {loading ? "Submitting..." : "Create Pharmacist Account"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className="px-8 pb-6 text-center">
                        <p className="text-sm text-[#64748B]">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-[#1769E0] hover:text-[#0B1F3A] transition-colors">Sign in</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
