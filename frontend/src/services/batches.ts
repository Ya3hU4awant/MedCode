import api from "./api";

export const getBatches = () => api.get("/pharmacy/batches/");
export const createBatch = (data: { medicine: string; batch_number: string; manufacturing_date: string; expiry_date: string; quantity: number }) =>
    api.post("/pharmacy/batches/", data);
export const updateBatch = (id: string, data: Record<string, unknown>) => api.patch(`/pharmacy/batches/${id}/`, data);
export const deleteBatch = (id: string) => api.delete(`/pharmacy/batches/${id}/`);
