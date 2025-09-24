import type { LoginUser } from "@/types/types";
import api from "./baseApi";

export const login = async (
  email: string,
  password: string
): Promise<{ user: LoginUser }> => {
  console.log("🔍 Login attempt starting...");
  console.log("📡 Full request URL:", `${api.defaults.baseURL}/auth/login`);
  
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log("✅ Login response:", response);

    const user = response.data.user;

    if (!user) {
      throw new Error("Invalid login response");
    }

    return { user };
  } catch (error: any) {
    console.error("❌ Login error:", error);
    console.error("🔍 Error details:", {
      message: error?.message,
      response: error?.response,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.config?.url
    });
    throw error;
  }
};

export const refreshToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; user: LoginUser }> => {
  const response = await api.post("/auth/refresh", {
    refresh_token: refreshToken,
  });

  const accessToken = response.data.access_token;
  const newRefreshToken = response.data.refresh_token;
  const user = response.data.user;

  if (!accessToken || !newRefreshToken) {
    throw new Error("Invalid refresh response");
  }

  return { accessToken, refreshToken: newRefreshToken, user };
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
