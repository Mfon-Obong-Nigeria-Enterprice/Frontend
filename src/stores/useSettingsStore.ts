// src/stores/useSettingsStore.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { 
  Settings, 
  SystemPreferences, 
  ClientAccountSettings, 
  AlertAndNotificationSettings,
  MaintenanceModeSettings,
  SessionSettings } from "@/schemas/SettingsSchemas"
import { settingsService } from "@/services/settingsService";

interface SettingsStore {
  // State
  currentSettings: Settings;
  systemPreferences: SystemPreferences;
  clientAccountSettings: ClientAccountSettings;
  maintenanceMode: MaintenanceModeSettings;
  sessionSettings: SessionSettings;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  initializeSettings: (settings: Settings) => void;
  setAlertSetting: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  setLargeBalanceThreshold: (value: number) => void;
  setSystemPreferences: (prefs: SystemPreferences) => void;
  setClientAccountSettings: (settings: ClientAccountSettings) => void;
  updateMaintenanceMode: (settings: MaintenanceModeSettings) => void;
  updateSessionSettings: (settings: SessionSettings) => void;
  
  // API actions that use the service
  fetchSettings: () => Promise<void>;
  saveAllSettings: () => Promise<void>;
  toggleMaintenanceMode: (isActive: boolean) => Promise<void>;
}

// Default settings
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
  clientsDebtsAlert: false,
  largeBalanceAlert: false,
  lowStockAlert: false,
  inactivityAlerts: false,
  dashboardNotification: false,
  emailNotification: false
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // State
      currentSettings: defaultSettings,
      systemPreferences: defaultSettings.system,
      clientAccountSettings: defaultSettings.clientAccount,
      maintenanceMode: defaultMaintenanceMode,
      sessionSettings: defaultSessionSettings,
      loading: false,
      error: null,
      lastUpdated: null,

      // Actions
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

      // API actions that use the service
      fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
          const settings = await settingsService.fetchSettings();
          set({ 
            currentSettings: settings,
            systemPreferences: settings.system,
            clientAccountSettings: settings.clientAccount,
            loading: false,
            lastUpdated: new Date(),
          });
        } catch (err: any) {
          const errorMessage = err.message || 'Failed to fetch settings';
          set({ 
            error: errorMessage,
            loading: false 
          });
        }
      },

      saveAllSettings: async () => {
        set({ loading: true, error: null });
        
        try {
          const { currentSettings } = get();
          const updatedSettings = await settingsService.updateSettings(currentSettings);
          
          set({ 
            currentSettings: updatedSettings,
            loading: false,
            lastUpdated: new Date(),
          });
        } catch (err: any) {
          const errorMessage = err.message || 'Failed to save settings';
          set({ 
            error: errorMessage,
            loading: false 
          });
        }
      },
      
      toggleMaintenanceMode: async (isActive: boolean) => {
        set({ loading: true, error: null });
        
        try {
          const maintenanceMode = await settingsService.toggleMaintenanceMode(isActive);
          
          set({ 
            maintenanceMode,
            loading: false,
            lastUpdated: new Date(),
          });
        } catch (err: any) {
          const errorMessage = err.message || 'Failed to toggle maintenance mode';
          set({ 
            error: errorMessage,
            loading: false 
          });
          throw err;
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