import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/types/types";
import { toSentenceCaseName } from "@/utils/styles";
// You'll need to create these API functions or import from your existing API service
import { getAllClients } from "@/services/clientService"; // Adjust import path as needed

interface clientStore {
  clients: Client[];
  isLoading: boolean;
  error: string | null;

  // Existing methods
  setClients: (clients: Client[]) => void;
  getClientById: (id: string) => Client | null;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClientLocally: (id: string) => void;
  addPayment: (clientId: string, amount: number) => void;

  // NEW: Data fetching methods
  fetchClients: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Derivative stats (existing)
  getClientsWithDebt: () => Client[];
  getNewClients: () => number;
  getActiveClients: () => number;
  getClientGrowthPercentage: () => number;
  getActiveClientsPercentage: () => number;
  getOutStandingBalanceData: () => {
    clientsWithDebt: number;
    totalDebt: number;
  };

  // New functions (existing)
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

export const useClientStore = create<clientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      isLoading: false,
      error: null,

      // NEW: Data fetching method
      fetchClients: async () => {
        try {
          set({ isLoading: true, error: null });
          const clients = await getAllClients();
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

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      setClients: (clients) =>
        set({
          clients: clients.map((client) => ({
            ...client,
            name: toSentenceCaseName(client.name),
          })),
        }),

      getClientById: (id) =>
        get().clients.find((client) => client._id === id) || null,

      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((cl) =>
            cl._id === id
              ? { ...cl, ...updates, updatedAt: new Date().toISOString() }
              : cl
          ),
        }));
      },

      deleteClientLocally: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c._id !== id),
        })),

      addPayment: (clientId: string, newBalance: number) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client._id === clientId
              ? {
                  ...client,
                  balance: newBalance,
                  lastTransactionDate: new Date().toISOString(),
                  transactions: [
                    ...(client.transactions || []),
                    {
                      _id: Date.now().toString(),
                      type: "DEPOSIT",
                      amount: Math.abs(client.balance - newBalance),
                      date: new Date().toISOString(),
                      description: "Payment received",
                      reference: `TXN${Date.now()}`,
                    },
                  ],
                }
              : client
          ),
        }));
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
        return get().clients.filter((c) => c.balance < 0);
      },

      getOutStandingBalanceData: () => {
        const { clients } = get();
        const clientsWithDebt = clients.filter((client) => client.balance < 0);
        const totalDebt = clientsWithDebt.reduce(
          (sum, client) => sum + Math.abs(client.balance),
          0
        );
        return {
          clientsWithDebt: clientsWithDebt.length,
          totalDebt,
        };
      },

      // NEW FUNCTIONS

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
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month

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
    }),
    {
      name: "client-store",
      partialize: (state) => ({
        clients: state.clients,
      }),
    }
  )
);
