/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const SettingsPage: React.FC = () => {
  const { 
    maintenanceMode, 
    sessionSettings, 
    loading, 
    error, 
    fetchSettings, 
    updateMaintenanceMode, 
    updateSessionSettings,
    saveAllSettings 
  } = useSettingsStore();
  
  const [isSaved, setIsSaved] = useState(false);
  const [, setShowForceLogoutWarning] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleMaintenanceToggle = (enabled: boolean) => {
    updateMaintenanceMode({
      ...maintenanceMode,
      enabled,
    });
  };

  const handleTimeoutChange = (hours: number) => {
    updateSessionSettings({
      ...sessionSettings,
      timeoutHours: hours,
    });
  };

  const handleConfirmForceLogout = () => {
    updateSessionSettings({
      ...sessionSettings,
      forceLogout: false
    });
    setShowForceLogoutWarning(false);
  };

  const handleSave = async () => {
    try {
      await saveAllSettings();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      // Error handling without console.log
    }
  };

  if (loading && !maintenanceMode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
        <Button onClick={fetchSettings} className="mt-4 w-full">
          Retry
        </Button>
      </div>
    );
  }

  if (!maintenanceMode || !sessionSettings) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-gray-500">No settings available</div>
        <Button onClick={fetchSettings} className="mt-4 w-full">
          Load Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Maintenance Mode</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
              <CardDescription className="text-sm text-gray-600 flex-1">
                Temporarily disable system access for maintenance
              </CardDescription>
              <Switch
                id="maintenance-mode"
                checked={maintenanceMode.enabled}
                onCheckedChange={handleMaintenanceToggle}
                className="bg-blue-600 data-[state=checked]:bg-blue-600 hover:bg-blue-700 data-[state=checked]:hover:bg-blue-700"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSave} 
              className="bg-[#2ECC71] hover:bg-[#2ECC71] text-white w-full"
            >
              {isSaved ? "Saved!" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Session Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout" className="text-sm md:text-base">
                Session Timeout 
              </Label>
              <Input
                id="session-timeout"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={sessionSettings.timeoutHours}
                onChange={(e) => handleTimeoutChange(parseFloat(e.target.value))}
                className="w-full max-w-xs"
                placeholder="0.5 - 24 hours"
              />
             
            </div>
            
            <Button 
              className="bg-[#2ECC71] hover:bg-[#2ECC71] text-white w-full"
              onClick={handleConfirmForceLogout}
            >
              Force Logout All Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};