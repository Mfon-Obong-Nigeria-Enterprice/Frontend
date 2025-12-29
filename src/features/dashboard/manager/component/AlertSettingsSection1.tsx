// features/dashboard/manager/component/AlertSettingsSection1.tsx
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { type Settings, type AlertAndNotificationSettings } from '@/schemas/SettingsSchemas';

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
    <div className="">
      {/* Layout Logic:
         - Mobile: flex-col (vertical stack), gap-4
         - Desktop (md+): flex-row (horizontal line), gap-6, items-center
      */}
      <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap md:items-center gap-4">
        
        {/* 1. Clients Debts Alerts */}
        <div className="flex items-center space-x-[5px]">
          <Checkbox
            id="clientsDebtsAlert"
            checked={alerts.clientsDebtsAlert || false}
            onCheckedChange={(checked) => onSettingChange('clientsDebtsAlert', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 rounded border-gray-300 data-[state=checked]:!bg-[#2ECC71] data-[state=checked]:!border-[#2ECC71] data-[state=checked]:text-white"
          />
          <Label htmlFor="clientsDebtsAlert" className="text-[#444444] font-normal text-sm whitespace-nowrap cursor-pointer">
            Clients Debts Alerts
          </Label>
        </div>

        {/* 2. Custom Threshold Alerts */}
        <div className="flex items-center space-x-[5px]">
          <Checkbox
            id="CustomThresholdAlerts"
            checked={alerts.CustomThresholdAlerts || false}
            onCheckedChange={(checked) => onSettingChange('CustomThresholdAlerts', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 rounded border-gray-300 data-[state=checked]:!bg-[#2ECC71] data-[state=checked]:!border-[#2ECC71] data-[state=checked]:text-white"
          />
          <Label htmlFor="CustomThresholdAlerts" className="text-[#444444] font-normal text-sm whitespace-nowrap cursor-pointer">
            Custom Threshold Alerts
          </Label>
        </div>

        {/* 3. Large Balance Alert Threshold & Input */}
        <div className="flex items-center space-x-[5px]">
          <Checkbox
            id="LargeBalanceAlertThreshold"
            checked={alerts.LargeBalanceAlertThreshold || false}
            onCheckedChange={(checked) => onSettingChange('LargeBalanceAlertThreshold', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 rounded border-gray-300 data-[state=checked]:!bg-[#2ECC71] data-[state=checked]:!border-[#2ECC71] data-[state=checked]:text-white"
          />
          <Label htmlFor="LargeBalanceAlertThreshold" className="text-[#444444] font-normal text-sm whitespace-nowrap cursor-pointer">
            Large Balance Alert Threshold
          </Label>
          <Input
            type="number"
            value={localThreshold}
            onChange={handleThresholdChange}
            // Styled to match the screenshot: smaller height, limited width
            className="w-24 md:w-20 lg:w-24 h-8 text-sm px-2 border-gray-300 bg-white"
            min="0"
            step="1"
            disabled={isReadOnly}
          />
        </div>

        {/* 4. Price Change Notifications */}
        <div className="flex items-center space-x-[5px]">
          <Checkbox
            id="PriceChangeNotification"
            checked={alerts.PriceChangeNotification || false}
            onCheckedChange={(checked) => onSettingChange('PriceChangeNotification', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 rounded border-gray-300 data-[state=checked]:!bg-[#2ECC71] data-[state=checked]:!border-[#2ECC71] data-[state=checked]:text-white"
          />
          <Label htmlFor="PriceChangeNotification" className="text-[#444444] font-normal text-sm whitespace-nowrap cursor-pointer">
            Price Change Notifications
          </Label>
        </div>

      </div>
    </div>
  );
};