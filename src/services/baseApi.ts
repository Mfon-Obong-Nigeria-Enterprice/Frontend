// services/baseApi.ts
import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors (unauthorized)
export const setupInterceptors = (navigate?: (path: string) => void) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Logging out...");
        await useAuthStore.getState().logout();

        if (navigate) {
          navigate("/"); // SPA navigation
        } else {
          window.location.href = "/"; // Fallback
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;
