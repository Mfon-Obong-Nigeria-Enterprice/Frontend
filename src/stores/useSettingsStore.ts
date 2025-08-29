import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { 
  Settings, 
  SystemPreferences, 
  ClientAccountSettings, 
  AlertAndNotificationSettings,
  MaintenanceModeSettings,
  SessionSettings
} from "@/types/types";

interface SettingsStore {
  // Existing state
  currentSettings: Settings;
  systemPreferences: SystemPreferences;
  clientAccountSettings: ClientAccountSettings;
  
  // New state for maintenance and session
  maintenanceMode: MaintenanceModeSettings;
  sessionSettings: SessionSettings;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Existing actions
  initializeSettings: (settings: Settings) => void;
  setAlertSetting: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  setLargeBalanceThreshold: (value: number) => void;
  saveSettings: () => Promise<void>;
  setSystemPreferences: (prefs: SystemPreferences) => void;
  setClientAccountSettings: (settings: ClientAccountSettings) => void;

  // New actions for maintenance and session
  fetchSettings: () => Promise<void>;
  updateMaintenanceMode: (settings: MaintenanceModeSettings) => void;
  updateSessionSettings: (settings: SessionSettings) => void;
  saveAllSettings: () => Promise<void>;
}

// Default maintenance and session settings
const defaultMaintenanceMode: MaintenanceModeSettings = {
  enabled: false,
  message: "",
  scheduledStart: undefined,
  scheduledEnd: undefined,
};

const defaultSessionSettings: SessionSettings = {
  timeoutHours: 2,
  forceLogout: false,
};

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
    inactivityAlerts: false,
    systemHealthAlerts: false,
    userLoginNotifications: false
  },
  system: {
    lowStockAlertThreshold: 15,
    maximumDiscount: 10,
    bulkDiscountThreshold: 10000,
    minimumPurchaseForBulkDiscount: 500,
    allowNegativeBalances: false,
    largeBalanceThreshold: 50000, 
  },
  clientAccount: {
    defaultCreditLimit: 800000,
    inactivePeriodDays: 30,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // Existing state
      currentSettings: defaultSettings,
      systemPreferences: defaultSettings.system,
      clientAccountSettings: defaultSettings.clientAccount,
      
      // New state
      maintenanceMode: defaultMaintenanceMode,
      sessionSettings: defaultSessionSettings,
      loading: false,
      error: null,
      lastUpdated: null,

      // Existing actions
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
      
      setLargeBalanceThreshold: (value) => {
        set((state) => ({
          currentSettings: {
            ...state.currentSettings,
            system: {
              ...state.currentSettings.system,
              largeBalanceThreshold: value,
            },
          },
        }));
      },
      
      saveSettings: async () => {
        const { currentSettings } = get();
        console.log("Saving settings:", currentSettings);
        return new Promise((resolve) => setTimeout(resolve, 500));
      },
      
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

      // New actions for maintenance and session
      fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
          // Simulate API call - replace with your actual API
          const response = await fetch('/api/settings/maintenance-session');
          const data = await response.json();
          
          set({ 
            maintenanceMode: data.maintenanceMode || defaultMaintenanceMode,
            sessionSettings: data.sessionSettings || defaultSessionSettings,
            loading: false,
            lastUpdated: new Date(),
          });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Failed to fetch settings',
            loading: false 
          });
        }
      },

      updateMaintenanceMode: (maintenanceSettings) => {
        set({
          maintenanceMode: maintenanceSettings,
        });
      },

      updateSessionSettings: (sessionSettings) => {
        set({
          sessionSettings: sessionSettings,
        });
      },

      saveAllSettings: async () => {
        const { maintenanceMode, sessionSettings } = get();
        set({ loading: true, error: null });
        
        try {
          // Simulate API call - replace with your actual API
          const response = await fetch('/api/settings/maintenance-session', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ maintenanceMode, sessionSettings }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to save maintenance and session settings');
          }

          set({ 
            loading: false,
            lastUpdated: new Date(),
          });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Failed to save settings',
            loading: false 
          });
        }
      },
    }),
    {
      name: "settings-store",
      partialize: (state) => ({
        currentSettings: state.currentSettings,
        systemPreferences: state.systemPreferences,
        clientAccountSettings: state.clientAccountSettings,
        maintenanceMode: state.maintenanceMode,
        sessionSettings: state.sessionSettings,
      }),
    }
  )
);