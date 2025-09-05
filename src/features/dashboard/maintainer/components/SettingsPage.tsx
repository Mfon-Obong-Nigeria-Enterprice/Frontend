import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { settingsService } from '@/services/settingsService';

export const SettingsPage: React.FC = () => {
  const { 
    maintenanceMode, 
    sessionSettings, 
    error, 
    fetchSettings, 
    updateSessionSettings,
    updateMaintenanceMode,
    saveAllSettings
  } = useSettingsStore();
  
  const [isSaved, setIsSaved] = useState(false);
  const [showForceLogoutSuccess, setShowForceLogoutSuccess] = useState(false);
  const [activeHours, setActiveHours] = useState({
    start: '08:00',
    end: '22:00'
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleMaintenanceToggle = async (enabled: boolean) => {
    try {
      const updatedMaintenanceMode = await settingsService.toggleMaintenanceMode(enabled);
      updateMaintenanceMode(updatedMaintenanceMode);
    } catch (err) {
      alert(`Failed to toggle maintenance mode: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleForceLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to force logout all users?");
    
    if (isConfirmed) {
      // Update UI immediately (frontend only)
      setShowForceLogoutSuccess(true);
      
      // Update store with force logout (frontend only)
      updateSessionSettings({
        ...sessionSettings,
        forceLogout: true
      });
      
      // Show success message for 3 seconds
      setTimeout(() => setShowForceLogoutSuccess(false), 3000);
    }
  };


  const handleSaveAllSettings = async () => {
    try {
      await saveAllSettings();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      alert(`Failed to save settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
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
      {/* Force Logout Success Message */}
      {showForceLogoutSuccess && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5" />
          <span>All users have been logged out successfully!</span>
        </div>
      )}

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
            {/* <div className="mb-4 text-sm text-muted-foreground">
              {maintenanceMode.enabled 
                ? "⚠️ Maintenance mode is currently ACTIVE" 
                : "✅ System is operating normally"}
            </div> */}
            <Button 
              onClick={handleSaveAllSettings} 
              className="bg-[#2ECC71] hover:bg-[#2ECC71] text-white w-full"
            >
              {isSaved ? "Saved!" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Session Management</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Manage user sessions and active hours 
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm md:text-base block">
                  Active hours
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={activeHours.start}
                    onChange={(e) => setActiveHours({...activeHours, start: e.target.value})}
                    className="w-28"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={activeHours.end}
                    onChange={(e) => setActiveHours({...activeHours, end: e.target.value})}
                    className="w-28"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                className="bg-[#2ECC71] hover:bg-[#2ECC71] text-white"
                onClick={handleForceLogout}
              >
                Force Logout All Users
              </Button>
              
              {/* <Button 
                onClick={handleSaveActiveHours} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaved ? "Saved!" : "Save Active Hours"}
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};