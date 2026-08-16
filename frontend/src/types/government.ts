export interface DashboardData {
    total_pharmacies: number;
    active_pharmacies: number;
    medicines_monitored: number;
    shortage_alerts: number;
    critical_shortages: number;
    price_alerts: number;
    alert_severity_breakdown: Record<string, number>;
}

export interface PriceMonitorItem {
    medicine_id: string;
    medicine_name: string;
    avg_price: number;
    min_price: number;
    max_price: number;
    price_variation: number;
    pharmacies_affected: number;
    risk: string;
}
