import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { type LoginResponse, type User } from "@/types/types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

const apiService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/login", {
        email: username,
        password,
      });

      const token = response.data.token || response.data.access_token;
      const rawUser = response.data.user || response.data;

      if (!token || !rawUser) {
        throw new Error("Invalid login response from server");
      }

      const user: User = {
        id: rawUser.id,
        name: rawUser.name,
        email: rawUser.email,
        role: rawUser.role,
        branch: rawUser.branch,
        isSetupComplete: rawUser.isSetupComplete ?? Boolean(rawUser.branch),
      };

      return {
        status: response.status,
        message: "Login Successful",
        data: { token, user },
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
  },

  logout: async (): Promise<void> => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      throw error;
    }
  },
};

export default apiService;
