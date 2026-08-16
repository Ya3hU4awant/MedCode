import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message = "Something went wrong", onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle size={40} className="text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">{message}</h3>
            <p className="text-sm text-slate-500 mt-1">Please try again or contact support.</p>
            {onRetry && (
                <button onClick={onRetry} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">
                    <RefreshCw size={14} /> Retry
                </button>
            )}
        </div>
    );
}
