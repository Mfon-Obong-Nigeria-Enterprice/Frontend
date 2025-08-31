/* eslint-disable @typescript-eslint/no-unused-vars */
// features/dashboard/manager/components/ManagerSettings.tsx
import { useState, useEffect } from "react";
import { SystemPreferencesForm } from "./component/SystemPreferanceForm.tsx";
import { ClientAccountSettingsForm } from "./component/ClientAccountSettingsForm";
import { NotificationSettingsSection1 } from "./component/NotificationSettings1";
import { AlertSettingsSection1 } from "./component/AlertSettingsSection1";
import type { Settings, AlertAndNotificationSettings } from "@/types/types";

export default function ManagerSettings() {
  const [settings, setSettings] = useState<Settings>({
    alerts: {
      lowStockAlerts: true,
      newProductNotifications: true,
      expirationReminders: true,
      clientsDebtsAlert: true,
      CustomThresholdAlerts: true,
      LargeBalanceAlertThreshold: true,
      PriceChangeNotification: false,
      dashboardNotification: false,
      emailNotification: false,
      inactivityAlerts: true,
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
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to load settings from localStorage');
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  const handleAlertSettingChange = (key: keyof AlertAndNotificationSettings, value: boolean) => {
    // Update local state only - no API call
    setSettings(prev => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [key]: value,
      },
    }));
  };

  const handleSystemThresholdChange = (key: string, value: number) => {
    // Update local state only - no API call
    setSettings(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [key]: value,
      },
    }));
  };

  const handleClientAccountChange = (key: string, value: number) => {
    // Update local state only - no API call
    setSettings(prev => ({
      ...prev,
      clientAccount: {
        ...prev.clientAccount,
        [key]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            System Configuration
          </h1>
          <p className="text-gray-600">
            Manage your system preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SystemPreferencesForm 
            settings={settings.system || {}}
            onThresholdChange={handleSystemThresholdChange}
          />
          <ClientAccountSettingsForm 
            settings={settings.clientAccount || {}}
            onThresholdChange={handleClientAccountChange}
          /> 
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Alert Preferences
          </h2>
          <AlertSettingsSection1
            settings={settings}
            onSettingChange={handleAlertSettingChange}
            onThresholdChange={handleSystemThresholdChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Notification Preferences
          </h2> 
          <NotificationSettingsSection1
            settings={settings}
            onSettingChange={handleAlertSettingChange}
          />
        </div>
      </div>
    </div>
  );
}