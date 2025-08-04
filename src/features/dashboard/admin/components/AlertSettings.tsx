import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { type Settings } from '@/types/types';

interface AlertSettingsSectionProps {
  settings: Settings;
  onSettingChange: (key: keyof Settings, value: boolean) => void;
  isReadOnly?: boolean;
}

export const AlertSettingsSection: React.FC<AlertSettingsSectionProps> = ({
  settings,
  onSettingChange,
  isReadOnly = false,
}) => {
  return (
    <div className="space-y-3">
      <div className='flex items-center gap-9'>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="clientsDebtsAlert"
            checked={settings.clientsDebtsAlert}
            onCheckedChange={(checked) => onSettingChange('clientsDebtsAlert', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="clientsDebtsAlert" className="text-gray-700">Clients Debts Alerts</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="largeBalanceAlert"
            checked={settings.largeBalanceAlert}
            onCheckedChange={(checked) => onSettingChange('largeBalanceAlert', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="largeBalanceAlert" className="text-gray-700">Large Balance Alert</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="lowStockAlert"
            checked={settings.lowStockAlert}
            onCheckedChange={(checked) => onSettingChange('lowStockAlert', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="lowStockAlert" className="text-gray-700">Low Stock Alerts</Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="inactivityAlerts"
            checked={settings.inactivityAlerts}
            onCheckedChange={(checked) => onSettingChange('inactivityAlerts', checked as boolean)}
            disabled={isReadOnly}
            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
          <Label htmlFor="inactivityAlerts" className="text-gray-700">Inactivity Alerts</Label>
        </div>
      </div>
    </div>
  );
};