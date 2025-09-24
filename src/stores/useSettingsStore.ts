/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Settings,
  SystemPreferences,
  ClientAccountSettings,
  AlertAndNotificationSettings,
  MaintenanceModeSettings,
  SessionSettings,
  ActiveHoursSettings,
} from "@/schemas/SettingsSchemas";
import * as settingsService from "@/services/settingsService";
import { getTabId, createTabSessionStorage } from "@/utils/tabSession";

interface SettingsStore {
  currentSettings: Settings;
  maintenanceMode: MaintenanceModeSettings;
  sessionSettings: SessionSettings;
  activeHours: ActiveHoursSettings | null;
  loading: boolean;
  error: string | null;

  // Local actions
  setAlertSetting: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  setLargeBalanceThreshold: (value: number) => void;
  setSystemPreferences: (prefs: SystemPreferences) => void;
  setClientAccountSettings: (settings: ClientAccountSettings) => void;

  // API actions
  toggleMaintenanceMode: () => Promise<void>;
  fetchActiveHours: () => Promise<void>;
  saveActiveHoursConfig: (
    config: Omit<
      ActiveHoursSettings,
      "_id" | "setBy" | "setByEmail" | "createdAt" | "updatedAt"
    >
  ) => Promise<ActiveHoursSettings>;
  deactivateActiveHours: () => Promise<void>;
  updateAlertSettings: (settings: { systemAlerts: boolean; loginAlerts: boolean }) => Promise<void>;
}

// ---------- Default states ----------
const defaultMaintenanceMode: MaintenanceModeSettings = {
  isActive: false,
  message: "",
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
    userLoginNotifications: false,
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
  emailNotification: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, _get) => ({
      currentSettings: defaultSettings,
      maintenanceMode: defaultMaintenanceMode,
      sessionSettings: defaultSessionSettings,
      activeHours: null,
      loading: false,
      error: null,

      // ---------- Local setters ----------
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

      setSystemPreferences: (prefs) =>
        set((state) => ({
          currentSettings: {
            ...state.currentSettings,
            system: prefs,
          },
        })),

      setClientAccountSettings: (settings) =>
        set((state) => ({
          currentSettings: {
            ...state.currentSettings,
            clientAccount: settings,
          },
        })),

      // ---------- Maintenance Mode ----------
      toggleMaintenanceMode: async () => {
        set({ loading: true, error: null });
        try {
          const maintenanceMode = await settingsService.toggleMaintenanceMode();
          
          // Force a complete state update to ensure persistence works
          set((state) => ({
            ...state,
            maintenanceMode,
            loading: false,
            error: null
          }));
        } catch (err: any) {
          set({
            error: err.message || "Failed to toggle maintenance mode",
            loading: false,
          });
          throw err;
        }
      },

      // ---------- Active Hours ----------
      fetchActiveHours: async () => {
        set({ loading: true, error: null });
        try {
          const status = await settingsService.getSessionStatus();
          set({ activeHours: status.activeHours || null, loading: false });
        } catch (err: any) {
          set({
            error: err.message || "Failed to fetch active hours",
            loading: false,
          });
        }
      },

      saveActiveHoursConfig: async (config) => {
        set({ loading: true, error: null });
        try {
          const activeHours = await settingsService.saveActiveHoursConfig(config);
          set({ activeHours, loading: false });
          return activeHours;
        } catch (err: any) {
          set({
            error: err.message || "Failed to save active hours",
            loading: false,
          });
          throw err;
        }
      },

      deactivateActiveHours: async () => {
        set({ loading: true, error: null });
        try {
          await settingsService.deactivateActiveHours();
          set({ activeHours: null, loading: false });
        } catch (err: any) {
          set({
            error: err.message || "Failed to deactivate active hours",
            loading: false,
          });
          throw err;
        }
      },

      // ---------- Alerts ----------
      updateAlertSettings: async (settings: { systemAlerts: boolean; loginAlerts: boolean }) => {
        set({ loading: true, error: null });
        try {
          const alertSettings = {
            systemHealthAlerts: settings.systemAlerts,
            userLoginNotifications: settings.loginAlerts,
          };

          set((state) => ({
            currentSettings: {
              ...state.currentSettings,
              alerts: {
                ...state.currentSettings.alerts,
                ...alertSettings,
              },
            },
            loading: false,
          }));
        } catch (err: any) {
          set({
            error: err.message || "Failed to update alert settings",
            loading: false,
          });
          throw err;
        }
      },
    }),
    {
      name: `settings-store-${getTabId()}`,
      storage: createTabSessionStorage(),
      partialize: (state) => ({
        currentSettings: state.currentSettings,
        maintenanceMode: state.maintenanceMode,
        sessionSettings: state.sessionSettings,
        activeHours: state.activeHours,
      }),
    }
  )
);