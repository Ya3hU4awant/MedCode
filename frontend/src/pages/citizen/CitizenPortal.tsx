import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Search, AlertTriangle, ArrowRight, LogOut } from "lucide-react";

export default function CitizenPortal() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F8FC]">
            {/* Header */}
            <header className="bg-white border-b border-[#CBD5E1] shadow-sm sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#0B1F3A] rounded-xl flex items-center justify-center">
                            <ShieldCheck className="text-[#19B5D8]" size={20} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#0B1F3A]">
                            Med<span className="text-[#19B5D8]">Code</span>
                        </span>
                        <span className="hidden sm:inline-block text-xs font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full ml-2">
                            Citizen Portal
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

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
                        Citizen Portal
                    </h1>
                    <p className="text-[#64748B] text-base sm:text-lg max-w-xl mx-auto">
                        Access medicine availability and pricing information or report an issue.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1 - Track Medicine */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#19B5D8]/30 transition-all duration-300 p-8 flex flex-col"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#19B5D8]/10 flex items-center justify-center mb-5 group-hover:bg-[#19B5D8]/20 transition-colors">
                            <Search className="text-[#19B5D8]" size={28} />
                        </div>
                        <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                            Track Medicine Price & Availability
                        </h2>
                        <p className="text-[#64748B] text-sm leading-relaxed mb-6 flex-1">
                            Check the latest medicine prices and availability across registered pharmacies.
                        </p>
                        <button
                            onClick={() => navigate("/citizen/medicines")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#19B5D8] hover:bg-[#0e97b8] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                        >
                            Track Medicine
                            <ArrowRight size={16} />
                        </button>
                    </motion.div>

                    {/* Card 2 - Report Complaint */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#F59E0B]/30 transition-all duration-300 p-8 flex flex-col"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center mb-5 group-hover:bg-[#F59E0B]/20 transition-colors">
                            <AlertTriangle className="text-[#F59E0B]" size={28} />
                        </div>
                        <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                            Report a Complaint
                        </h2>
                        <p className="text-[#64748B] text-sm leading-relaxed mb-6 flex-1">
                            Report medicine availability, pricing or pharmacy-related issues.
                        </p>
                        <button
                            onClick={() => navigate("/citizen/complaint")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                        >
                            Report Complaint
                            <ArrowRight size={16} />
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
