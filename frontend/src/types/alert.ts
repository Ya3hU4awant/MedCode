export interface Alert {
    id: string;
    alert_type: "SHORTAGE" | "PRICE" | "EXPIRY" | "REPORT" | "OTHER";
    title: string;
    message: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    medicine: string | null;
    medicine_name: string | null;
    pharmacy: string | null;
    pharmacy_name: string | null;
    state: string | null;
    district: string | null;
    is_read: boolean;
    created_at: string;
}
