import { useEffect, useState } from "react";
import { getAlerts } from "../../services/alerts";
import type { Alert } from "../../types";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import ErrorState from "../../components/common/ErrorState";
import { AlertCircle, FileWarning, TrendingUp } from "lucide-react";

export default function GovAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const res = await getAlerts();
            setAlerts(res.data.data);
        } catch {
            setError("Failed to load alerts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState message={error} onRetry={load} />;

    const getIcon = (type: string) => {
        if (type === "SHORTAGE" || type === "REPORT") return <FileWarning className="text-red-500" size={20} />;
        if (type === "PRICE") return <TrendingUp className="text-amber-500" size={20} />;
        return <AlertCircle className="text-blue-500" size={20} />;
    };

    return (
        <div className="space-y-4 max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-900">System Alerts</h1>

            <div className="space-y-3">
                {alerts.map(a => (
                    <div key={a.id} className={`bg-white rounded-xl border p-4 shadow-sm flex items-start gap-4 ${a.is_read ? 'opacity-70 border-slate-200' : 'border-indigo-100 border-l-4 border-l-indigo-500'}`}>
                        <div className="mt-1">{getIcon(a.alert_type)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="font-semibold text-slate-900">{a.title}</h3>
                                <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{a.message}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <StatusBadge status={a.severity} />
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{a.alert_type}</span>
                                {a.pharmacy_name && <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">{a.pharmacy_name}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
