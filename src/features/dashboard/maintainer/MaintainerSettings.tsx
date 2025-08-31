/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { SettingsPage } from "./components/SettingsPage";
import { NotificationSettingsSection3 } from "./components/NotificationSettings3";
import { AlertSettingsSection3 } from "./components/AlertSettings3";
import type { Settings, AlertAndNotificationSettings } from "@/types/types";

export default function MaintainerSettings() {
  const [settings, setSettings] = useState<Settings>({
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
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to load settings from localStorage");
      }
    }
  }, []);

  const handleAlertSettingChange = (
    key: keyof AlertAndNotificationSettings,
    value: boolean
  ) => {
    // Update local state and localStorage
    const newSettings = {
      ...settings,
      alerts: {
        ...settings.alerts,
        [key]: value,
      },
    };

    setSettings(newSettings);
    localStorage.setItem("app-settings", JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your system preferences</p>
        </div>

        <SettingsPage />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Alert Preferences
          </h2>
          <AlertSettingsSection3
            settings={settings}
            onSettingChange={handleAlertSettingChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Notification Preferences
          </h2>
          <NotificationSettingsSection3
            settings={settings}
            onSettingChange={handleAlertSettingChange}
          />
        </div>
      </div>
    </div>
  );
}
