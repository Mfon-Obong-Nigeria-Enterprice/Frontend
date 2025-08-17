import api from "./baseApi";
import { type User } from "@/types/types";

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

// /** @format */

// import api from "./baseApi";
// import type { User } from "@/types/types";

// /**
//  * Login user with email/password.
//  * Returns accessToken (memory only) and user object.
//  */
// export const login = async (
//   email: string,
//   password: string
// ): Promise<{ accessToken: string; user: User }> => {
//   const { data } = await api.post("/auth/login", { email, password });

//   const accessToken = data.access_token ?? data.token;
//   const user = data.user;

//   if (!accessToken || !user) {
//     throw new Error("Invalid login response: missing token or user");
//   }

//   return { accessToken, user };
// };

// /**
//  * Logout user (backend should clear refresh token cookie).
//  */
// export const logout = async (): Promise<void> => {
//   await api.post("/auth/logout");
// };

// /**
//  * Refresh the access token using refresh token (HTTP-only cookie).
//  */
// export const refresh = async (): Promise<{ accessToken: string }> => {
//   const { data } = await api.post("/auth/refresh");

//   const accessToken = data.access_token ?? data.token;
//   if (!accessToken) {
//     throw new Error("Refresh failed: no access token in response");
//   }

//   return { accessToken };
// };
