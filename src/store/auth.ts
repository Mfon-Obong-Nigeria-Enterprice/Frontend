import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "@/services/api";
import { type LoginResponse, type User } from "@/types/types";

interface ErrorDetail {
  hasError: boolean;
  message: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  errors: Record<string, ErrorDetail>;

  setErrors: (field: string, hasError: boolean, message?: string) => void;
  setLoading: (loading: boolean) => void;
  resetStore: () => void;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      errors: {},

      setErrors: (field, hasError, message = "An error occurred") => {
        set((state) => ({
          errors: {
            ...state.errors,
            [field]: { hasError, message },
          },
        }));
      },

      setLoading: (loading) => set({ loading }),

      resetStore: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          errors: {},
          loading: false,
        });
        localStorage.removeItem("token");
      },

      login: async (username, password) => {
        try {
          set({ loading: true, errors: {} });
          const response = await apiService.login(username, password);
          const { user, token } = response.data;

          localStorage.setItem("token", token);

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return response;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Login failed";
          set({
            loading: false,
            errors: {
              login: { hasError: true, message: errorMessage },
            },
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiService.logout();
          get().resetStore();
        } catch (error) {
          console.error("Logout error:", error);
          // Even if logout API fails, we should still clear local state
          get().resetStore();
        }
      },
    }),
    { name: "mfonenterprise" }
  )
);
