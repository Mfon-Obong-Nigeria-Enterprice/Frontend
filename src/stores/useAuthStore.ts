import { create } from "zustand";
import localforage from "localforage";
import { type User } from "@/types/types";
import * as authService from "@/services/authService";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  isInitialized: false,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user, isAuthenticated: true }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { accessToken, user } = await authService.login(email, password);
      set({ user, accessToken, isAuthenticated: true, loading: false });
      await localforage.setItem("access_token", accessToken);
      await localforage.setItem("user", user);
    } catch (error) {
      console.error("Login failed", error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    await localforage.removeItem("access_token");
    await localforage.removeItem("user");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  // initialization
  initializeAuth: async () => {
    try {
      const [savedToken, savedUser] = await Promise.all([
        localforage.getItem<string>("access_token"),
        localforage.getItem<User>("user"),
      ]);

      if (savedToken && savedUser) {
        //validate token
        set({
          accessToken: savedToken,
          user: savedUser,
          isAuthenticated: true,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error("Failed to initialize auth from storage:", error);
      set({ isInitialized: true });
    }
  },
}));
