import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard, Package, Pill, Boxes, AlertTriangle,
    TrendingUp, Building2, LogOut, X, ShieldCheck
} from "lucide-react";

const pharmacistNav = [
    { to: "/pharmacist/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/pharmacist/inventory", label: "Inventory", icon: Package },
    { to: "/pharmacist/medicines", label: "Medicines", icon: Pill },
    { to: "/pharmacist/batches", label: "Batches", icon: Boxes },
    { to: "/pharmacist/shortages", label: "Shortage Reports", icon: AlertTriangle },
    { to: "/pharmacist/pharmacy", label: "Pharmacy Profile", icon: Building2 },
];

const governmentNav = [
    { to: "/government/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/government/pharmacies", label: "Pharmacies", icon: Building2 },
    { to: "/government/shortages", label: "Shortages", icon: AlertTriangle },
    { to: "/government/prices", label: "Price Monitoring", icon: TrendingUp },
    { to: "/government/alerts", label: "Alerts", icon: ShieldCheck },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const nav = user?.role === "GOVERNMENT" ? governmentNav : pharmacistNav;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
            )}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-white flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                            <Pill size={18} />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Med<span className="text-cyan-400">Code</span></span>
                    </div>
                    <button className="lg:hidden" onClick={onClose}><X size={20} /></button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {nav.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
                            }
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-white/10">
                    <button onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white w-full transition-colors">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
