import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2 } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useAuthStore } from "@/stores/useAuthStore";

export const SettingsPage: React.FC = () => {
  const {
    maintenanceMode,
    activeHours,
    error,
    fetchActiveHours,
    saveActiveHoursConfig,
    toggleMaintenanceMode,
  } = useSettingsStore();

  const { user } = useAuthStore();

  const [isSaved, setIsSaved] = useState(false);
  const [showForceLogoutSuccess, setShowForceLogoutSuccess] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);

  const [activeHoursForm, setActiveHoursForm] = useState({
    startTime: "08:00",
    endTime: "22:00",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const isMaintainer = user?.role === "MAINTAINER";

  useEffect(() => {
    fetchActiveHours();
  }, [fetchActiveHours]);

  useEffect(() => {
    if (activeHours) {
      setActiveHoursForm({
        startTime: activeHours.startTime || "08:00",
        endTime: activeHours.endTime || "22:00",
        timezone:
          activeHours.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }, [activeHours]);

  const handleMaintenanceToggle = async () => {
    try {
      setLoadingMaintenance(true);
      await toggleMaintenanceMode();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Failed to toggle maintenance mode:", err);
    } finally {
      setLoadingMaintenance(false);
    }
  };

  const handleSaveSession = async () => {
    try {
      setLoadingSession(true);
      const result = await saveActiveHoursConfig({
        ...activeHoursForm,
        description: "Business hours - updated via UI",
      });

      if (result) {
        setShowForceLogoutSuccess(true);
        setTimeout(() => setShowForceLogoutSuccess(false), 3000);
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save session settings:", err);
    } finally {
      setLoadingSession(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <span>{error}</span>
        </div>
        <Button
          onClick={() => {
            fetchActiveHours();
          }}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  const isMaintOn = maintenanceMode?.isActive || false;

  return (
    <div className="container mx-auto p-4">
      {showForceLogoutSuccess && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center gap-2 mb-6">
          <CheckCircle className="h-5 w-5" />
          <span>
            Active hours updated! Users outside these hours will be logged out.
          </span>
        </div>
      )}

      {isSaved && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center gap-2 mb-6">
          <CheckCircle className="h-5 w-5" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {isMaintainer && (
          <Card className="flex-1">
            <CardContent className="flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Maintenance Mode</CardTitle>
                  <CardDescription className="text-sm pt-2">
                    Temporarily disable system access for maintenance
                  </CardDescription>
                </div>
                <div className="pt-8">
                  <Switch
                    checked={isMaintOn}
                    onCheckedChange={handleMaintenanceToggle}
                    disabled={loadingMaintenance}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
              <Button
                onClick={handleMaintenanceToggle}
                className="w-full bg-[#2ECC71] hover:bg-[#2ECC71] text-white mt-auto"
                disabled={loadingMaintenance}
              >
                {loadingMaintenance ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isMaintOn ? "Deactivating..." : "Activating..."}
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="flex-1">
          <CardHeader className="pb-4">
            <CardTitle>Session Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Active Hours
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={activeHoursForm.startTime}
                    onChange={(e) =>
                      setActiveHoursForm({
                        ...activeHoursForm,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={activeHoursForm.endTime}
                    onChange={(e) =>
                      setActiveHoursForm({
                        ...activeHoursForm,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-[#2ECC71] hover:bg-[#2ECC71] text-white"
              onClick={handleSaveSession}
              disabled={loadingSession}
            >
              {loadingSession ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Force Logout All Users"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
