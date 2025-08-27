import { create } from "zustand";
import { type LoginUser } from "@/types/types";
import * as authService from "@/services/authService";

type AuthState = {
  user: LoginUser | null;

  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: LoginUser | null) => void;
  login: (email: string, password: string) => Promise<LoginUser>;
  logout: () => Promise<void>;

  updateUser: (updates: Partial<LoginUser>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isAuthenticated: false,
  loading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { user } = await authService.login(email, password);

      set({
        user,

        isAuthenticated: true,
        loading: false,
      });
      return user;
    } catch (error) {
      console.error("Login failed", error);
      set({ loading: false });
      throw error;
    }
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      console.warn("Logout request failed, clearing store anyway.");
    } finally {
      set({
        user: null,

        isAuthenticated: false,
      });
    }
  },
}));
