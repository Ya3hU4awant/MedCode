import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface Toast {
    id: number;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

interface ToastContextType {
    toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    }, []);

    const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

    const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
    const colors = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm">
                {toasts.map((t) => {
                    const Icon = icons[t.type];
                    return (
                        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${colors[t.type]} animate-slide-in`}>
                            <Icon size={18} />
                            <span className="text-sm font-medium flex-1">{t.message}</span>
                            <button onClick={() => remove(t.id)}><X size={14} /></button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}
