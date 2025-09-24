import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/types/types";
import { toSentenceCaseName } from "@/utils/styles";
import { getAllClients, getClientDebtors } from "@/services/clientService";
import { useAuthStore } from "@/stores/useAuthStore";
import { getTabId, createTabSessionStorage } from "@/utils/tabSession";

interface clientStore {
  clients: Client[];
  debtors: Client[];
  isLoading: boolean;
  error: string | null;

  // Existing methods
  setClients: (clients: Client[]) => void;
  setDebtors: (debtors: Client[]) => void;
  getClientById: (id: string) => Client | null;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClientLocally: (id: string) => void;
  addPayment: (clientId: string, amount: number) => void;

  // Data fetching methods
  fetchClients: () => Promise<void>;
  fetchDebtors: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshClients: () => Promise<void>;


  // Derivative stats
  getClientsWithDebt: () => Client[];
  getNewClients: () => number;
  getActiveClients: () => number;
  getClientGrowthPercentage: () => number;
  getActiveClientsPercentage: () => number;
  getOutStandingBalanceData: () => {
    clientsWithDebt: number;
    totalDebt: number;
  };

  // Time-based functions
  getNewClientsThisMonth: () => number;
  getNewClientsLastMonth: () => number;
  getNewClientsPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
  getTotalClientsLastMonth: () => number;
  getTotalClientsPercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
  getOutStandingBalanceLastWeek: () => {
    clientsWithDebt: number;
    totalDebt: number;
  };
  getOutStandingBalancePercentageChange: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
  getOutStandingBalanceChangeSimple: () => {
    percentage: number;
    direction: "increase" | "decrease" | "no-change";
  };
}

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
  return {
    percentage: Math.round(Math.abs(percentageChange) * 100) / 100,
    direction:
      percentageChange > 0
        ? ("increase" as const)
        : percentageChange < 0
        ? ("decrease" as const)
        : ("no-change" as const),
  };
};

// Client service functions - Now using proper service imports
const fetchAllClients = async (): Promise<Client[]> => {
  return await getAllClients();
};

const fetchClientDebtors = async (): Promise<Client[]> => {
  return await getClientDebtors();
};

// CURRENT CODE (around line 200):
export const useClientStore = create<clientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      debtors: [],
      isLoading: false,
      error: null,

      // ADD THIS FUNCTION:
      refreshClients: async () => {
        await get().fetchClients();
        
        // Only fetch debtors if user has permission (not STAFF)
        const user = useAuthStore.getState().user;
        if (user && user.role !== 'STAFF') {
          await get().fetchDebtors();
        }
      },

      // Data fetching methods
      fetchClients: async () => {
        try {
          set({ isLoading: true, error: null });
          const clients = await fetchAllClients();
          set({
            clients: clients.map((client) => ({
              ...client,
              name: toSentenceCaseName(client.name),
            })),
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error fetching clients:", error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch clients",
          });
        }
      },

      fetchDebtors: async () => {
        try {
          set({ isLoading: true, error: null });
          const debtors = await fetchClientDebtors();
          set({
            debtors: debtors.map((debtor) => ({
              ...debtor,
              name: toSentenceCaseName(debtor.name),
            })),
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error fetching debtors:", error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch debtors",
          });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      setClients: (clients) =>
        set({
          clients: clients.map((client) => ({
            ...client,
            name: toSentenceCaseName(client.name),
          })),
        }),

      setDebtors: (debtors) =>
        set({
          debtors: debtors.map((debtor) => ({
            ...debtor,
            name: toSentenceCaseName(debtor.name),
          })),
        }),

      getClientById: (id) =>
        get().clients.find((client) => client._id === id) || null,

      updateClient: (id, updates) => {
        set((state) => {
          const currentTime = new Date().toISOString();

          const updatedClients = state.clients.map((cl) =>
            cl._id === id
              ? {
                  ...cl,
                  ...updates,
                  updatedAt: currentTime,
                  // If balance is being updated, also update lastTransactionDate
                  lastTransactionDate:
                    updates.balance !== undefined
                      ? currentTime
                      : cl.lastTransactionDate,
                }
              : cl
          );

          // Also update debtors if applicable
          const updatedDebtors = state.debtors
            .map((debtor) =>
              debtor._id === id
                ? {
                    ...debtor,
                    ...updates,
                    updatedAt: currentTime,
                    lastTransactionDate:
                      updates.balance !== undefined
                        ? currentTime
                        : debtor.lastTransactionDate,
                  }
                : debtor
            )
            .filter((debtor) => debtor._id !== id || (debtor.balance || 0) < 0); // Remove from debtors if balance is no longer negative

          return {
            clients: updatedClients,
            debtors: updatedDebtors,
          };
        });
      },

      deleteClientLocally: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c._id !== id),
          debtors: state.debtors.filter((c) => c._id !== id),
        })),

      addPayment: (clientId: string, newBalance: number) => {
        set((state) => {
          const updatedClients = state.clients.map((client) => {
            if (client._id === clientId) {
              const paymentAmount = Math.abs(newBalance - client.balance);
              const currentTime = new Date().toISOString();

              return {
                ...client,
                balance: newBalance,
                lastTransactionDate: currentTime,
                transactions: [
                  ...(client.transactions || []),
                  {
                    _id: Date.now().toString(),
                    type: "DEPOSIT" as const,
                    amount: paymentAmount,
                    date: currentTime,
                    description: `Payment received - Balance updated from ${client.balance.toFixed(
                      2
                    )} to ${newBalance.toFixed(2)}`,
                    reference: `TXN${Date.now()}`,
                  },
                ],
              };
            }
            return client;
          });

          // Also update debtors list if the client was/is a debtor
          const updatedDebtors = state.debtors
            .map((debtor) => {
              if (debtor._id === clientId) {
                const paymentAmount = Math.abs(newBalance - debtor.balance);
                const currentTime = new Date().toISOString();

                return {
                  ...debtor,
                  balance: newBalance,
                  lastTransactionDate: currentTime,
                  transactions: [
                    ...(debtor.transactions || []),
                    {
                      _id: Date.now().toString(),
                      type: "DEPOSIT" as const,
                      amount: paymentAmount,
                      date: currentTime,
                      description: `Payment received - Balance updated from ${debtor.balance.toFixed(
                        2
                      )} to ${newBalance.toFixed(2)}`,
                      reference: `TXN${Date.now()}`,
                    },
                  ],
                };
              }
              return debtor;
            })
            .filter((debtor) => debtor._id !== clientId || debtor.balance < 0); // Remove from debtors if balance is no longer negative

          return {
            clients: updatedClients,
            debtors: updatedDebtors,
          };
        });
      },

      // Active clients (clients with transactions in last 30 days)
      getActiveClients: () => {
        const { clients } = get();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        return clients.filter((client) => {
          if (!client.lastTransactionDate) return false;
          return new Date(client.lastTransactionDate) >= thirtyDaysAgo;
        }).length;
      },

      // New clients (registered in last 30 days)
      getNewClients: () => {
        const { clients } = get();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return clients.filter(
          (client) => new Date(client.createdAt) >= thirtyDaysAgo
        ).length;
      },

      getActiveClientsPercentage: () => {
        const total = get().clients.length;
        const active = get().getActiveClients();
        return total === 0 ? 0 : Math.round((active / total) * 100);
      },

      getClientGrowthPercentage: () => {
        const { clients } = get();
        const now = new Date();
        const lastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );

        const currentTotal = clients.length;
        const lastMonthTotal = clients.filter(
          (client) => new Date(client.createdAt) <= lastMonth
        ).length;

        if (lastMonthTotal === 0) return currentTotal > 0 ? 100 : 0;
        return Math.round(
          ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100
        );
      },

      getClientsWithDebt: () => {
        const { clients, debtors } = get();
        // Use debtors if available and has data, otherwise filter clients
        if (debtors.length > 0) {
          return debtors.filter((d) => d.balance < 0);
        }
        return clients.filter((c) => c.balance < 0);
      },

      getOutStandingBalanceData: () => {
        const { clients, debtors } = get();
        // Prioritize debtors array if it exists and has data, otherwise filter clients
        const clientsWithDebt =
          debtors.length > 0
            ? debtors.filter((d) => d.balance < 0)
            : clients.filter((c) => c.balance < 0);

        const totalDebt = clientsWithDebt.reduce(
          (sum, client) => sum + Math.abs(client.balance),
          0
        );

        return {
          clientsWithDebt: clientsWithDebt.length,
          totalDebt,
        };
      },

      // New clients this month
      getNewClientsThisMonth: () => {
        const { clients } = get();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return clients.filter((client) => {
          const createdDate = new Date(client.createdAt);
          return createdDate >= startOfMonth && createdDate <= endOfMonth;
        }).length;
      },

      // New clients last month
      getNewClientsLastMonth: () => {
        const { clients } = get();
        const now = new Date();
        const startOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        return clients.filter((client) => {
          const createdDate = new Date(client.createdAt);
          return (
            createdDate >= startOfLastMonth && createdDate <= endOfLastMonth
          );
        }).length;
      },

      getNewClientsPercentageChange: () => {
        const thisMonth = get().getNewClientsThisMonth();
        const lastMonth = get().getNewClientsLastMonth();
        return calculatePercentageChange(thisMonth, lastMonth);
      },

      // Total clients growth (current total vs last month's total)
      getTotalClientsLastMonth: () => {
        const { clients } = get();
        const now = new Date();
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        return clients.filter((client) => {
          const createdDate = new Date(client.createdAt);
          return createdDate <= lastMonthEnd;
        }).length;
      },

      getTotalClientsPercentageChange: () => {
        const currentTotal = get().clients.length;
        const lastMonthTotal = get().getTotalClientsLastMonth();
        return calculatePercentageChange(currentTotal, lastMonthTotal);
      },
      getOutStandingBalanceLastWeek: () => {
        const { clients, debtors } = get();
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const clientsToCheck =
          debtors.length > 0 ? debtors : clients.filter((c) => c.balance < 0);

        let totalDebtLastWeek = 0;
        let clientsWithDebtLastWeek = 0;

        clientsToCheck.forEach((client) => {
          // Check if client had debt a week ago by looking at transaction history
          const recentTransactions =
            client.transactions?.filter(
              (txn) => new Date(txn.date) > oneWeekAgo
            ) || [];

          // Calculate what the balance would have been without recent transactions
          const recentTransactionSum = recentTransactions.reduce((sum, txn) => {
            return sum + (txn.type === "DEPOSIT" ? -txn.amount : txn.amount);
          }, 0);

          const estimatedBalanceLastWeek =
            client.balance - recentTransactionSum;

          if (estimatedBalanceLastWeek < 0) {
            clientsWithDebtLastWeek++;
            totalDebtLastWeek += Math.abs(estimatedBalanceLastWeek);
          }
        });

        return {
          clientsWithDebt: clientsWithDebtLastWeek,
          totalDebt: totalDebtLastWeek,
        };
      },

      // Get outstanding balance percentage change from last week
      getOutStandingBalancePercentageChange: () => {
        const currentData = get().getOutStandingBalanceData();
        const lastWeekData = get().getOutStandingBalanceLastWeek();

        return calculatePercentageChange(
          currentData.totalDebt,
          lastWeekData.totalDebt
        );
      },

      // Alternative simpler method if you don't have reliable transaction history
      getOutStandingBalanceChangeSimple: () => {
        const { clients } = get();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get clients who became debtors or had transactions in the last week
        const recentActivity = clients.filter((client) => {
          const lastTransactionDate = client.lastTransactionDate
            ? new Date(client.lastTransactionDate)
            : null;
          return (
            client.balance < 0 &&
            lastTransactionDate &&
            lastTransactionDate >= oneWeekAgo
          );
        });

        // If we have recent activity, provide a reasonable estimate
        if (recentActivity.length > 0) {
          // Assume 5-15% change based on activity level
          const changePercentage = Math.min(
            15,
            Math.max(5, recentActivity.length * 2)
          );
          return {
            percentage: changePercentage,
            direction: "increase" as const,
          };
        }

        // If no clear pattern, return minimal change
        return { percentage: 1, direction: "no-change" as const };
      },
    }),
    {
      name: `client-store-${getTabId()}`,
      storage: createTabSessionStorage(),
    }
  )
);
