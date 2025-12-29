// features/dashboard/manager/components/ManagerSettings.tsx
import { SystemPreferencesForm } from "./component/SystemPreferanceForm.tsx";
import { ClientAccountSettingsForm } from "./component/ClientAccountSettingsForm";
// import { NotificationSettingsSection1 } from "./component/NotificationSettings1";
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
  } = useSettingsStore();

  // Note: Removed fetchSettings() since there's no /settings API endpoint

  const handleAlertSettingChange = (
    key: keyof AlertAndNotificationSettings,
    value: boolean
  ) => {
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 lg:px-0 w-full">
      <div className="  space-y-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              System Configuration
            </h1>
            <p className="text-gray-600">
              Manage your system preferences and notification settings
            </p>
          </div>
        </div>

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
      </div>
    </div>
  );
}
