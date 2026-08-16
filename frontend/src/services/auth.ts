import api from "./api";

export const registerPharmacist = (data: {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
    pharmacy_name: string;
    license_number: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    latitude?: number | null;
    longitude?: number | null;
}) => api.post("/auth/register/", data);

export const login = (email: string, password: string) =>
    api.post("/auth/login/", { email, password });

export const getMe = () => api.get("/auth/me/");

export const refreshToken = (refresh: string) =>
    api.post("/auth/token/refresh/", { refresh });
