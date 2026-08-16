import api from "./api";
import type { PriceMonitorItem } from "../types";

export const getGovDashboard = () => api.get("/government/dashboard/");
export const getGovPharmacies = () => api.get("/government/pharmacies/");
export const getGovPharmacy = (id: string) => api.get(`/government/pharmacies/${id}/`);
export const getGovShortages = () => api.get("/government/shortages/");
export const getGovPrices = () => api.get<{ data: { data: PriceMonitorItem[] } }>("/government/prices/");
export const getGovAlerts = () => api.get("/government/alerts/");
