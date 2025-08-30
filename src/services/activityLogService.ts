import api from "./baseApi";
import type { ActivityLogs } from "@/stores/useActivityLogsStore";

export const getSystemActivityLogs = async (): Promise<ActivityLogs[]> => {
  const response = await api.get("/system-activity-logs");
  console.log("response from activity log:", response.data);
  return response.data;
};
