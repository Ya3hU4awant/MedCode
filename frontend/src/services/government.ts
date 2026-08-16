import api from "./api";
import type { DashboardData, PriceMonitorItem, Pharmacy, ShortageReport, Alert } from "../types";

export const getGovDashboard = () => api.get<{ data: DashboardData }>("/government/dashboard/");
export const getGovPharmacies = () => api.get<{ data: Pharmacy[] }>("/government/pharmacies/");
export const getGovPharmacy = (id: string) => api.get<{ data: Pharmacy & { inventory: unknown[] } }>(`/government/pharmacies/${id}/`);
export const getGovShortages = () => api.get<{ data: ShortageReport[] }>("/government/shortages/");
export const getGovAlerts = () => api.get<{ data: Alert[] }>("/government/alerts/");
export const getGovPrices = () => api.get<{ data: PriceMonitorItem[] }>("/government/prices/");
export const createGovAction = (data: { alert: string; action_type: string; notes?: string }) =>
    api.post("/government/actions/", data);
