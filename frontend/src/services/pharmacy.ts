import api from "./api";
import type { Pharmacy } from "../types";

export const getMyPharmacy = () => api.get<{ data: Pharmacy }>("/pharmacy/my-pharmacy/");
export const updatePharmacy = (data: Partial<Pharmacy>) => api.patch("/pharmacy/profile/", data);
