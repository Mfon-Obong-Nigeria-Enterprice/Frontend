import { NotificationSettingsSection3 } from "./components/NotificationSettings3";
import { AlertSettingsSection3 } from "./components/AlertSettings3";
import type { AlertAndNotificationSettings } from "@/schemas/SettingsSchemas";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { SettingsPage } from "./components/SettingsPage";



export default function MaintainerSettings() {
  const {
    currentSettings,
    error,
    setAlertSetting
  } = useSettingsStore();

  const handleAlertSettingChange = (
    key: keyof AlertAndNotificationSettings,
    value: boolean
  ) => {
    // Update settings in the store (local only)
    setAlertSetting(key, value);
  };

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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your system preferences</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
          </div>
        )}

       <SettingsPage/>
            
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Alert Preferences
          </h2>
          <AlertSettingsSection3
            settings={currentSettings}
            onSettingChange={handleAlertSettingChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Notification Preferences
          </h2>
          <NotificationSettingsSection3
            settings={currentSettings}
            onSettingChange={handleAlertSettingChange}
          />
        </div>
      </div>
    </div>
  );
}