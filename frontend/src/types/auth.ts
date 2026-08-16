export interface User {
    id: string;
    email: string;
    username: string;
    full_name: string;
    phone: string;
    role: "PHARMACIST" | "GOVERNMENT";
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}
