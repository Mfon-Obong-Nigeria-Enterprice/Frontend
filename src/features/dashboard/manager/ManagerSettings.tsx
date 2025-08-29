import { useState, useEffect } from "react";
import { SystemPreferencesForm } from "./component/SystemPreferanceForm.tsx";
import { ClientAccountSettingsForm } from "./component/ClientAccountSettingsForm";
import { NotificationSettingsSection1 } from "./component/NotificationSettings1";
import { AlertSettingsSection1 } from "./component/AlertSettingsSection1";
import { useSystemSettings, useUpdateSystemSettings } from "@/hooks/useSetting";
import type { Settings, AlertAndNotificationSettings } from "@/types/types";

// Mapping between frontend and API keys
const alertMapping = {
  lowStockAlerts: 'lowStockAlert',
  newProductNotifications: 'newProductNotification',
  expirationReminders: 'expirationReminder',
  clientsDebtsAlert: 'debtAlert',
  CustomThresholdAlerts: 'customThresholdAlert',
  LargeBalanceAlertThreshold: 'largeBalanceAlert',
  PriceChangeNotification: 'priceChangeNotification',
  dashboardNotification: 'dashboardNotification',
  emailNotification: 'emailNotification',
  inactivityAlerts: 'inactivityAlert',
  systemHealthAlerts: 'systemHealthAlert',
  userLoginNotifications: 'userLoginNotification',
} as const;

const systemMapping = {
  lowStockAlertThreshold: 'lowStockThreshold',
  maximumDiscount: 'maxDiscount',
  bulkDiscountThreshold: 'bulkDiscountThreshold',
  minimumPurchaseForBulkDiscount: 'minPurchaseForBulkDiscount',
  allowNegativeBalances: 'allowNegativeBalance',
  largeBalanceThreshold: 'largeBalanceThreshold',
} as const;

const clientAccountMapping = {
  defaultCreditLimit: 'defaultCreditLimit',
  inactivePeriodDays: 'inactivePeriodDays',
} as const;

export default function ManagerSettings() {
  const { data: systemSettings } = useSystemSettings();
  const updateSystemSettingsMutation = useUpdateSystemSettings();
  const [settings, setSettings] = useState<Settings>({
    alerts: {
      lowStockAlerts: true,
      newProductNotifications: true,
      expirationReminders: true,
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
  });

  useEffect(() => {
    if (systemSettings) {
      setSettings(systemSettings);
    }
  }, [systemSettings]);

  const handleAlertSettingChange = async (key: keyof AlertAndNotificationSettings, value: boolean) => {
    try {
      // Optimistically update UI first for instant feedback
      setSettings(prev => ({
        ...prev,
        alerts: {
          ...prev.alerts,
          [key]: value,
        },
      }));

      const apiKey = alertMapping[key];
      await updateSystemSettingsMutation.mutateAsync({ [apiKey]: value });
      
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.error("Failed to update setting:", error);
      }
      // Revert on error
      setSettings(prev => ({
        ...prev,
        alerts: {
          ...prev.alerts,
          [key]: !value,
        },
      }));
    }
  };

  const handleSystemThresholdChange = async (key: string, value: number) => {
    try {
      setSettings(prev => ({
        ...prev,
        system: {
          ...prev.system,
          [key]: value,
        },
      }));

      const apiKey = systemMapping[key as keyof typeof systemMapping];
      await updateSystemSettingsMutation.mutateAsync({ [apiKey]: value });
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.error("Failed to update system threshold:", error);
      }
    }
  };

  const handleClientAccountChange = async (key: string, value: number) => {
    try {
      setSettings(prev => ({
        ...prev,
        clientAccount: {
          ...prev.clientAccount,
          [key]: value,
        },
      }));

      const apiKey = clientAccountMapping[key as keyof typeof clientAccountMapping];
      await updateSystemSettingsMutation.mutateAsync({ [apiKey]: value });
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.error("Failed to update client account setting:", error);
      }
    }
  }; // <-- This was the missing closing brace for the function

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
            settings={settings.system}
            onThresholdChange={handleSystemThresholdChange}
          />
          <ClientAccountSettingsForm 
            settings={settings.clientAccount}
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
