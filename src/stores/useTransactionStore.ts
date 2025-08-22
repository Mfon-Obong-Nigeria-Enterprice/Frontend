import { create } from "zustand";
import { toSentenceCaseName } from "@/utils/styles";
import type { Transaction } from "@/types/transactions";

type TransactionState = {
  transactions: Transaction[] | null;
  selectedTransaction: Transaction | null;
  open: boolean;

  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transactions: Transaction) => void;
  openModal: (transaction: Transaction) => void;
  closeModal: () => void;
  getTodaysSales: () => number;
  getYesterdaysSales: () => number;
  getSalesPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };

  // New functions
  getThisWeekSales: () => number;
  getLastWeekSales: () => number;
  getWeeklySalesPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
  getThisMonthSales: () => number;
  getLastMonthSales: () => number;
  getMonthlySalesPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
  getTotalTransactionsCount: () => number;
  getLastMonthTransactionsCount: () => number;
  getTransactionsCountPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };

  getTodaysPayments: () => number;
  getYesterdaysPayments: () => number;
  getPaymentsPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
  getThisWeekPayments: () => number;
  getLastWeekPayments: () => number;
  getWeeklyPaymentsPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
  getThisMonthPayments: () => number;
  getLastMonthPayments: () => number;
  getMonthlyPaymentsPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };

  getTodaysTransactionCount: () => number;
  getYesterdaysTransactionCount: () => number;
  getTodaysTransactionCountPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };

  // New average transaction functions
  getThisWeekAverageTransaction: () => number;
  getLastWeekAverageTransaction: () => number;
  getWeeklyAverageTransactionPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
};

// Helper function to get start of week (Monday)
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
};

// Helper function to get end of week (Sunday)
const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);
  return endOfWeek;
};

// Helper function to check if date is in range
const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
};

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0 && current === 0) {
    return { percentage: 0, direction: "no-change" as const };
  }
  if (previous === 0 && current > 0) {
    return { percentage: 100, direction: "increase" as const };
  }
  if (previous > 0 && current === 0) {
    return { percentage: -100, direction: "decrease" as const };
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

export const useTransactionsStore = create<TransactionState>((set, get) => ({
  transactions: [],
  selectedTransaction: null,
  open: false,

  setTransactions: (transactions) =>
    set({
      transactions: transactions.map((txn) => {
        // Ensure all payment transactions have required properties
        if (txn.type === "DEPOSIT") {
          return {
            ...txn,
            items: txn.items || [], // Ensure items exists
            subtotal: txn.subtotal || txn.amount || 0,
            total: txn.total || txn.amount || 0,
            amountPaid: txn.amountPaid || txn.amount || 0,
            discount: txn.discount || 0,
            walkInClientName: txn.walkInClient?.name
              ? toSentenceCaseName(txn.walkInClient.name)
              : undefined,
            clientName: txn.clientId?.name
              ? toSentenceCaseName(txn.clientId.name)
              : txn.client?.name
              ? toSentenceCaseName(txn.client.name)
              : undefined,
          };
        }

        return {
          ...txn,
          walkInClientName: txn.walkInClient?.name
            ? toSentenceCaseName(txn.walkInClient.name)
            : undefined,
          clientName: txn.clientId?.name
            ? toSentenceCaseName(txn.clientId.name)
            : undefined,
        };
      }),
    }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: state.transactions
        ? [
            ...state.transactions,
            {
              ...transaction,
              walkInClientName: transaction.walkInClient?.name
                ? toSentenceCaseName(transaction.walkInClient.name)
                : undefined,
              clientName: transaction.clientId?.name
                ? toSentenceCaseName(transaction.clientId.name)
                : transaction.client?.name
                ? toSentenceCaseName(transaction.client.name)
                : undefined,
            },
          ]
        : [transaction],
    })),

  openModal: (transaction) =>
    set({ open: true, selectedTransaction: transaction }),
  closeModal: () => set({ open: false, selectedTransaction: null }),

  getTodaysSales: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const today = new Date().toDateString();

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt).toDateString();
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          transactionDate === today
        );
      })
      .reduce((total, t) => {
        // Handle multiple possible amount fields with fallbacks
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  getYesterdaysSales: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt).toDateString();
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          transactionDate === yesterday
        );
      })
      .reduce((total, t) => {
        // Handle multiple possible amount fields with fallbacks
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  // Calculate percentage change in sales
  getSalesPercentageChange: () => {
    const todaysSales = get().getTodaysSales();
    const yesterdaysSales = get().getYesterdaysSales();
    return calculatePercentageChange(todaysSales, yesterdaysSales);
  },

  // Get today's transaction count
  getTodaysTransactionCount: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const today = new Date().toDateString();

    return transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt).toDateString();
      return transactionDate === today;
    }).length;
  },

  // Get yesterday's transaction count
  getYesterdaysTransactionCount: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    return transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt).toDateString();
      return transactionDate === yesterday;
    }).length;
  },

  // Calculate percentage change in today's transactions vs yesterday
  getTodaysTransactionCountPercentageChange: () => {
    const todaysCount = get().getTodaysTransactionCount();
    const yesterdaysCount = get().getYesterdaysTransactionCount();
    return calculatePercentageChange(todaysCount, yesterdaysCount);
  },

  // Weekly sales functions
  getThisWeekSales: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    const endOfWeek = getEndOfWeek(now);

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          isDateInRange(transactionDate, startOfWeek, endOfWeek)
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  getLastWeekSales: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const lastWeekStart = new Date(getStartOfWeek(now));
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(getEndOfWeek(now));
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          isDateInRange(transactionDate, lastWeekStart, lastWeekEnd)
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  getWeeklySalesPercentageChange: () => {
    const thisWeekSales = get().getThisWeekSales();
    const lastWeekSales = get().getLastWeekSales();
    return calculatePercentageChange(thisWeekSales, lastWeekSales);
  },

  // Monthly sales functions
  getThisMonthSales: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          isDateInRange(transactionDate, startOfMonth, endOfMonth)
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  getLastMonthSales: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          isDateInRange(transactionDate, startOfLastMonth, endOfLastMonth)
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  getMonthlySalesPercentageChange: () => {
    const thisMonthSales = get().getThisMonthSales();
    const lastMonthSales = get().getLastMonthSales();
    return calculatePercentageChange(thisMonthSales, lastMonthSales);
  },

  // Transaction count functions
  getTotalTransactionsCount: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return isDateInRange(transactionDate, startOfMonth, endOfMonth);
    }).length;
  },

  getLastMonthTransactionsCount: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return isDateInRange(transactionDate, startOfLastMonth, endOfLastMonth);
    }).length;
  },

  getTransactionsCountPercentageChange: () => {
    const thisMonthCount = get().getTotalTransactionsCount();
    const lastMonthCount = get().getLastMonthTransactionsCount();
    return calculatePercentageChange(thisMonthCount, lastMonthCount);
  },

  getTodaysPayments: () => {
    const { transactions } = get();
    if (!transactions || transactions.length === 0) return 0;

    const today = new Date().toDateString();

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt).toDateString();
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "DEPOSIT") &&
          transactionDate === today
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  // Yesterday's payments received
  getYesterdaysPayments: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt).toDateString();
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          transactionDate === yesterday
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  // Payments percentage change (today vs yesterday)
  getPaymentsPercentageChange: () => {
    const todaysPayments = get().getTodaysPayments();
    const yesterdaysPayments = get().getYesterdaysPayments();
    return calculatePercentageChange(todaysPayments, yesterdaysPayments);
  },

  // This week's payments
  getThisWeekPayments: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          isDateInRange(transactionDate, startOfWeek, endOfWeek)
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  // Last week's payments
  getLastWeekPayments: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const lastWeekStart = new Date(getStartOfWeek(now));
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(getEndOfWeek(now));
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          isDateInRange(transactionDate, lastWeekStart, lastWeekEnd)
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  // Weekly payments percentage change
  getWeeklyPaymentsPercentageChange: () => {
    const thisWeekPayments = get().getThisWeekPayments();
    const lastWeekPayments = get().getLastWeekPayments();
    return calculatePercentageChange(thisWeekPayments, lastWeekPayments);
  },

  // This month's payments
  getThisMonthPayments: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          isDateInRange(transactionDate, startOfMonth, endOfMonth)
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  // Last month's payments
  getLastMonthPayments: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        // Only count PURCHASE transactions as sales (PICKUP means not yet collected)
        return (
          (t.type === "PURCHASE" || t.type === "PICKUP") &&
          isDateInRange(transactionDate, startOfLastMonth, endOfLastMonth)
        );
      })
      .reduce((total, t) => {
        const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
        return total + amount;
      }, 0);
  },

  // Monthly payments percentage change
  getMonthlyPaymentsPercentageChange: () => {
    const thisMonthPayments = get().getThisMonthPayments();
    const lastMonthPayments = get().getLastMonthPayments();
    return calculatePercentageChange(thisMonthPayments, lastMonthPayments);
  },

  // This week's average transaction value
  getThisWeekAverageTransaction: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);

    const thisWeekTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        (t.type === "PURCHASE" || t.type === "PICKUP") &&
        isDateInRange(transactionDate, startOfWeek, endOfWeek)
      );
    });

    if (thisWeekTransactions.length === 0) return 0;

    const totalAmount = thisWeekTransactions.reduce((total, t) => {
      const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
      return total + amount;
    }, 0);

    return Math.round((totalAmount / thisWeekTransactions.length) * 100) / 100;
  },

  // Last week's average transaction value
  getLastWeekAverageTransaction: () => {
    const { transactions } = get();
    if (!transactions) return 0;

    const now = new Date();
    const lastWeekStart = new Date(getStartOfWeek(now));
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(getEndOfWeek(now));
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

    const lastWeekTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        (t.type === "PURCHASE" || t.type === "PICKUP") &&
        isDateInRange(transactionDate, lastWeekStart, lastWeekEnd)
      );
    });

    if (lastWeekTransactions.length === 0) return 0;

    const totalAmount = lastWeekTransactions.reduce((total, t) => {
      const amount = t.amount ?? t.total ?? t.amountPaid ?? 0;
      return total + amount;
    }, 0);

    return Math.round((totalAmount / lastWeekTransactions.length) * 100) / 100;
  },

  // Weekly average transaction percentage change
  getWeeklyAverageTransactionPercentageChange: () => {
    const thisWeekAvg = get().getThisWeekAverageTransaction();
    const lastWeekAvg = get().getLastWeekAverageTransaction();
    return calculatePercentageChange(thisWeekAvg, lastWeekAvg);
  },
}));
