import type { MaintenanceModeSettings, ActiveHoursSettings } from "@/schemas/SettingsSchemas";
import api from "./baseApi";
import { toast } from "react-hot-toast";

// ------------------ Maintenance Mode ------------------
export const toggleMaintenanceMode = async (): Promise<MaintenanceModeSettings> => {
  const response = await api.post("/maintenance-mode/toggle");
  const data: MaintenanceModeSettings = response.data;
  toast.success(
    data.message || (data.isActive ? "Maintenance mode activated" : "Maintenance mode deactivated")
  );
  return data;
};

// ------------------ Active Hours ------------------

// Session status response shape
export interface SessionStatusResponse {
  isActiveHours: boolean;
  currentTime: string;
  activeHours: ActiveHoursSettings | null;
  message: string;
}

export const getSessionStatus = async (): Promise<SessionStatusResponse> => {
  const response = await api.get("/session-management/status");
  return response.data as SessionStatusResponse;
};

// Save or update active hours
export const saveActiveHoursConfig = async (
  activeHours: Omit<
    ActiveHoursSettings,
    "_id" | "setBy" | "setByEmail" | "createdAt" | "updatedAt"
  >
): Promise<ActiveHoursSettings> => {
  const response = await api.post("/session-management/active-hours", activeHours);
  toast.success("Active hours updated successfully");
  return response.data as ActiveHoursSettings;
};

// Deactivate active hours
export const deactivateActiveHours = async (): Promise<{ message: string }> => {
  const response = await api.delete("/session-management/active-hours");
  toast.success(response.data?.message || "Active hours deactivated successfully");
  return response.data;
};
