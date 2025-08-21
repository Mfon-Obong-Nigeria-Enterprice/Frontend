import api from "./baseApi";
import type { User } from "@/types/user";
import { AxiosError } from "axios";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching users:", err.response?.data || err.message);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
