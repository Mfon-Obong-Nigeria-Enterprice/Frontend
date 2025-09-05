import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { type Settings, type AlertAndNotificationSettings } from '@/schemas/SettingsSchemas';

interface AlertSettingsSectionProps {
  settings: Settings;
  onSettingChange: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  isReadOnly?: boolean;
}

export const AlertSettingsSection3: React.FC<AlertSettingsSectionProps> = ({
  settings,
  onSettingChange,
  isReadOnly = false,
}) => {
  
  const alerts = settings.alerts || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* System Health and Performance Alerts */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="systemHealthAlerts"
            checked={alerts.systemHealthAlerts || false}
            onCheckedChange={(checked) => onSettingChange('systemHealthAlerts', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="systemHealthAlerts" className="text-gray-700 text-sm font-medium">
            System health and performance alerts
          </Label>
        </div>

        {/* User Login/Logout Notifications */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="userLoginNotifications"
            checked={alerts.userLoginNotifications || false}
            onCheckedChange={(checked) => onSettingChange('userLoginNotifications', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="userLoginNotifications" className="text-gray-700 text-sm font-medium">
            Notifications about user login/logout
          </Label>
        </div>
      </div>
    </div>
  );
};