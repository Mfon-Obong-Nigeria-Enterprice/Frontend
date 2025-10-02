import type { LoginUser } from "@/types/types";
import api from "./baseApi";

const LOCAL_ACCESS_KEY = "__mfon_access_token";
const LOCAL_REFRESH_KEY = "__mfon_refresh_token";

export const login = async (
  email: string,
  password: string
): Promise<{ user: LoginUser; accessToken?: string; refreshToken?: string }> => {
  const response = await api.post("/auth/login", { email, password });

  const user = response.data.user;
  const accessToken = response.data.access_token;
  const refreshToken = response.data.refresh_token;

  if (!user) {
    throw new Error("Invalid login response");
  }

  // If server returned tokens in body (useful for browsers that block cookies), persist them as fallback
  if (accessToken && refreshToken) {
    try {
      localStorage.setItem(LOCAL_ACCESS_KEY, accessToken);
      localStorage.setItem(LOCAL_REFRESH_KEY, refreshToken);
      // set default Authorization header for axios
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } catch (e) {
      // ignore storage errors
      console.warn("Failed to persist tokens locally", e);
    }
  }

  return { user, accessToken, refreshToken };
};

export const refreshToken = async (
  refreshTokenValue?: string
): Promise<{ accessToken: string; refreshToken: string; user: LoginUser }> => {
  // Prefer explicit refresh token; otherwise try localStorage fallback
  const token = refreshTokenValue || localStorage.getItem(LOCAL_REFRESH_KEY) || undefined;

  const body = token ? { refresh_token: token } : {};

  const response = await api.post("/auth/refresh", body);

  const accessToken = response.data.access_token;
  const newRefreshToken = response.data.refresh_token;
  const user = response.data.user;

  if (!accessToken || !newRefreshToken) {
    throw new Error("Invalid refresh response");
  }

  try {
    localStorage.setItem(LOCAL_ACCESS_KEY, accessToken);
    localStorage.setItem(LOCAL_REFRESH_KEY, newRefreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } catch (e) {
    console.warn("Failed to persist refreshed tokens locally", e);
  }

  return { accessToken, refreshToken: newRefreshToken, user };
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // ignore logout errors but continue clearing local tokens
    console.warn("Logout request failed", e);
  } finally {
    try {
      localStorage.removeItem(LOCAL_ACCESS_KEY);
      localStorage.removeItem(LOCAL_REFRESH_KEY);
      delete api.defaults.headers.common["Authorization"];
    } catch (e) {
      console.warn("Failed to clear local tokens", e);
    }
  }
};
