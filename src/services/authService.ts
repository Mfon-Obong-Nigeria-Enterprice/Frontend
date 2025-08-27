import api from "./baseApi";

export const login = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
  const response = await api.post("/auth/login", { email, password });

  const accessToken = response.data.access_token;
  const refreshToken = response.data.refresh_token;
  const user = response.data.user;

  if (!accessToken || !refreshToken || !user) {
    console.error("Login response missing token or user", response.data);
    throw new Error("Invalid login response");
  }

  return { accessToken, refreshToken, user };
};

export const refreshToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
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
