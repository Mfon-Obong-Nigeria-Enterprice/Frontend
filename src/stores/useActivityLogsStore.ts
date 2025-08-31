import { create } from "zustand";
import type { Role } from "@/types/types";

export type ActivityLogs = {
  _id: string;
  action: string;
  details: string;
  performedBy: string;
  role: Role;
  device: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ActivityLogsState = {
  activities: ActivityLogs[];
  setActivities: (activities: ActivityLogs[]) => void;
};

export const useActivityLogsStore = create<ActivityLogsState>((set) => ({
  activities: [],
  setActivities: (activities) => set({ activities }),
}));
