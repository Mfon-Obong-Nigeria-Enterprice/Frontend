import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/types/types";
// import { createTransaction } from "@/services/transactionService";
import { toSentenceCaseName } from "@/utils/styles";
import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";
import { useEffect } from "react";

interface clientStore {
  clients: Client[];

  setClients: (clients: Client[]) => void;
  getClientById: (id: string) => Client | null;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClientLocally: (id: string) => void;

  addPayment: (clientId: string, amount: number) => void;

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
}

export const useClientStore = create<clientStore>()(
  persist(
    (set, get) => ({
      clients: [],

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

      addPayment: (clientId, amount) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client._id === clientId
              ? {
                  ...client,
                  balance: Number(client.balance) + amount,
                  lastTransactionDate: new Date().toISOString(),
                  transaction: [
                    ...(client.transactions || []),
                    {
                      _id: Date.now().toString(),
                      type: "DEPOSIT",
                      amount,
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

      getActiveClients: () => {
        const { clients } = get();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const activeClientIds = new Set(
          clients
            ?.filter((t) => new Date(t.createdAt) >= thirtyDaysAgo)
            .map((t) => t._id)
        );
        return activeClientIds.size;
      },

      getNewClients: () => {
        const { clients } = get();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return clients?.filter(
          (client) => new Date(client.createdAt) >= thirtyDaysAgo
        ).length;
      },

      getActiveClientsPercentage: () => {
        const total = get().clients?.length;
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
        const lastMonthTotal = clients?.filter(
          (client) => new Date(client.createdAt) <= lastMonth
        ).length;

        if (lastMonthTotal === 0) return currentTotal > 0 ? 100 : 0;
        return Math.round(
          ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100
        );
      },

      getClientsWithDebt: () => {
        return get().clients?.filter((c) => c.balance < 0);
      },

      getOutStandingBalanceData: () => {
        const { clients } = get();
        const clientsWithDebt = clients?.filter((client) => client.balance < 0);
        const totalDebt = clientsWithDebt?.reduce(
          (sum, client) => sum + Math.abs(client.balance),
          0
        );
        return {
          clientsWithDebt: clientsWithDebt?.length,
          totalDebt,
        };
      },
    }),
    {
      name: "inventory-store",
      partialize: (state) => ({
        clients: state.clients,
      }),
    }
  )
);

export const useSyncClientsWithQuery = () => {
  const { data: queryClients } = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
  });

  const setClients = useClientStore((state) => state.setClients);

  useEffect(() => {
    if (queryClients) {
      setClients(queryClients);
    }
  }, [queryClients, setClients]);
};
