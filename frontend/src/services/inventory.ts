import api from "./api";
import type { InventoryItem } from "../types";

export const getInventory = () => api.get<{ data: InventoryItem[] }>("/pharmacy/inventory/");
export const createInventory = (data: { medicine: string; quantity: number; selling_price: string }) =>
    api.post("/pharmacy/inventory/", data);
export const updateInventory = (id: string, data: Partial<{ quantity: number; selling_price: string }>) =>
    api.patch(`/pharmacy/inventory/${id}/`, data);
export const deleteInventory = (id: string) => api.delete(`/pharmacy/inventory/${id}/`);
