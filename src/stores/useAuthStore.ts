import { create } from "zustand";
import { type LoginUser } from "@/types/types";
import * as authService from "@/services/authService";
import api from "@/services/baseApi";

type AuthState = {
  user: LoginUser | null;

  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: LoginUser | null) => void;
  login: (email: string, password: string) => Promise<LoginUser>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isAuthenticated: false,
  loading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { accessToken, refreshToken, user } = await authService.login(
        email,
        password
      );
      console.log("Lofin successful, user data:", user);

      set({
        user,
        accessToken,
        refreshToken,
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
    console.log("Updating user with:", updates);
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...updates } : null;
      console.log("Updated user object:", updatedUser);
      return { user: updatedUser };
    });
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
