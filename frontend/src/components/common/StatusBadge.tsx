interface StatusBadgeProps {
    status: string;
}

const colorMap: Record<string, string> = {
    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    LOW: "bg-amber-50 text-amber-700 border-amber-200",
    "OUT OF STOCK": "bg-red-50 text-red-700 border-red-200",
    CRITICAL: "bg-red-50 text-red-700 border-red-200",
    HIGH: "bg-orange-50 text-orange-700 border-orange-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    OPEN: "bg-blue-50 text-blue-700 border-blue-200",
    ACKNOWLEDGED: "bg-purple-50 text-purple-700 border-purple-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE: "bg-slate-50 text-slate-500 border-slate-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    Normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Watch: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-orange-50 text-orange-700 border-orange-200",
    Critical: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const cls = colorMap[status] || "bg-slate-50 text-slate-600 border-slate-200";
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${cls}`}>
            {status}
        </span>
    );
}
