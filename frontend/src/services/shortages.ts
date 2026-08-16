import api from "./api";
import type { ShortageReport } from "../types";

export const getShortages = () => api.get<{ data: ShortageReport[] }>("/pharmacy/shortages/");
export const createShortage = (data: { medicine: string; reported_quantity: number; severity: string; description?: string }) =>
    api.post("/pharmacy/shortages/", data);
export const updateShortage = (id: string, data: Partial<ShortageReport>) =>
    api.patch(`/pharmacy/shortages/${id}/`, data);
