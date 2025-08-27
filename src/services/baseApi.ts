import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach staff branchId
api.interceptors.request.use((config) => {
  const { user } = useAuthStore.getState();

  if ((user?.role === "STAFF" || user?.role === "ADMIN") && user.branchId) {
    const branchId = user.branchId;
    const userId = user.id;
    // ❌ Skip these endpoints
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

export default api;
