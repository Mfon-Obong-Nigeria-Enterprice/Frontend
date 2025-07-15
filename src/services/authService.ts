import api from "./baseApi";
import { type User } from "@/types/types";

export const login = async (
  email: string,
  password: string
): Promise<{ accessToken: string; user: User }> => {
  const response = await api.post("/auth/login", { email, password });

  const accessToken = response.data.access_token || response.data.token;
  const user = response.data.user;
  console.log("LOGIN RESPONSE:", response.data);

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

// import api from "./baseApi";
// import localforage from "localforage";
// import { type User } from "@/types/types";

// const REFRESH_KEY = "refresh_token";

// export const login = async (
//   email: string,
//   password: string
// ): Promise<{ accessToken: string; user: User }> => {
//   const response = await api.post("/auth/login", { email, password });

//   const accessToken = response.data.access_token;
//   // const refreshToken = response.data.refresh_token;
//   const user = response.data.user;

//   console.log("LOGIN RESPONSE:", response.data);

//   if (!accessToken || !user) throw new Error("Invalid login response");

//   // await localforage.setItem(REFRESH_KEY, refreshToken);
//   return user;
//   // return { accessToken, user };
// };

// // export const logout = async () => {
// //   await localforage.removeItem("refresh_token");
// // };

// export const getRefreshToken = async () => {
//   return await localforage.getItem<string>(REFRESH_KEY);
// };

// export const refreshAccessToken = async (): Promise<{
//   accessToken: string;
//   user: User;
// }> => {
//   const refreshToken = await getRefreshToken();
//   if (!refreshToken) throw new Error("No refresh token found");

//   const response = await api.post("/auth/refresh", { refreshToken });

//   const accessToken = response.data.token;
//   const user: User = response.data.user;

//   if (!accessToken || !user)
//     throw new Error("Invalid refresh response from server");

//   return { accessToken, user };
// };
