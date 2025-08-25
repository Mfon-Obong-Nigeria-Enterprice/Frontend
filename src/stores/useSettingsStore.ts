import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Settings } from "@/types/types";

interface SettingsStore {
  currentSettings: Settings;
  initializeSettings: (settings: Settings) => void;
  setSetting: (key: keyof Settings, value: boolean) => void;
  saveSettings: () => Promise<void>;
}

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
    (set, get) => ({
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
      
      saveSettings: async () => {
      
        const { currentSettings } = get();
        console.log("Saving settings:", currentSettings);
       
        return new Promise((resolve) => setTimeout(resolve, 500));
      },
    }),
    {
      name: "settings-store",
    }
  )
);