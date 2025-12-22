import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
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

  // State for the session form
  const [activeHoursForm, setActiveHoursForm] = useState({
    startTime: "08:00",
    endTime: "22:00",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const isMaintainer = user?.role === "MAINTAINER";
  const isMaintOn = maintenanceMode?.isActive || false;

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
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex flex-col items-center justify-center gap-3">
        <span>Error: {error}</span>
        <button
          onClick={() => fetchActiveHours()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Messages */}
      {(showForceLogoutSuccess || isSaved) && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded border border-green-200 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>
            {showForceLogoutSuccess
              ? "Active hours updated! Users outside these hours will be logged out."
              : "Settings saved successfully!"}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Mode Card */}
        {isMaintainer && (
          <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-sm h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-medium text-[#333333] mb-6">
                Maintenance Mode
              </h2>

              <div className="flex justify-between items-center mb-8">
                <p className="text-[#4B5563] text-[15px] max-w-[80%] leading-relaxed">
                  Temporarily disable system access for maintenance
                </p>

                {/* Custom Toggle Switch */}
                <button
                  onClick={handleMaintenanceToggle}
                  disabled={loadingMaintenance}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                    isMaintOn ? "bg-[#3D80FF]" : "bg-gray-200"
                  } ${loadingMaintenance ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      isMaintOn ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={handleMaintenanceToggle}
              disabled={loadingMaintenance}
              className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-white font-medium py-3 rounded-[6px] transition-colors text-[15px] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loadingMaintenance ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isMaintOn ? "Deactivating..." : "Activating..."}
                </>
              ) : (
                "Save Change"
              )}
            </button>
          </div>
        )}

        {/* Session Management Card */}
        <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-sm h-full flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#333333] mb-6">
              Session Management
            </h2>

            <div className="mb-8">
              <label className="block text-[#4B5563] text-[15px] mb-3">
                Active hours
              </label>
              <div className="flex items-center gap-3">
                {/* Start Time Input */}
                <div className="relative w-full">
                  <input
                    type="time"
                    value={activeHoursForm.startTime}
                    onChange={(e) =>
                      setActiveHoursForm({
                        ...activeHoursForm,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full border border-[#D1D5DB] rounded-[6px] py-2.5 px-3 text-[#374151] text-center focus:outline-none focus:ring-1 focus:ring-[#3D80FF]"
                  />
                </div>
                <span className="text-[#6B7280] text-sm">to</span>
                {/* End Time Input */}
                <div className="relative w-full">
                  <input
                    type="time"
                    value={activeHoursForm.endTime}
                    onChange={(e) =>
                      setActiveHoursForm({
                        ...activeHoursForm,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full border border-[#D1D5DB] rounded-[6px] py-2.5 px-3 text-[#374151] text-center focus:outline-none focus:ring-1 focus:ring-[#3D80FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSession}
            disabled={loadingSession}
            className="w-full bg-[#2ECC71] hover:bg-[#27ae60] text-white font-medium py-3 rounded-[6px] transition-colors text-[15px] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingSession ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Force Logout All Users"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};