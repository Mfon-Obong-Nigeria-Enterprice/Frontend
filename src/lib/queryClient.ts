import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: (failureCount: number, error) => {
        // Don't retry on 401/403 errors
        if (
          isAxiosError(error) &&
          (error?.response?.status === 401 || error?.response?.status === 403)
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Disable refetch on window focus for better UX
      refetchOnMount: false, // Don't refetch on mount if data exists
      refetchOnReconnect: true, // Refetch when reconnecting to internet
      // Enable background refetching for better UX
      refetchInterval: false, // Disable automatic background refetching by default
    },
    mutations: {
      retry: 1,
      onError: (error: unknown) => {
        let message = "An unexpected error occurred. Please try again.";
        if (typeof error === "object" && error !== null) {
          const err = error as {
            response?: { data?: { message?: string }; status?: number };
            message?: string;
          };
          message = err?.response?.data?.message || err?.message || message;
        }
        toast.error(message);
      },
    },
  },
});
