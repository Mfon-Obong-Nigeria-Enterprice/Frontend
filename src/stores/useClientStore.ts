import { createClient, getAllClients } from "@/services/clientService";
import { getAllProducts } from "@/services/productService";
import { createTransaction } from "@/services/transactionService";
import type {
  Client,
  Product,
  TransactionItem,
  CreateTransactionPayload,
} from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface clientStore {
  products: Product[];
  clients: Client[];
  transactions: TransactionItem[];
  // currentUser: User | null;

  initializeStore: () => Promise<void>;

  // Product Actions
  addProduct: (product: Product) => void;

  // Client Actions
  addClient: (client: Client) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addPayment: (clientId: string, amount: number) => void;
  addTransaction: (
    id: string,
    payload: CreateTransactionPayload
  ) => Promise<void>;

  // Utility functions
  getTotalInventoryValue: () => number;
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
      products: [],
      clients: [],
      transactions: [],
      // currentUser: null,

      initializeStore: async () => {
        try {
          const state = get();
          if (
            state.products.length === 0 &&
            state.clients.length === 0 &&
            state.transactions.length === 0
          ) {
            const [products, clients] = await Promise.all([
              getAllProducts(),
              getAllClients(),
            ]);

            set({
              products,
              clients,
              transactions: [],
              // currentUser: null,
            });
          }
        } catch (err) {
          console.error("failed to initialize store", err);
        }
      },

      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product],
        }));
      },

      addClient: async (clientData) => {
        try {
          // Call the API to create the client on the backend
          const newClient = await createClient(clientData);

          // Update local state with the client returned from the API
          set((state) => ({
            clients: [...state.clients, newClient],
          }));

          console.log("Client successfully created:", newClient);
        } catch (error) {
          console.error("Failed to create client:", error);
          throw error; // Re-throw so the UI can handle the error
        }
      },

      // addClient: (clientData) => {
      //   const client: Client = {
      //     ...clientData,
      //     _id: Date.now().toString(),
      //     balance: 0,
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //   };
      //   set((state) => ({
      //     clients: [...state.clients, client],
      //   }));
      // },

      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((cl) =>
            cl._id === id
              ? { ...cl, ...updates, updatedAt: new Date().toISOString() }
              : cl
          ),
        }));
      },

      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((c) => c._id !== id),
        }));
      },

      addPayment: (clientId, amount) => {
        // update client balance

        set((state) => ({
          clients: state.clients.map((client) =>
            client._id === clientId
              ? {
                  ...client,
                  balance: client.balance + amount,
                  updatedAt: new Date().toISOString(),
                }
              : client
          ),
        }));

        // Add transaction record
        const transaction: TransactionItem = {
          _id: Date.now().toString(),
          type: "DEPOSIT",
          amount,
          date: new Date().toISOString(),
          description: "payment recieved",
          reference: "",
        };

        set((state) => ({
          transactions: [...state.transactions, transaction],
        }));
      },

      getActiveClients: () => {
        const { transactions } = get();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const activeClientIds = new Set(
          transactions
            .filter((t) => new Date(t.date) >= thirtyDaysAgo)
            .map((t) => t._id)
        );
        return activeClientIds.size;
      },

      getNewClients: () => {
        const { clients } = get();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return clients.filter(
          (client) => new Date(client.createdAt) >= thirtyDaysAgo
        ).length;
      },
      getActiveClientsPercentage: () => {
        const { clients } = get();
        const totalClients = clients.length;
        const activeClients = get().getActiveClients();

        if (totalClients == 0) return 0;
        return Math.round((activeClients / totalClients) * 100);
      },
      //
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

      addTransaction: async (ClientId, payload) => {
        try {
          const updatedClient = await createTransaction(ClientId, payload);
          set((state) => ({
            clients: state.clients.map((client) =>
              client._id === updatedClient._id ? updatedClient : client
            ),
            transactions: [
              ...state.transactions,
              ...updatedClient.transactions.slice(-1),
            ],
          }));
        } catch (err) {
          console.error(err);
        }
      },

      getClientsWithDebt: () => {
        return get().clients.filter((c) => c.balance < 0);
      },

      getTotalInventoryValue: () => {
        return get().products.reduce(
          (acc, pr) => acc + pr.unitPrice * pr.stock,
          0
        );
      },

      getOutStandingBalanceData: () => {
        const { clients } = get();
        const clientWithDebt = clients.filter((client) => client.balance < 0);
        const totalDebt = clientWithDebt.reduce(
          (sum, client) => sum + Math.abs(client.balance),
          0
        );

        return {
          clientsWithDebt: clientWithDebt.length,
          totalDebt,
        };
      },
    }),
    {
      name: "inventory-store",
      partialize: (state) => ({
        products: state.products,
        transactions: state.transactions,
      }),
    }
  )
);
