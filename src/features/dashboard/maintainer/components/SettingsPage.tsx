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
  const [activeHoursForm, setActiveHoursForm] = useState({
    startTime: "08:00",
    endTime: "22:00",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isSavingMaintenance, setIsSavingMaintenance] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);

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
      setIsSavingMaintenance(true);
      await toggleMaintenanceMode();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error("Failed to toggle maintenance mode:", err);
    } finally {
      setIsSavingMaintenance(false);
    }
  };

  const handleSaveSession = async () => {
  try {
    setIsSavingSession(true);

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
    setIsSavingSession(false);
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

  const isMaintOn = !!maintenanceMode?.isActive;

  return (
    <div className="container mx-auto p-4">
      {showForceLogoutSuccess && (
        <div >
          {/* <CheckCircle className="h-5 w-5" />
          <span>
            Active hours updated! Users outside these hours will be logged out.
          </span> */}
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
            <CardHeader className="pb-4">
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
                  disabled={isSavingMaintenance}
                  className="data-[state=checked]:bg-green-600"
                />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleMaintenanceToggle}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isSavingMaintenance}
              >
                {isSavingMaintenance ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isMaintOn ? "Deactivating..." : "Activating..."}
                  </>
                ) : isMaintOn ? (
                  "Save Changes"
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
            <CardDescription>
              Active Hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="space-y-2">
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
                      disabled={isSavingSession}
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
                      disabled={isSavingSession}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSaveSession}
              disabled={isSavingSession}
            >
              {isSavingSession ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
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
