import api from "./api";

export interface PublicPriceItem {
    medicine_id: string;
    medicine_name: string;
    avg_price: number;
    min_price: number;
    max_price: number;
    price_variation: number;
    pharmacies_count: number;
    total_stock: number;
    availability: string;
    risk: string;
}

export const getPublicPrices = (search?: string) =>
    api.get<{ data: PublicPriceItem[] }>("/public/prices/", {
        params: search ? { search } : {},
    });
