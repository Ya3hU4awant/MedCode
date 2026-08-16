export interface Pharmacy {
    id: string;
    pharmacy_name: string;
    license_number: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    latitude: number | null;
    longitude: number | null;
    phone: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    created_at: string;
    updated_at: string;
}
