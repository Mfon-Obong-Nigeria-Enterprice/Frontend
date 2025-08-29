import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { type Settings, type AlertAndNotificationSettings } from '@/types/types';

interface AlertSettingsSectionProps {
  settings: Settings;
  onSettingChange: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  isReadOnly?: boolean;
}

export const AlertSettingsSection: React.FC<AlertSettingsSectionProps> = ({
  settings,
  onSettingChange,
  isReadOnly = false,
}) => {
  // Safe access to alerts object with fallback
  const alerts = settings.alerts || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="flex items-center space-x-3 p-3 ">
          <Checkbox
            id="clientsDebtsAlert"
            checked={alerts.clientsDebtsAlert || false}
            onCheckedChange={(checked) => onSettingChange('clientsDebtsAlert', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="clientsDebtsAlert" className="text-gray-700 text-sm font-medium cursor-pointer">
            Clients Debts Alerts
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-3 ">
          <Checkbox
            id="LargeBalanceAlertThreshold"
            checked={alerts.LargeBalanceAlertThreshold || false}
            onCheckedChange={(checked) => onSettingChange('LargeBalanceAlertThreshold', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="LargeBalanceAlertThreshold" className="text-gray-700 text-sm font-medium cursor-pointer">
            Large Balance Alert
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-3 ">
          <Checkbox
            id="lowStockAlerts"
            checked={alerts.lowStockAlerts || false}
            onCheckedChange={(checked) => onSettingChange('lowStockAlerts', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="lowStockAlerts" className="text-gray-700 text-sm font-medium cursor-pointer">
            Low Stock Alerts
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-3 ">
          <Checkbox
            id="inactivityAlerts"
            checked={alerts.inactivityAlerts || false}
            onCheckedChange={(checked) => onSettingChange('inactivityAlerts', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="inactivityAlerts" className="text-gray-700 text-sm font-medium cursor-pointer">
            Inactivity Alerts
          </Label>
        </div>
      </div>
    </div>
  );
};