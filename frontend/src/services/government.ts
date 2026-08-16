import api from "./api";
import type { PriceMonitorItem } from "../types";

export const getGovDashboard = () => api.get("/api/government/dashboard/");
export const getGovPharmacies = () => api.get("/api/government/pharmacies/");
export const getGovPharmacy = (id: string) => api.get(`/api/government/pharmacies/${id}/`);
export const getGovShortages = () => api.get("/api/government/shortages/");
export const getGovPrices = () => api.get<{ data: { data: PriceMonitorItem[] } }>("/api/government/prices/");
export const getGovAlerts = () => api.get("/api/government/alerts/");
