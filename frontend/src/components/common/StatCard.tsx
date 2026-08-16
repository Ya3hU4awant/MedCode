import type { ReactNode } from "react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    color?: string;
    subtitle?: string;
}

export default function StatCard({ label, value, icon, color = "text-cyan-600 bg-cyan-50", subtitle }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-sm text-slate-500 font-medium truncate">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}
