import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { type Settings, type AlertAndNotificationSettings } from '@/types/types';

interface NotificationSettingsSectionProps {
  settings: Settings;
  onSettingChange: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  isReadOnly?: boolean;
}

export const NotificationSettingsSection: React.FC<NotificationSettingsSectionProps> = ({
  settings,
  onSettingChange,
  isReadOnly = false,
}) => {
  const alerts = settings.alerts || {};

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="dashboardNotification"
            checked={alerts.dashboardNotification || false}
            onCheckedChange={(checked) => onSettingChange('dashboardNotification', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="dashboardNotification" className="text-gray-700">Dashboard Notification</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="emailNotification"
            checked={alerts.emailNotification || false}
            onCheckedChange={(checked) => onSettingChange('emailNotification', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="emailNotification" className="text-gray-700">Email Notification</Label>
        </div>
      </div>
    </div>
  );
};