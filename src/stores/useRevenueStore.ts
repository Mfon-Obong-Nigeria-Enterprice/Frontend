import { create } from "zustand";
import type { Transaction } from "@/types/transactions";
import type { Product } from "@/types/types";
import { formatCurrency } from "@/utils/formatCurrency";

type CategoryObj = { name: string };

interface RevenueState {
  // Store raw transactions instead of computed revenue
  transactions: Transaction[] | null;
  products: Product[] | null;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  setProducts: (products: Product[]) => void;
  addTransaction: (transaction: Transaction) => void;
  reset: () => void;

  // Computed revenue functions
  getYTDRevenue: () => {
    totalRevenue: number;
    previousPeriodRevenue: number;
    percentageChange: number;
    direction: "increase" | "decrease" | "no-change";
  };

  getMOMRevenue: () => {
    totalRevenue: number;
    previousPeriodRevenue: number;
    percentageChange: number;
    direction: "increase" | "decrease" | "no-change";
  };

  getDailyRevenue: () => {
    totalRevenue: number;
    previousPeriodRevenue: number;
    percentageChange: number;
    direction: "increase" | "decrease" | "no-change";
  };

  getYearlyRevenue: () => {
    totalRevenue: number;
    previousPeriodRevenue: number;
    percentageChange: number;
    direction: "increase" | "decrease" | "no-change";
  };

  getWeeklyRevenue: () => {
    totalRevenue: number;
    previousPeriodRevenue: number;
    percentageChange: number;
    direction: "increase" | "decrease" | "no-change";
  };

  // Chart data functions
  getMonthlyTrendData: () => Array<{
    month: string;
    value: number;
    year: number;
  }>;

  getYearOverYearData: () => Array<{
    month: string;
    [key: string]: string | number;
  }>;

  getDailyRevenueData: () => Array<{
    name: string;
    revenue: number;
    date: string;
  }>;

  getWeeklyRevenueData: () => Array<{
    name: string;
    revenue: number;
    weekStart: string;
  }>;

  // Sales Performance functions for last 30 days
  getSalesPerformanceData: () => Array<{
    day: number;
    sales: number;
    date: string;
  }>;

  getLast30DaysSales: () => {
    totalSales: number;
    totalTransactions: number;
    averageDailySales: number;
    percentageChange: number;
    direction: "increase" | "decrease" | "no-change";
  };

  // Product analytics functions
  getProductMarginData: () => Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;

  getAverageDiscount: () => number;

  getRevenueLift: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };

  getMarginImpact: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };

  getPaymentMethodRevenue: () => Array<{
    method: string;
    revenue: string;
    amount: number;
    color: string;
  }>;
}

// Helper function to calculate percentage change with capping
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0 && current === 0) {
    return { percentage: 0, direction: "no-change" as const };
  }
  if (previous === 0 && current > 0) {
    return { percentage: 100, direction: "increase" as const };
  }
  if (previous > 0 && current === 0) {
    return { percentage: 100, direction: "decrease" as const };
  }

  const percentageChange = ((current - previous) / previous) * 100;

  // Cap the percentage between -100 and 100
  const cappedPercentage = Math.max(-100, Math.min(100, percentageChange));

  return {
    percentage: Math.round(Math.abs(cappedPercentage) * 100) / 100,
    direction:
      cappedPercentage > 0
        ? ("increase" as const)
        : cappedPercentage < 0
        ? ("decrease" as const)
        : ("no-change" as const),
  };
};

// Helper function to get revenue from transactions
const getRevenueFromTransactions = (transactions: Transaction[]): number => {
  return transactions
    .filter(
      (t) =>
        t.type === "PURCHASE" || t.type === "PICKUP" || t.type === "DEPOSIT"
    )
    .reduce((total, t) => {
      const amount = t.total || t.amountPaid || t.amount || 0;
      return total + amount;
    }, 0);
};

// Helper function to get month name
const getMonthName = (monthIndex: number): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthIndex];
};

// Helper function to get product cost from transaction items
const getProductCostFromTransaction = (
  transaction: Transaction,
  products: Product[]
): number => {
  if (!transaction.items || !products.length) return 0;

  return transaction.items.reduce((totalCost, item) => {
    const product = products.find(
      (p) => p._id === item.productId || p.name === item.productName
    );
    if (product && product.unitPrice) {
      // Assuming cost is roughly 70% of unit price if no cost price is available
      // You may need to add a costPrice field to Product type or adjust this calculation
      const estimatedCost = product.unitPrice * 0.7; // 30% profit margin assumption
      return totalCost + estimatedCost * item.quantity;
    }
    return totalCost;
  }, 0);
};

export const useRevenueStore = create<RevenueState>((set, get) => ({
  // Initial state
  transactions: null,
  products: null,

  // Actions
  setTransactions: (transactions) => set({ transactions }),

  setProducts: (products) => set({ products }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: state.transactions
        ? [...state.transactions, transaction]
        : [transaction],
    })),

  reset: () =>
    set({
      transactions: null,
      products: null,
    }),

  // All the existing computed revenue functions...

  getYTDRevenue: () => {
    const { transactions } = get();
    if (!transactions)
      return {
        totalRevenue: 0,
        previousPeriodRevenue: 0,
        percentageChange: 0,
        direction: "no-change" as const,
      };

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);

    // Current year transactions up to current date
    const currentYearTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startOfYear && transactionDate <= now;
    });

    // Previous year transactions up to same date last year
    const sameTimeLastYear = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );
    const previousYearTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= startOfLastYear &&
        transactionDate <= sameTimeLastYear
      );
    });

    const totalRevenue = getRevenueFromTransactions(currentYearTransactions);
    const previousPeriodRevenue = getRevenueFromTransactions(
      previousYearTransactions
    );
    const { percentage, direction } = calculatePercentageChange(
      totalRevenue,
      previousPeriodRevenue
    );

    return {
      totalRevenue,
      previousPeriodRevenue,
      percentageChange: percentage,
      direction,
    };
  },

  getMOMRevenue: () => {
    const { transactions } = get();
    if (!transactions)
      return {
        totalRevenue: 0,
        previousPeriodRevenue: 0,
        percentageChange: 0,
        direction: "no-change" as const,
      };

    const now = new Date();

    // Current month - from 1st of current month to now
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Previous month - entire previous month
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const endOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // Current month transactions (from start of month to now)
    const currentMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startOfCurrentMonth && transactionDate <= now;
    });

    // Previous month transactions (complete previous month)
    const previousMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= startOfPreviousMonth &&
        transactionDate <= endOfPreviousMonth
      );
    });

    const totalRevenue = getRevenueFromTransactions(currentMonthTransactions);
    const previousPeriodRevenue = getRevenueFromTransactions(
      previousMonthTransactions
    );
    const { percentage, direction } = calculatePercentageChange(
      totalRevenue,
      previousPeriodRevenue
    );

    return {
      totalRevenue,
      previousPeriodRevenue,
      percentageChange: percentage,
      direction,
    };
  },

  getDailyRevenue: () => {
    const { transactions } = get();
    if (!transactions)
      return {
        totalRevenue: 0,
        previousPeriodRevenue: 0,
        percentageChange: 0,
        direction: "no-change" as const,
      };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    // Today's transactions
    const todayTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt).toDateString();
      return transactionDate === todayStr;
    });

    // Yesterday's transactions
    const yesterdayTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt).toDateString();
      return transactionDate === yesterdayStr;
    });

    const totalRevenue = getRevenueFromTransactions(todayTransactions);
    const previousPeriodRevenue = getRevenueFromTransactions(
      yesterdayTransactions
    );
    const { percentage, direction } = calculatePercentageChange(
      totalRevenue,
      previousPeriodRevenue
    );

    return {
      totalRevenue,
      previousPeriodRevenue,
      percentageChange: percentage,
      direction,
    };
  },

  getYearlyRevenue: () => {
    const { transactions } = get();
    if (!transactions)
      return {
        totalRevenue: 0,
        previousPeriodRevenue: 0,
        percentageChange: 0,
        direction: "no-change" as const,
      };

    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    // Current year transactions
    const currentYearTransactions = transactions.filter((t) => {
      const transactionYear = new Date(t.createdAt).getFullYear();
      return transactionYear === currentYear;
    });

    // Previous year transactions
    const previousYearTransactions = transactions.filter((t) => {
      const transactionYear = new Date(t.createdAt).getFullYear();
      return transactionYear === previousYear;
    });

    const totalRevenue = getRevenueFromTransactions(currentYearTransactions);
    const previousPeriodRevenue = getRevenueFromTransactions(
      previousYearTransactions
    );
    const { percentage, direction } = calculatePercentageChange(
      totalRevenue,
      previousPeriodRevenue
    );

    return {
      totalRevenue,
      previousPeriodRevenue,
      percentageChange: percentage,
      direction,
    };
  },

  getWeeklyRevenue: () => {
    const { transactions } = get();
    if (!transactions)
      return {
        totalRevenue: 0,
        previousPeriodRevenue: 0,
        percentageChange: 0,
        direction: "no-change" as const,
      };

    const now = new Date();

    // Get start of week (Monday)
    const getStartOfWeek = (date: Date): Date => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };

    const startOfThisWeek = getStartOfWeek(now);
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);
    endOfThisWeek.setHours(23, 59, 59, 999);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);

    // This week's transactions
    const thisWeekTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= startOfThisWeek && transactionDate <= endOfThisWeek
      );
    });

    // Last week's transactions
    const lastWeekTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= startOfLastWeek && transactionDate <= endOfLastWeek
      );
    });

    const totalRevenue = getRevenueFromTransactions(thisWeekTransactions);
    const previousPeriodRevenue =
      getRevenueFromTransactions(lastWeekTransactions);
    const { percentage, direction } = calculatePercentageChange(
      totalRevenue,
      previousPeriodRevenue
    );

    return {
      totalRevenue,
      previousPeriodRevenue,
      percentageChange: percentage,
      direction,
    };
  },

  // Chart data functions
  getMonthlyTrendData: () => {
    const { transactions } = get();
    if (!transactions) return [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Start from January of current year up to current month
    const monthsToShow = currentMonth + 1; // +1 because month is 0-indexed
    const monthlyData: Array<{ month: string; value: number; year: number }> =
      [];

    // Generate data from January of current year to current month
    for (let i = 0; i < monthsToShow; i++) {
      // const targetDate = new Date(currentYear, i, 1);
      const startOfMonth = new Date(currentYear, i, 1);
      const endOfMonth = new Date(currentYear, i + 1, 0, 23, 59, 59, 999);

      // If it's the current month, only include data up to today
      if (i === currentMonth) {
        endOfMonth.setTime(now.getTime());
      }

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
      });

      const revenue = getRevenueFromTransactions(monthTransactions);

      monthlyData.push({
        month: getMonthName(i),
        value: revenue,
        year: currentYear,
      });
    }

    return monthlyData;
  },

  getYearOverYearData: () => {
    const { transactions } = get();
    if (!transactions) return [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;
    const monthsToShow = 12; // Show all 12 months

    const yearOverYearData: Array<{
      month: string;
      [key: string]: string | number;
    }> = [];

    // Start from January and go through all 12 months
    for (let monthIndex = 0; monthIndex < monthsToShow; monthIndex++) {
      const monthName = getMonthName(monthIndex);

      // Current year data for this month
      const currentYearStart = new Date(currentYear, monthIndex, 1);
      const currentYearEnd = new Date(
        currentYear,
        monthIndex + 1,
        0,
        23,
        59,
        59,
        999
      );

      // Previous year data for this month
      const previousYearStart = new Date(previousYear, monthIndex, 1);
      const previousYearEnd = new Date(
        previousYear,
        monthIndex + 1,
        0,
        23,
        59,
        59,
        999
      );

      const currentYearTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        return (
          transactionDate >= currentYearStart &&
          transactionDate <= currentYearEnd
        );
      });

      const previousYearTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        return (
          transactionDate >= previousYearStart &&
          transactionDate <= previousYearEnd
        );
      });

      const currentYearRevenue = getRevenueFromTransactions(
        currentYearTransactions
      );
      const previousYearRevenue = getRevenueFromTransactions(
        previousYearTransactions
      );

      yearOverYearData.push({
        month: monthName,
        [currentYear.toString()]: Math.round(currentYearRevenue / 1000), // Convert to thousands for better display
        [previousYear.toString()]: Math.round(previousYearRevenue / 1000),
      });
    }

    return yearOverYearData;
  },

  getDailyRevenueData: () => {
    const { transactions } = get();
    if (!transactions) return [];

    const now = new Date();
    const daysToShow = 7; // Show last 7 days
    const dailyData: Array<{ name: string; revenue: number; date: string }> =
      [];

    // Get day names
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Generate data for the last 7 days
    for (let i = daysToShow - 1; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - i);

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const dayTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        return (
          transactionDate >= startOfDay &&
          transactionDate <= endOfDay &&
          (t.type === "PURCHASE" || t.type === "PICKUP" || t.type === "DEPOSIT")
        );
      });

      const revenue = getRevenueFromTransactions(dayTransactions);

      dailyData.push({
        name: dayNames[targetDate.getDay()],
        revenue,
        date: targetDate.toISOString().split("T")[0], // YYYY-MM-DD format
      });
    }

    return dailyData;
  },

  getWeeklyRevenueData: () => {
    const { transactions } = get();
    if (!transactions) return [];

    const now = new Date();
    const weeksToShow = 4; // Show last 4 weeks
    const weeklyData: Array<{
      name: string;
      revenue: number;
      weekStart: string;
    }> = [];

    // Helper function to get start of week (Monday)
    const getStartOfWeek = (date: Date): Date => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      return new Date(d.setDate(diff));
    };

    // Generate data for the last 4 weeks
    for (let i = weeksToShow - 1; i >= 0; i--) {
      const weekStart = getStartOfWeek(
        new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      );
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        return (
          transactionDate >= weekStart &&
          transactionDate <= weekEnd &&
          (t.type === "PURCHASE" || t.type === "PICKUP" || t.type === "DEPOSIT")
        );
      });

      const revenue = getRevenueFromTransactions(weekTransactions);

      // Format week name
      const weekNumber = weeksToShow - i;
      const weekName = `Week ${weekNumber}`;

      weeklyData.push({
        name: weekName,
        revenue,
        weekStart: weekStart.toISOString().split("T")[0],
      });
    }

    return weeklyData;
  },

  // NEW: Sales Performance functions for last 30 days
  getSalesPerformanceData: () => {
    const { transactions } = get();
    if (!transactions) return [];

    const now = new Date();
    const daysToShow = 30; // Last 30 days
    const salesData: Array<{ day: number; sales: number; date: string }> = [];

    // Generate data for the last 30 days
    for (let i = daysToShow - 1; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - i);

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const dayTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.createdAt);
        return (
          transactionDate >= startOfDay &&
          transactionDate <= endOfDay &&
          (t.type === "PURCHASE" || t.type === "PICKUP" || t.type === "DEPOSIT")
        );
      });

      const sales = getRevenueFromTransactions(dayTransactions);

      salesData.push({
        day: targetDate.getDate(), // Day of month (1-31)
        sales,
        date: targetDate.toISOString().split("T")[0], // YYYY-MM-DD format
      });
    }

    return salesData;
  },

  getLast30DaysSales: () => {
    const { transactions } = get();
    if (!transactions)
      return {
        totalSales: 0,
        totalTransactions: 0,
        averageDailySales: 0,
        percentageChange: 0,
        direction: "no-change" as const,
      };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Last 30 days transactions
    const last30DaysTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= thirtyDaysAgo &&
        transactionDate <= now &&
        (t.type === "PURCHASE" || t.type === "PICKUP" || t.type === "DEPOSIT")
      );
    });

    // Previous 30 days transactions (31-60 days ago)
    const previous30DaysTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= sixtyDaysAgo &&
        transactionDate < thirtyDaysAgo &&
        (t.type === "PURCHASE" || t.type === "PICKUP" || t.type === "DEPOSIT")
      );
    });

    const totalSales = getRevenueFromTransactions(last30DaysTransactions);
    const previousPeriodSales = getRevenueFromTransactions(
      previous30DaysTransactions
    );
    const totalTransactions = last30DaysTransactions.length;
    const averageDailySales = totalSales / 30;

    const { percentage, direction } = calculatePercentageChange(
      totalSales,
      previousPeriodSales
    );

    return {
      totalSales,
      totalTransactions,
      averageDailySales,
      percentageChange: percentage,
      direction,
    };
  },

  // Product analytics functions
  getProductMarginData: () => {
    const { transactions, products } = get();
    if (!transactions || !products || transactions.length === 0) return [];

    // Calculate revenue by product category
    const categoryRevenue: {
      [key: string]: { revenue: number; cost: number };
    } = {};

    transactions.forEach((transaction) => {
      if (
        transaction.items &&
        (transaction.type === "PURCHASE" || transaction.type === "PICKUP")
      ) {
        transaction.items.forEach((item) => {
          const product = products.find(
            (p) => p._id === item.productId || p.name === item.productName
          );
          if (product) {
            // Handle category - it could be string or object
            let categoryName = "Other";
            if (typeof product.categoryId === "string") {
              categoryName = product.categoryId;
            } else if (
              product.categoryId &&
              typeof product.categoryId === "object" &&
              "name" in product.categoryId
            ) {
              categoryName = (product.categoryId as CategoryObj).name;
            }

            const itemRevenue =
              (item.unitPrice || product.unitPrice || 0) * item.quantity;
            const estimatedCost =
              (product.unitPrice || 0) * 0.7 * item.quantity; // 30% margin assumption

            if (!categoryRevenue[categoryName]) {
              categoryRevenue[categoryName] = { revenue: 0, cost: 0 };
            }
            categoryRevenue[categoryName].revenue += itemRevenue;
            categoryRevenue[categoryName].cost += estimatedCost;
          }
        });
      }
    });

    // If no category data found, return empty array
    if (Object.keys(categoryRevenue).length === 0) return [];

    // Calculate margins and convert to pie chart format
    const colors = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];
    let colorIndex = 0;

    const totalRevenue = Object.values(categoryRevenue).reduce(
      (sum, cat) => sum + cat.revenue,
      0
    );

    if (totalRevenue === 0) return [];

    return Object.entries(categoryRevenue)
      .map(([name, data]) => {
        const percentage =
          totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0;

        return {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: Math.round(percentage),
          color: colors[colorIndex++ % colors.length],
          percentage: Math.round(percentage * 100) / 100,
        };
      })
      .filter((item) => item.value > 0) // Only include categories with revenue
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  },

  getAverageDiscount: () => {
    const { transactions } = get();
    if (!transactions || transactions.length === 0) return 0;

    const transactionsWithDiscount = transactions.filter(
      (t) =>
        (t.type === "PURCHASE" || t.type === "PICKUP") &&
        t.discount &&
        t.discount > 0
    );

    if (transactionsWithDiscount.length === 0) return 0;

    const totalDiscount = transactionsWithDiscount.reduce(
      (sum, t) => sum + (t.discount || 0),
      0
    );
    const totalOriginalAmount = transactionsWithDiscount.reduce((sum, t) => {
      const amount = t.total || t.amountPaid || t.amount || 0;
      const discount = t.discount || 0;
      return sum + (amount + discount); // Original amount before discount
    }, 0);

    return totalOriginalAmount > 0
      ? Math.round((totalDiscount / totalOriginalAmount) * 100 * 100) / 100
      : 0;
  },

  getRevenueLift: () => {
    const { transactions } = get();
    if (!transactions)
      return { percentage: 0, direction: "no-change" as const };

    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    // Recent 3 months transactions
    const recentTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= threeMonthsAgo;
    });

    // Previous 3 months transactions (3-6 months ago)
    const previousTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= sixMonthsAgo && transactionDate < threeMonthsAgo
      );
    });

    const recentRevenue = getRevenueFromTransactions(recentTransactions);
    const previousRevenue = getRevenueFromTransactions(previousTransactions);

    const { percentage, direction } = calculatePercentageChange(
      recentRevenue,
      previousRevenue
    );

    return { percentage, direction };
  },

  getMarginImpact: () => {
    const { transactions, products } = get();
    if (!transactions || !products)
      return { percentage: 0, direction: "no-change" as const };

    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    // Calculate margin for recent period
    const recentTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= threeMonthsAgo &&
        (t.type === "PURCHASE" || t.type === "PICKUP")
      );
    });

    // Calculate margin for previous period
    const previousTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        transactionDate >= sixMonthsAgo &&
        transactionDate < threeMonthsAgo &&
        (t.type === "PURCHASE" || t.type === "PICKUP")
      );
    });

    const calculateMargin = (transactions: Transaction[]) => {
      let totalRevenue = 0;
      let totalCost = 0;

      transactions.forEach((transaction) => {
        const revenue =
          transaction.total ||
          transaction.amountPaid ||
          transaction.amount ||
          0;
        const cost = getProductCostFromTransaction(transaction, products);
        totalRevenue += revenue;
        totalCost += cost;
      });

      return totalRevenue > 0
        ? ((totalRevenue - totalCost) / totalRevenue) * 100
        : 0;
    };

    const recentMargin = calculateMargin(recentTransactions);
    const previousMargin = calculateMargin(previousTransactions);

    const marginDifference = recentMargin - previousMargin;

    return {
      percentage: Math.round(Math.abs(marginDifference) * 100) / 100,
      direction:
        marginDifference > 0
          ? ("increase" as const)
          : marginDifference < 0
          ? ("decrease" as const)
          : ("no-change" as const),
    };
  },

  // getPaymentMethodRevenue: () => {
  //   const { transactions } = get();
  //   if (!transactions) return [];

  //   const paymentMethodTotals: { [key: string]: number } = {};

  //   transactions.forEach((transaction) => {
  //     if (
  //       transaction.type === "PURCHASE" ||
  //       transaction.type === "PICKUP" ||
  //       transaction.type === "DEPOSIT"
  //     ) {
  //       const method = transaction.paymentMethod || "Cash";
  //       const amount =
  //         transaction.total ||
  //         transaction.amountPaid ||
  //         transaction.amount ||
  //         0;

  //       if (!paymentMethodTotals[method]) {
  //         paymentMethodTotals[method] = 0;
  //       }
  //       paymentMethodTotals[method] += amount;
  //     }
  //   });

  //   // Convert to required format
  //   return Object.entries(paymentMethodTotals)
  //     .map(([method, amount]) => {
  //       let displayMethod = method;
  //       let color = "text-green-600";

  //       // Handle different method names and set colors
  //       if (
  //         method.toLowerCase().includes("transfer") ||
  //         method.toLowerCase().includes("bank")
  //       ) {
  //         displayMethod = "Bank Transfer";
  //         color = "text-green-600";
  //       } else if (
  //         method.toLowerCase().includes("credit") ||
  //         method.toLowerCase().includes("pay later")
  //       ) {
  //         displayMethod = "Credit (Pay Later)";
  //         color = "text-red-600";
  //       } else if (method.toLowerCase().includes("cash")) {
  //         displayMethod = "Cash";
  //         color = "text-green-600";
  //       }

  //       return {
  //         method: displayMethod,
  //         revenue: `₦${amount.toLocaleString()}`,
  //         amount,
  //         color,
  //       };
  //     })
  //     .sort((a, b) => b.amount - a.amount);
  // },

  getPaymentMethodRevenue: () => {
    const { transactions } = get();
    if (!transactions) return [];

    // Normalize raw payment method string into canonical buckets
    const normalizeMethod = (raw?: string) => {
      if (!raw || typeof raw !== "string") return "Cash";
      const m = raw.trim().toLowerCase();

      if (m.includes("cash")) return "Cash";

      if (
        m.includes("transfer") ||
        m.includes("bank") ||
        m.includes("deposit") ||
        m.includes("card") ||
        m.includes("pos")
      )
        return "Bank Transfer";

      if (m.includes("credit") || m.includes("pay later"))
        return "Credit (Pay Later)";

      return "Other";
    };

    // Aggregate totals by normalized method
    const totals: Record<string, number> = {};

    transactions.forEach((transaction) => {
      if (
        transaction.type === "PURCHASE" ||
        transaction.type === "PICKUP" ||
        transaction.type === "DEPOSIT"
      ) {
        const rawMethod = transaction.paymentMethod || "Cash";
        const methodKey = normalizeMethod(rawMethod);
        const amount =
          transaction.total ||
          transaction.amountPaid ||
          transaction.amount ||
          0;

        if (!totals[methodKey]) totals[methodKey] = 0;
        totals[methodKey] += amount;
      }
    });

    // Map aggregated totals to the required return format
    const methodMeta: Record<string, { display: string; color: string }> = {
      Cash: { display: "Cash", color: "text-green-600" },
      "Bank Transfer": { display: "Bank Transfer", color: "text-green-600" },
      "Credit (Pay Later)": {
        display: "Credit (Pay Later)",
        color: "text-red-600",
      },
      Other: { display: "Other", color: "text-gray-600" },
    };

    const result = Object.entries(totals)
      .map(([key, amount]) => {
        const meta = methodMeta[key] || {
          display: key,
          color: "text-gray-600",
        };
        return {
          method: meta.display,
          revenue: `${formatCurrency(amount)}`,
          amount,
          color: meta.color,
        };
      })
      .sort((a, b) => b.amount - a.amount); // largest first

    return result;
  },
}));
