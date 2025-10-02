// features/dashboard/super-admin/components/DashboardSettings.tsx
import * as React from "react";
import { AlertSettingsSection } from "./components/AlertSettings";
import { PriceUpdateTableSection } from "./components/PriceUpdate";
import { useInventoryStore } from "@/stores/useInventoryStore";
import {
  type AlertAndNotificationSettings,
  type Settings,
} from "@/schemas/SettingsSchemas";
import { useHasRole } from "@/lib/roles";
import { toast } from "react-toastify";

// Default settings structure
const defaultSettings: Settings = {
  alerts: {
    lowStockAlerts: false,
    newProductNotifications: false,
    expirationReminders: false,
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

export function DashboardSettings() {
  const canModifySettings = useHasRole(["SUPER_ADMIN", "ADMIN"]);
  const canModifyPrices = useHasRole(["SUPER_ADMIN", "ADMIN", "MAINTAINER"]);

  const { products: storeProducts } = useInventoryStore();

  const [localSettings, setLocalSettings] =
    React.useState<Settings>(defaultSettings);

  const handleSettingChange = (
    key: keyof AlertAndNotificationSettings,
    value: boolean
  ) => {
    if (!canModifySettings) return;

    setLocalSettings((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [key]: value,
      },
    }));

    // Optional: store in localStorage for persistence
    localStorage.setItem(
      "app-settings",
      JSON.stringify({
        ...localSettings,
        alerts: { ...localSettings.alerts, [key]: value },
      })
    );
  };

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      try {
        setLocalSettings(JSON.parse(savedSettings));
      } catch {
        toast.error("Failed to load settings from localStorage");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Settings & Configurations
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your system preferences</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* 🔔 Alert Settings */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Alert Settings
            </h2>
            <AlertSettingsSection
              settings={localSettings}
              onSettingChange={handleSettingChange}
              isReadOnly={!canModifySettings}
            />
          </div>


          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <PriceUpdateTableSection
              products={storeProducts}
              isReadOnly={!canModifyPrices}
            />
          </div>
        </div>
      </div>
    </div>
  );
}