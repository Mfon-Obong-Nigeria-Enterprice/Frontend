// features/dashboard/manager/components/ManagerSettings.tsx
import { useEffect } from "react";
import { SystemPreferencesForm } from "./component/SystemPreferanceForm.tsx";
import { ClientAccountSettingsForm } from "./component/ClientAccountSettingsForm";
import { NotificationSettingsSection1 } from "./component/NotificationSettings1";
import { AlertSettingsSection1 } from "./component/AlertSettingsSection1";
import { useSettingsStore } from "@/stores/useSettingsStore";
import type { AlertAndNotificationSettings } from "@/schemas/SettingsSchemas";

export default function ManagerSettings() {
  const {
    currentSettings,
    loading,
    error,
    setAlertSetting,
    setSystemPreferences,
    setClientAccountSettings,
    saveAllSettings,
    fetchSettings
  } = useSettingsStore();

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleAlertSettingChange = (key: keyof AlertAndNotificationSettings, value: boolean) => {
    setAlertSetting(key, value);
  };

  const handleSystemThresholdChange = (key: string, value: number) => {
    setSystemPreferences({
      ...currentSettings.system,
      [key]: value,
    });
  };

  const handleClientAccountChange = (key: string, value: number) => {
    setClientAccountSettings({
      ...currentSettings.clientAccount,
      [key]: value,
    });
  };

  const handleSaveSettings = async () => {
    try {
      await saveAllSettings();
      // You could add a success toast here if needed
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading settings: {error}</p>
          <button 
            onClick={fetchSettings}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              System Configuration
            </h1>
            <p className="text-gray-600">
              Manage your system preferences and notification settings
            </p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SystemPreferencesForm 
            settings={currentSettings.system}
            onThresholdChange={handleSystemThresholdChange}
          />
          <ClientAccountSettingsForm 
            settings={currentSettings.clientAccount}
            onThresholdChange={handleClientAccountChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Alert Preferences
          </h2>
          <AlertSettingsSection1
            settings={currentSettings}
            onSettingChange={handleAlertSettingChange}
            onThresholdChange={handleSystemThresholdChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Notification Preferences
          </h2>
          <NotificationSettingsSection1
            settings={currentSettings}
            onSettingChange={handleAlertSettingChange}
          />
        </div>
      </div>
    </div>
  );
}
