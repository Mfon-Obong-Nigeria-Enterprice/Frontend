// src/services/locationService.ts
import api from "@/lib/api"; // 👈 keep this, it uses your axios setup

export type CreateLocationPayload = {
  locationType?: string; 
  name?: string;         
  address: string;
  email?: string;
  phone?: string;
};

export type LocationResponse = {
  _id: string;
  name?: string;
  locationType?: string;
  address: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createLocation = async (
  payload: CreateLocationPayload
): Promise<LocationResponse> => {
  const res = await api.post("/branches", payload); // endpoint from Postman
  return res.data;
};
