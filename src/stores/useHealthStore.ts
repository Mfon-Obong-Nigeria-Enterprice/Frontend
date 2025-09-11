/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { HealthService } from "@/services/healthService";
import type {
  BasicHealthResponse,
  DetailedHealthResponse,
} from "@/schemas/SystemHealthSchemas";

type HealthState = {
  basic: BasicHealthResponse | null;
  detailed: DetailedHealthResponse | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: string | null;
  fetchHealth: () => Promise<void>;
  clearError: () => void;
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set, _get) => ({
      basic: null,
      detailed: null,
      loading: false,
      error: null,
      lastUpdated: null,

      fetchHealth: async () => {
        set({ loading: true, error: null });
        try {
          const { basic, detailed } = await HealthService.getAllHealthData();
          set({
            basic,
            detailed,
            loading: false,
           lastUpdated: new Date().toISOString(),
          });
        } catch (err) {
          set({
            error:
              err instanceof Error
                ? err
                : new Error("Failed to fetch health data"),
            loading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "health-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["loading", "error"].includes(key)
          )
        ) as HealthState,
    }
  )
);

// ✅ Stable selectors (avoid object recreation)
export const useBasicHealth = () => useHealthStore((state) => state.basic);
export const useDetailedHealth = () => useHealthStore((state) => state.detailed);
export const useHealthLoading = () => useHealthStore((state) => state.loading);
export const useHealthError = () => useHealthStore((state) => state.error);
export const useHealthLastUpdated = () =>
  useHealthStore((state) => state.lastUpdated);

export const useFetchHealth = () =>
  useHealthStore((state) => state.fetchHealth);

export const useClearHealthError = () =>
  useHealthStore((state) => state.clearError);
