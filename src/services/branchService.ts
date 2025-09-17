import api from "./baseApi";
import type { Branches } from "@/types/branches";

export const getAllBranches = async (): Promise<Branches[]> => {
  const response = await api.get("/branches");
  return response.data;
};

export const getBranchById = async (id: string): Promise<Branches> => {
  const response = await api.get(`/branches/${id}`);
  return response.data;
};

export const createBranch = async (branch: Omit<Branches, "_id" | "isActive" | "createdAt" | "updatedAt" | "__v">): Promise<Branches> => {
  const response = await api.post("/branches", branch);
  return response.data;
};

export const updateBranchById = async (id: string, branch: Partial<Branches>): Promise<Branches> => {
  const response = await api.patch(`/branches/${id}`, branch);
  return response.data;
};

export const deleteBranch = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/branches/${id}`);
  return response.data;
};
