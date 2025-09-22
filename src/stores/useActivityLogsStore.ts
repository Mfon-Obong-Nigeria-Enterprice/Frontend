/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/useActivityLogsStore.ts
import { create } from "zustand";
import type { Role } from "@/types/types";
import { getSystemActivityLogs } from "@/services/activityLogService"; // Import your API function

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
  loading: boolean;
  error: string | null;
  setActivities: (activities: ActivityLogs[]) => void;
  fetchActivities: () => Promise<void>; // Add this function
  getTotalActivityToday: () => number;
  getFailedLoginAttempts: () => number;
  getDataModifications: () => number;
};

export const useActivityLogsStore = create<ActivityLogsState>((set, get) => ({
  activities: [],
  loading: false,
  error: null,

  setActivities: (activities) => set({ activities }),

  // Add this function to fetch activities from API
  fetchActivities: async () => {
    set({ loading: true, error: null });
    try {
      const activities = await getSystemActivityLogs();
      set({ activities, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch activities",
        loading: false,
      });
    }
  },

  getTotalActivityToday: () => {
    const activities = get().activities;
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      return activityDate.getTime() >= today.getTime();
    }).length;
  },

  getFailedLoginAttempts: () => {
    const activities = get().activities;
    return activities.filter(
      (activity) =>
        activity.action.includes("FAILED") ||
        activity.details.toLowerCase().includes("failed") ||
        activity.details.toLowerCase().includes("unsuccessful") ||
        activity.details.toLowerCase().includes("invalid password")
    ).length;
  },

  getDataModifications: () => {
    const activities = get().activities;
    const modificationActions = [
      "USER_BLOCKED",
      "USER_UNBLOCKED",
      "USER_CREATED",
      "USER_UPDATED",
      "USER_DELETED",
      "TRANSACTION_CREATED",
      "STOCK_UPDATED",
      "CLIENT_TRANSACTION_ADDED",
      "PRODUCT_CREATED",
      "PRODUCT_UPDATED",
      "PRODUCT_DELETED",
      "INVENTORY_UPDATED",
    ];

    return activities.filter((activity) =>
      modificationActions.some(
        (action) =>
          activity.action.includes(action) ||
          activity.details.toLowerCase().includes(action.toLowerCase())
      )
    ).length;
  },
}));
