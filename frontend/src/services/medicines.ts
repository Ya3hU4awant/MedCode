import api from "./api";
import type { Medicine } from "../types";

export const getMedicines = (search?: string) =>
    api.get<{ data: Medicine[] }>("/medicines/", { params: search ? { search } : {} });
export const getMedicine = (id: string) => api.get<{ data: Medicine }>(`/medicines/${id}/`);
