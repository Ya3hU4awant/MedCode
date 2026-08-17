import api from "./api";

export interface ComplaintPayload {
    complaint_type: string;
    medicine_name?: string;
    pharmacy_name?: string;
    description: string;
    citizen_name?: string;
    contact_number?: string;
    location?: string;
}

export interface ComplaintResponse {
    reference_number: string;
    id: string;
    status: string;
    created_at: string;
}

export interface ComplaintItem {
    id: string;
    reference_number: string;
    complaint_type: string;
    medicine_name: string;
    pharmacy_name: string;
    description: string;
    citizen_name: string;
    contact_number: string;
    location: string;
    status: string;
    created_at: string;
}

export interface ComplaintSummary {
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
}

export const submitComplaint = (data: ComplaintPayload) =>
    api.post<{ data: ComplaintResponse }>("/complaints/submit/", data);

export const getGovernmentComplaints = (status?: string) =>
    api.get<{ data: { complaints: ComplaintItem[]; summary: ComplaintSummary } }>(
        "/complaints/government/",
        { params: status ? { status } : {} }
    );
