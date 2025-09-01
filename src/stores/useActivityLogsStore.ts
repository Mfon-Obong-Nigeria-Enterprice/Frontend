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
  // Computed stats getters
  getTotalActivityToday: () => number;
  getFailedLoginAttempts: () => number;
  getDataModifications: () => number;
};

export const useActivityLogsStore = create<ActivityLogsState>((set, get) => ({
  activities: [],

  setActivities: (activities) => set({ activities }),

  // Get total activity count for today
  getTotalActivityToday: () => {
    const activities = get().activities;
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    return activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= todayStart && activityDate < todayEnd;
    }).length;
  },

  // Get failed login attempts count
  getFailedLoginAttempts: () => {
    const activities = get().activities;
    return activities.filter(
      (activity) =>
        activity.action === "LOGIN_FAILED" ||
        activity.action === "FAILED_LOGIN" ||
        activity.details.toLowerCase().includes("failed") ||
        activity.details.toLowerCase().includes("unsuccessful") ||
        activity.details.toLowerCase().includes("invalid password")
    ).length;
  },

  // Get data modification count
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
