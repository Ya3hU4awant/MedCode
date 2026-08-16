import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("medcode_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const refresh = localStorage.getItem("medcode_refresh_token");
      if (refresh) {
        try {
          const res = await axios.post("/api/auth/token/refresh/", { refresh });
          const newAccess = res.data.access;
          localStorage.setItem("medcode_access_token", newAccess);
          orig.headers.Authorization = `Bearer ${newAccess}`;
          return api(orig);
        } catch {
          localStorage.removeItem("medcode_access_token");
          localStorage.removeItem("medcode_refresh_token");
          localStorage.removeItem("medcode_user");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;