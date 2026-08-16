import api from "./api";
import type { Medicine, Pharmacy } from "../types";

export const searchPublicMedicines = (search?: string) =>
    api.get<{ data: Medicine[] }>("/public/medicines/", { params: search ? { search } : {} });
export const getPublicMedicine = (id: string) => api.get(`/public/medicines/${id}/`);
export const getPublicPharmacies = () => api.get<{ data: Pharmacy[] }>("/public/pharmacies/");
export const getPublicPharmacy = (id: string) => api.get<{ data: Pharmacy }>(`/public/pharmacies/${id}/`);
