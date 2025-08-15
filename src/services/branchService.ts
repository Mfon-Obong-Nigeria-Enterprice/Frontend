import api from "./baseApi";
import type { Branches } from "@/types/branches";
export const getAllBranches = async (): Promise<Branches[]> => {
  const response = await api.get("/branches");
  return response.data;
};

export const getBranchById = async (id: string) => {
  const response = await api.get(`/branches/${id}`);
  return response.data;
};
