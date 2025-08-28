import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/stores/useAuthStore";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

// prevent multiple refresh calls at once
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach staff branchId
api.interceptors.request.use((config) => {
  const { user } = useAuthStore.getState();

  if ((user?.role === "STAFF" || user?.role === "ADMIN") && user.branchId) {
    const branchId = user.branchId;
    const userId = user.id;

    // Skip these endpoints
    const excludedEndpoints = ["/categories", "/clients"];

    // Check if excluded
    const isExcluded = excludedEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isExcluded) {
      return config;
    }

    // 1️⃣ If URL has `/branch/:id` → replace it
    if (config.url?.includes("/branch/")) {
      // e.g. /transactions/branch/ → /transactions/branch/{branchId}
      config.url = config.url.replace(/\/branch(\/)?$/, `/branch/${branchId}`);
    }

    // exclude branchid for staff for /user endpoint
    if (config.url?.includes("/user/")) {
      // e.g. /transactions/branch/ → /transactions/branch/{branchId}
      config.url = config.url.replace(/\/user(\/)?$/, `/user/${userId}`);
    }
  }

  return config;
});

// 🔴 Response interceptor for 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // const originalRequest: any = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue up requests until refresh finishes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        await api.post("/auth/refresh");

        processQueue(null);
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout(); // clear local state
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
