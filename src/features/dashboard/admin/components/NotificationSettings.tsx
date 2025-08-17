import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { type Settings } from '@/types/types';

interface NotificationSettingsSectionProps {
  settings: Settings;
  onSettingChange: (key: keyof Settings, value: boolean) => void;
  isReadOnly?: boolean;
}

export const NotificationSettingsSection: React.FC<NotificationSettingsSectionProps> = ({
  settings,
  onSettingChange,
  isReadOnly = false,
}) => {
  return (
    <div className="space-y-3">
      <div className='flex items-center gap-9'>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="dashboardNotification"
            checked={settings.dashboardNotification}
            onCheckedChange={(checked) => onSettingChange('dashboardNotification', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="dashboardNotification" className="text-gray-700">Dashboard Notification</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="emailNotification"
            checked={settings.emailNotification}
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