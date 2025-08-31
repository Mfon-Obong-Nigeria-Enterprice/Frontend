// features/dashboard/manager/component/AlertSettingsSection1.tsx
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { type Settings, type AlertAndNotificationSettings } from '@/types/types';

interface AlertSettingsSectionProps {
  settings: Settings;
  onSettingChange: (key: keyof AlertAndNotificationSettings, value: boolean) => void;
  onThresholdChange: (key: string, value: number) => void;
  isReadOnly?: boolean;
}

export const AlertSettingsSection1: React.FC<AlertSettingsSectionProps> = ({
  settings,
  onSettingChange,
  onThresholdChange,
  isReadOnly = false,
}) => {
  
  const alerts = settings.alerts || {};
  const systemSettings = settings.system || {};
  
  const [localThreshold, setLocalThreshold] = React.useState(
    systemSettings.largeBalanceThreshold?.toString() || '50000'
  );

  React.useEffect(() => {
    setLocalThreshold(systemSettings.largeBalanceThreshold?.toString() || '50000');
  }, [systemSettings.largeBalanceThreshold]);

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalThreshold(value);
    
    if (value === '') {
      onThresholdChange('largeBalanceThreshold', 0);
      return;
    }
    
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      onThresholdChange('largeBalanceThreshold', numericValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="clientsDebtsAlert"
            checked={alerts.clientsDebtsAlert || false}
            onCheckedChange={(checked) => onSettingChange('clientsDebtsAlert', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="clientsDebtsAlert" className="text-gray-700 text-xs">Clients Debts Alerts</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="CustomThresholdAlerts"
            checked={alerts.CustomThresholdAlerts || false}
            onCheckedChange={(checked) => onSettingChange('CustomThresholdAlerts', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="CustomThresholdAlerts" className="text-gray-700 text-xs">Custom Threshold Alerts</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="LargeBalanceAlertThreshold"
            checked={alerts.LargeBalanceAlertThreshold || false}
            onCheckedChange={(checked) => onSettingChange('LargeBalanceAlertThreshold', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="LargeBalanceAlertThreshold" className="text-gray-700 text-xs">Large Balance Alert Threshold</Label>
          
          <Input
            type="number"
            value={localThreshold}
            onChange={handleThresholdChange}
            className="w-28"
            min="0"
            step="1"
            placeholder="Enter amount"
            disabled={isReadOnly}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="PriceChangeNotification"
            checked={alerts.PriceChangeNotification || false}
            onCheckedChange={(checked) => onSettingChange('PriceChangeNotification', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="PriceChangeNotification" className="text-gray-700 text-xs">Price Change Notification</Label>
        </div>
      </div>
    </div>
  );
};