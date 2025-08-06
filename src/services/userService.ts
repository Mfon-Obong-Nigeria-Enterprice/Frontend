// import api from "./baseApi";
// import localforage from "localforage";
// import type { User } from "@/types/user";
// import { AxiosError } from "axios";

// export const getAllUsers = async (): Promise<User[]> => {
//   const token = await localforage.getItem<string>("access_token");
//   if (!token) throw new Error("No access token found");

//   try {
//     const response = await api.get("/users", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     const err = error as AxiosError;
//     console.error("Error fetching users:", err.response?.data || err.message);
//     throw error;
//   }
// };

// export const getUserById = async (id: string): Promise<User> => {
//   const response = await api.get(`/users/${id}`);
//   return response.data;
// };
