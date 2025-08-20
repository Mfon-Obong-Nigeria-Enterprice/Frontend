import { getRevenue } from "@/services/transactionService";
import type { RevenueData } from "@/types/revenue";
import { create } from "zustand";

interface RevenueState {
  ytdRevenue: RevenueData | null;
  monthlyRevenue: RevenueData | null;
  dailyRevenue: RevenueData | null;
  yearlyRevenue: RevenueData | null;

  // Loading states
  isLoadingYTD: boolean;
  isLoadingMOM: boolean;
  isLoadingDaily: boolean;
  isLoadingYearly: boolean;
  error: string | null;

  // Actions
  getYTDRevenue: () => Promise<void>; // Fetch Year-To-Date
  getMOMRevenue: () => Promise<void>; // Fetch Month-Over-Month
  getDailyRevenue: () => Promise<void>; // Fetch Daily
  getYearlyRevenue: () => Promise<void>; // Fetch Yearly
  getAllRevenueData: () => Promise<void>; // Fetch everything
  clearError: () => void;
  reset: () => void;
  //   //   getChartData: () => Promise<void>;            // Fetch all chart data
}

// Helper function to calculate percentage change
// const calculatePercentageChange = (current: number, previous: number) => {
//   if (previous === 0 && current === 0) {
//     return { percentage: 0, direction: "no-change" as const };
//   }
//   if (previous === 0 && current > 0) {
//     return { percentage: 100, direction: "increase" as const };
//   }
//   if (previous > 0 && current === 0) {
//     return { percentage: -100, direction: "decrease" as const };
//   }

//   const percentageChange = ((current - previous) / previous) * 100;
//   return {
//     percentage: Math.round(Math.abs(percentageChange) * 100) / 100,
//     direction:
//       percentageChange > 0
//         ? ("increase" as const)
//         : percentageChange < 0
//         ? ("decrease" as const)
//         : ("no-change" as const),
//   };
// };

export const useRevenueStore = create<RevenueState>((set, get) => ({
  // initial state
  ytdRevenue: null,
  monthlyRevenue: null,
  dailyRevenue: null,
  yearlyRevenue: null,

  // Loading states
  isLoadingYTD: false,
  isLoadingMOM: false,
  isLoadingDaily: false,
  isLoadingYearly: false,

  // Error state
  error: null,

  //Revenue Actions
  getYTDRevenue: async () => {
    set({ isLoadingYTD: true, error: null });
    try {
      const data = await getRevenue("total");

      // DEBUG: Log what backend actually returns
      console.log("Backend YTD response:", {
        totalRevenue: data.totalRevenue,
        previousPeriodRevenue: data.previousPeriodRevenue,
        percentageChange: data.percentageChange,
        direction: data.direction,
        fullResponse: data,
      });
      //
      const revenueData: RevenueData = {
        totalRevenue: Number(data.totalRevenue) || 0,
        previousPeriodRevenue: Number(data.previousPeriodRevenue) || 0,
        percentageChange: Number(data.percentageChange) || 0,
        direction: data.direction || "no-change",
      };
      set({ ytdRevenue: revenueData, isLoadingYTD: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch YTD revenue data",
        isLoadingYTD: false,
      });
    }
  },
  //
  getMOMRevenue: async () => {
    set({ isLoadingMOM: true, error: null });
    try {
      const data = await getRevenue("monthly");
      const revenueData: RevenueData = {
        totalRevenue: Number(data.totalRevenue) || 0,
        previousPeriodRevenue: Number(data.previousPeriodRevenue) || 0,
        percentageChange: Number(data.percentageChange) || 0,
        direction: data.direction || "no-change",
      };
      set({ monthlyRevenue: revenueData, isLoadingMOM: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch MOM revenue data",
        isLoadingMOM: false,
      });
    }
  },
  //

  getDailyRevenue: async () => {
    set({ isLoadingDaily: true, error: null });
    try {
      const data = await getRevenue("daily");

      const revenueData: RevenueData = {
        totalRevenue: data.totalRevenue || 0,
        previousPeriodRevenue: data.previousPeriodRevenue || 0,
        percentageChange: data.percentageChange || 0,
        direction: data.direction || "no-change",
      };

      set({ dailyRevenue: revenueData, isLoadingDaily: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch daily revenue data",
        isLoadingDaily: false,
      });
    }
  },
  //
  getYearlyRevenue: async () => {
    set({ isLoadingYearly: true, error: null });
    try {
      const data = await getRevenue("yearly");

      const revenueData: RevenueData = {
        totalRevenue: data.totalRevenue || 0,
        previousPeriodRevenue: data.previousPeriodRevenue || 0,
        percentageChange: data.percentageChange || 0,
        direction: data.direction || "no-change",
      };

      set({ yearlyRevenue: revenueData, isLoadingYearly: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch yearly revenue data",
        isLoadingYearly: false,
      });
    }
  },
  //

  getAllRevenueData: async () => {
    const { getYTDRevenue, getMOMRevenue, getDailyRevenue, getYearlyRevenue } =
      get();

    // Fetch all data in parallel
    await Promise.allSettled([
      getYTDRevenue(),
      getMOMRevenue(),
      getDailyRevenue(),
      getYearlyRevenue(),
    ]);
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ytdRevenue: null,
      monthlyRevenue: null,
      dailyRevenue: null,
      yearlyRevenue: null,
      isLoadingYTD: false,
      isLoadingMOM: false,
      isLoadingDaily: false,
      isLoadingYearly: false,
      error: null,
    }),
}));

//

export const useRevenueSelectors = () => {
  const store = useRevenueStore();
  return {
    // Check if any loading is happening
    isAnyLoading: () =>
      store.isLoadingYTD ||
      store.isLoadingMOM ||
      store.isLoadingDaily ||
      store.isLoadingYearly,

    // Get specific revenue data
    // getYTDData: () => store.ytdRevenue,
    // getMOMData: () => store.monthlyRevenue,
    // getDailyData: () => store.dailyRevenue,
    // getYearlyData: () => store.yearlyRevenue,
  };
};
