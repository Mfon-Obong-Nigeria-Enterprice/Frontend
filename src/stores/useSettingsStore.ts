import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings, SystemPreferences, ClientAccountSettings, AlertAndNotificationSettings } from "@/types/types";

interface SettingsStore {
  currentSettings: Settings;
  initializeSettings: (settings: Settings) => void;
  setAlertSetting: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  saveSettings: () => Promise<void>;
  systemPreferences: SystemPreferences;
  clientAccountSettings: ClientAccountSettings;
  setSystemPreferences: (prefs: SystemPreferences) => void;
  setClientAccountSettings: (settings: ClientAccountSettings) => void;
}

const defaultSettings: Settings = {
  alerts: {
    lowStockAlerts: false,
    expirationReminders: false,
    newProductNotifications: false,
    clientsDebtsAlert: false,
    CustomThresholdAlerts: false,
    LargeBalanceAlertThreshold: false,
    PriceChangeNotification: false,
    dashboardNotification: false,
    emailNotification: false,
    inactivityAlerts: false
  },
  system: {
    lowStockAlertThreshold: 15,
    maximumDiscount: 10,
    bulkDiscountThreshold: 10000,
    minimumPurchaseForBulkDiscount: 500,
    allowNegativeBalances: false,
  },
  clientAccount: {
    defaultCreditLimit: 800000,
    inactivePeriodDays: 30,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      currentSettings: defaultSettings,
      
      initializeSettings: (settings) => {
        set({ currentSettings: settings });
      },
      
      setAlertSetting: (key, value) => {
        set((state) => ({
          currentSettings: {
            ...state.currentSettings,
            alerts: {
              ...state.currentSettings.alerts,
              [key]: value,
            },
          },
        }));
      },
      
      saveSettings: async () => {
        const { currentSettings } = get();
        console.log("Saving settings:", currentSettings);
        return new Promise((resolve) => setTimeout(resolve, 500));
      },
      
      systemPreferences: defaultSettings.system,
      clientAccountSettings: defaultSettings.clientAccount,
      
      setSystemPreferences: (prefs) => set({ 
        systemPreferences: prefs,
        currentSettings: {
          ...get().currentSettings,
          system: prefs,
        }
      }),
      
      setClientAccountSettings: (settings) => set({ 
        clientAccountSettings: settings,
        currentSettings: {
          ...get().currentSettings,
          clientAccount: settings,
        }
      }),
    }),
    {
      name: "settings-store",
    }
  )
);