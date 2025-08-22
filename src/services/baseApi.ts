import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true,
});

// Attach access token + staff branchId
api.interceptors.request.use((config) => {
  const { accessToken, user } = useAuthStore.getState();

  console.log("🔍 Interceptor - Request URL:", config.url);
  console.log("🔍 Interceptor - User role:", user?.role);
  console.log("🔍 Interceptor - Has accessToken:", !!accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if ((user?.role === "STAFF" || user?.role === "ADMIN") && user.branchId) {
    const branchId = user.branchId;
    const userId = user.id;
    // ❌ Skip these endpoints
    const excludedEndpoints = ["/categories", "/clients"];

    // Check if excluded
    const isExcluded = excludedEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // console.log("🔍 Interceptor - URL excluded:", isExcluded);

    if (isExcluded) {
      // console.log("🔍 Interceptor - Skipping branchId for:", config.url);
      return config;
    }

    // If request URL matches an excluded endpoint → just return config
    // if (excludedEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
    //   return config;
    // }

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

    // 2️⃣ Otherwise: decide based on method
    // else if (config.method === "get") {
    //   // Add as query param
    //   config.params = {
    //     ...config.params,
    //     branchId,
    //   };
    // }
    // else if (["post", "patch", "put"].includes(config.method ?? "")) {
    //   // Add into request body if JSON object
    //   if (config.data && typeof config.data === "object") {
    //     config.data = {
    //       ...config.data,
    //       branchId,
    //     };
    //   }
    // }
  }

  return config;
});

// api.interceptors.request.use((config) => {
//   const { accessToken, user } = useAuthStore.getState();

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   if ((user?.role === "STAFF" || user?.role === "ADMIN") && user.branchId) {
//     if (config.method === "get") {
//       // For GET requests -> send as query param
//       config.params = {
//         ...config.params,
//         branchId: user.branchId,
//       };
//     } else if (["post", "patch", "put"].includes(config.method ?? "")) {
//       // For write requests -> ensure branchId is in body
//       if (config.data && typeof config.data === "object") {
//         config.data = {
//           ...config.data,
//           branchId: user.branchId,
//         };
//       }
//     }
//   }

//   return config;
// });

// Handle 401 + auto refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Wait for the refresh to finish
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers)
                originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // raw axios instance to avoid interceptor recursion
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { withCredentials: true }
        );

        const newToken = response.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
