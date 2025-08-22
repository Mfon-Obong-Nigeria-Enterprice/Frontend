import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Settings } from "@/types/types";

interface SettingsStore {
  currentSettings: Settings;
  initializeSettings: (settings: Settings) => void;
  setSetting: (key: keyof Settings, value: boolean) => void;
}

// Default settings
const defaultSettings: Settings = {
  clientsDebtsAlert: false,
  largeBalanceAlert: false,
  lowStockAlert: false,
  inactivityAlerts: false,
  dashboardNotification: false,
  emailNotification: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      currentSettings: defaultSettings,
      
      initializeSettings: (settings) => {
        set({ currentSettings: settings });
      },
      
      setSetting: (key, value) => {
        set((state) => ({
          currentSettings: {
            ...state.currentSettings,
            [key]: value,
          },
        }));
      },
    }),
    {
      name: "settings-store",
    }
  )
);