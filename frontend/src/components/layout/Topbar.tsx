import { Menu, Search, Bell, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ setSidebarOpen }: { setSidebarOpen: (b: boolean) => void }) {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#CBD5E1] sticky top-0 z-30 flex items-center justify-between px-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl text-[#64748B] hover:bg-[#F5F8FC] transition-colors"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden sm:flex relative w-full max-w-md group">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#1769E0] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search medcode network..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F5F8FC] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20 focus:border-[#1769E0] transition-all focus:bg-white shadow-inner"
                    />
                </div>
            </div>

            <div className="flex items-center gap-5">
                <button className="relative p-2.5 rounded-full text-[#64748B] hover:bg-[#F5F8FC] hover:text-[#1769E0] transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-5 border-l border-[#CBD5E1]">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-bold text-[#0F172A] leading-tight">{user?.full_name}</p>
                        <p className="text-xs font-semibold text-[#1769E0]">{user?.role === "PHARMACIST" ? "Pharmacist" : "Government Officer"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B1F3A] to-[#1769E0] flex items-center justify-center text-white shadow-md">
                        <UserIcon size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
}
