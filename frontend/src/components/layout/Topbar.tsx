import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface TopbarProps {
    onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={onMenuClick}>
                <Menu size={20} />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-sm font-bold">
                        {user?.full_name?.charAt(0) || "U"}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-800 leading-none">{user?.full_name}</p>
                        <p className="text-xs text-slate-500">{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
