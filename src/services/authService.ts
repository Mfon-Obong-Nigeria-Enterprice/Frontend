import api from "./baseApi";
import { type User } from "@/types/types";

export const login = async (
  email: string,
  password: string
): Promise<{ accessToken: string; user: User }> => {
  const response = await api.post("/auth/login", { email, password });

  const accessToken = response.data.access_token || response.data.token;
  const user = response.data.user;

  if (!accessToken || !user) {
    console.error("Login response missing token or user", response.data);
    throw new Error("Invalid login response");
  }

  return { accessToken, user };
};

export const logout = async (): Promise<void> => {
  // If the backend supports a logout endpoint, call it here
  // For now, we just clear in-memory store via `useAuthStore.logout()`
};
