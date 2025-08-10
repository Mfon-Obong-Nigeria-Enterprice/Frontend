import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { detailedHealthResponseSchema, type HealthState } from "@/types/types";

export const useHealthStore = create<HealthState>((set) => ({
  overallStatus: "unknown",
  metrics: {
    database: 0,
    memory: 0,
  },
  loading: false,
  error: null,
  timestamp: "",
  uptime: 0,
  environment: {
    nodeVersion: "",
    platform: "",
    environment: "",
  },
  fetchHealthData: async () => {
    set({ loading: true, error: null });
    try {
      const [healthRes, detailedRes] = await Promise.all([
        fetch("https://mfon-obong-enterprise.onrender.com/api/health"),
        fetch("https://mfon-obong-enterprise.onrender.com/api/health/detailed"),
      ]);

      if (!healthRes.ok || !detailedRes.ok) {
        throw new Error(`HTTP error! Status: ${healthRes.status}/${detailedRes.status}`);
      }

      const [healthData, detailedJson] = await Promise.all([
        healthRes.json(),
        detailedRes.json(),
      ]);

      const detailedData = detailedHealthResponseSchema.parse(detailedJson);

      set({
        overallStatus: healthData.status || detailedData.status,
        metrics: {
          database: detailedData.checks.database.responseTime || 0,
          memory: detailedData.checks.memory.percentage || 0,
        },
        timestamp: detailedData.timestamp,
        uptime: detailedData.uptime,
        environment: detailedData.checks.environment,
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      set({
        error: errorMessage,
        loading: false,
      });
      console.error("Health store error:", errorMessage);
    }
  },
}));