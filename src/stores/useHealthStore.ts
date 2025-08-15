import { create } from 'zustand';
import { HealthService } from '@/services/healthService';
import type { 
  BasicHealthResponse, 
  DetailedHealthResponse 
} from '@/services/healthService';

type HealthState = {
  basic: BasicHealthResponse | null;
  detailed: DetailedHealthResponse | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  fetchHealth: () => Promise<void>;
};

export const useHealthStore = create<HealthState>((set) => ({
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
        lastUpdated: new Date(),
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error('Failed to fetch health data'),
        loading: false,
      });
    }
  },
}));