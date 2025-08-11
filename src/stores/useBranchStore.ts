import { create } from "zustand";
import type { Branches } from "@/types/branches";

type BranchState = {
  branches: Branches[];
  setBranches: (branches: Branches[]) => void;
  getBranchById: (id: string) => Branches | undefined;
};

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  setBranches: (branches) => set({ branches }),
  getBranchById: (id) => get().branches.find((b) => b._id === id),
}));
