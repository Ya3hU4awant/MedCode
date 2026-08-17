import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
    Building2, Pill, AlertTriangle, TrendingUp, ShieldCheck,
    LayoutDashboard, Package, FileWarning, Map, LogOut, FileText
} from "lucide-react";

export default function Sidebar({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const { user, logout } = useAuth();

    const pharmacistLinks = [
        { to: "/pharmacist/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/pharmacist/inventory", label: "Inventory", icon: Package },
        { to: "/pharmacist/batches", label: "Batches", icon: Pill },
        { to: "/pharmacist/shortages", label: "Report Shortage", icon: AlertTriangle },
        { to: "/pharmacist/medicines", label: "Medicine Catalog", icon: Map },
        { to: "/pharmacist/pharmacy", label: "Pharmacy Profile", icon: Building2 },
        { to: "/pharmacist/billing", label: "Generate Bill", icon: FileText },
    ];

    const govLinks = [
        { to: "/government/dashboard", label: "Monitoring Center", icon: LayoutDashboard },
        { to: "/government/pharmacies", label: "Pharmacy Network", icon: Building2 },
        { to: "/government/shortages", label: "Global Shortages", icon: FileWarning },
        { to: "/government/prices", label: "Price Intelligence", icon: TrendingUp },
        { to: "/government/alerts", label: "System Alerts", icon: ShieldCheck },
    ];

    const links = user?.role === "PHARMACIST" ? pharmacistLinks : govLinks;

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setOpen(false)}
            />

            <div className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#CBD5E1] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                <div className="h-20 flex items-center px-6 border-b border-[#CBD5E1]/60">
                    <div className="w-10 h-10 bg-[#0B1F3A] rounded-xl flex items-center justify-center mr-3 shadow-md">
                        <ShieldCheck className="text-[#19B5D8]" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#0B1F3A]">Med<span className="text-[#19B5D8]">Code</span></span>
                </div>

                <div className="px-5 py-4">
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4 px-2">Main Navigation</p>
                    <nav className="space-y-1.5 flex-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? "bg-gradient-to-r from-[#1769E0]/10 to-transparent text-[#1769E0]"
                                        : "text-[#64748B] hover:bg-[#F5F8FC] hover:text-[#0F172A]"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1769E0] rounded-r-full" />}
                                        <link.icon size={20} className={isActive ? "text-[#1769E0]" : "text-[#94A3B8] group-hover:text-[#1769E0] transition-colors"} />
                                        <span className="relative z-10">{link.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-5 border-t border-[#CBD5E1]/60">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
