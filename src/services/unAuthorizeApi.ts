import axios, { type AxiosInstance } from "axios";

// Public API client for unauthenticated endpoints
const resolvedPublicApiUrl = (() => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (import.meta.env.PROD) {
    if (!envUrl || envUrl === "/api" || envUrl === "/api/") {
      return "https://mfon-obong-enterprise-project-8otx.onrender.com/api";
    }
    return envUrl;
  }
  return envUrl ?? "/api";
})();

const publicApi: AxiosInstance = axios.create({
  baseURL: resolvedPublicApiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Don't send cookies or credentials
  timeout: 30000,
});

// Optional: Add basic request/response logging
publicApi.interceptors.request.use((config) => {
  console.log(
    `Public API Request: ${config.method?.toUpperCase()} ${config.url}`
  );
  return config;
});

publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      `Public API Error: ${error.response?.status || "Network Error"} ${
        error.config?.url
      }`
    );
    return Promise.reject(error);
  }
);

export default publicApi;
