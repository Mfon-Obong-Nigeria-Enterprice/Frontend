import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { type Settings, type AlertAndNotificationSettings } from '@/types/types';

interface AlertSettingsSectionProps {
  settings: Settings;
  onSettingChange: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  isReadOnly?: boolean;
}

export const AlertSettingsSection1: React.FC<AlertSettingsSectionProps> = ({
  settings,
  onSettingChange,
  isReadOnly = false,
}) => {
  // Safe access to alerts object with fallback
  const alerts = settings.alerts || {};

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 ">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="clientsDebtsAlert"
            checked={alerts.clientsDebtsAlert || false}
            onCheckedChange={(checked) => onSettingChange('clientsDebtsAlert', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="clientsDebtsAlert" className="text-gray-700">Clients Debts Alerts</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="CustomThresholdAlerts"
            checked={alerts.CustomThresholdAlerts || false}
            onCheckedChange={(checked) => onSettingChange('CustomThresholdAlerts', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="CustomThresholdAlerts" className="text-gray-700">Custom Threshold Alerts</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="LargeBalanceAlertThreshold"
            checked={alerts.LargeBalanceAlertThreshold || false}
            onCheckedChange={(checked) => onSettingChange('LargeBalanceAlertThreshold', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="LargeBalanceAlertThreshold" className="text-gray-700">Large Balance Alert Threshold</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="PriceChangeNotification"
            checked={alerts.PriceChangeNotification || false}
            onCheckedChange={(checked) => onSettingChange('PriceChangeNotification', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="PriceChangeNotification" className="text-gray-700">Price Change Notification</Label>
        </div>
      </div>
    </div>
  );
};