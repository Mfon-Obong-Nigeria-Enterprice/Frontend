import { useState } from "react";
import { SystemPreferencesForm } from "./component/SystemPreferanceForm.tsx";
import { ClientAccountSettingsForm } from "./component/ClientAccountSettingsForm.tsx";
import { NotificationSettingsSection1 } from "./component/NotificationSettings1.tsx";
import { AlertSettingsSection1 } from "./component/AlertSettingsSection1.tsx";
import type { Settings } from "@/types/types.ts";

export default function ManagerSettings() {
  const [settings, setSettings] = useState<Settings>({
    lowStockAlerts: true,
    newProductNotifications: true,
    expirationReminders: true,
  } as unknown as Settings);

  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className=" mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            System Configuration
          </h1>
          <p className="text-gray-600">
            Manage your system preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SystemPreferencesForm />
          <ClientAccountSettingsForm /> 
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Alert Preferences
              </h2>


          <AlertSettingsSection1
            settings={settings}
            onSettingChange={handleSettingChange}
          />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Notification Preferences
              </h2> 
          <NotificationSettingsSection1
            settings={settings}
            onSettingChange={handleSettingChange}
          />
         </div>
        </div>
      
    </div>
  );
};