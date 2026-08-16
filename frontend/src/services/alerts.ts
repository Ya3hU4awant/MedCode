import api from "./api";
import type { Alert } from "../types";

export const getAlerts = () => api.get<{ data: Alert[] }>("/government/alerts/");
