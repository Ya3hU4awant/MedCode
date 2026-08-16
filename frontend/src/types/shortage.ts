export interface ShortageReport {
    id: string;
    pharmacy: string;
    pharmacy_name: string;
    medicine: string;
    medicine_name: string;
    reported_quantity: number;
    threshold: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
    description: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
    resolved_by: string | null;
}
