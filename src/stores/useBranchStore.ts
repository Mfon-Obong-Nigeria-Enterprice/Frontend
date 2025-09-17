import { create } from "zustand";
import type { Branches } from "@/types/branches";
import {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranchById,
  deleteBranch,
} from "@/services/branchService";

type BranchState = {
  branches: Branches[];
  selectedBranch?: Branches;
  setBranches: (branches: Branches[]) => void;
  fetchBranches: () => Promise<void>;
  fetchBranchById: (id: string) => Promise<Branches | undefined>;
  addBranch: (branch: Omit<Branches, "_id" | "isActive" | "createdAt" | "updatedAt" | "__v">) => Promise<void>;
  editBranch: (id: string, updates: Partial<Branches>) => Promise<void>;
  removeBranch: (id: string) => Promise<void>;
};

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  selectedBranch: undefined,

  setBranches: (branches) => set({ branches }),

  fetchBranches: async () => {
    const data = await getAllBranches();
    set({ branches: data });
  },

  fetchBranchById: async (id) => {
    const data = await getBranchById(id);
    set({ selectedBranch: data });
    return data;
  },

  addBranch: async (branch) => {
    const newBranch = await createBranch(branch);
    set({ branches: [...get().branches, newBranch] });
  },

  editBranch: async (id, updates) => {
    const updated = await updateBranchById(id, updates);
    set({
      branches: get().branches.map((b) => (b._id === id ? updated : b)),
    });
  },

  removeBranch: async (id) => {
    await deleteBranch(id);
    set({
      branches: get().branches.filter((b) => b._id !== id),
    });
  },
}));
