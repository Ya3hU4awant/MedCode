import { Inbox } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    message?: string;
}

export default function EmptyState({ title = "No data", message = "There's nothing here yet." }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox size={40} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{message}</p>
        </div>
    );
}
