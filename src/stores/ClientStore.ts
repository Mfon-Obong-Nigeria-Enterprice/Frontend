import { create } from "zustand";
import { type AdminSetupClientData } from "../types/types";

interface ClientStore {
  clients: AdminSetupClientData[];
  addClient: (client: AdminSetupClientData) => void;
  removeClient: (clientNumber: string) => void;
  clearClients: () => void;
  totalClients: number;
  totalDeposits: number;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  addClient: (client) => {
    const existing = get().clients;
    const duplicate = existing.some(
      (c) =>
        c.clientNumber === client.clientNumber &&
        c.clientName.toLowerCase() === client.clientName.toLowerCase()
    );

    if (duplicate) return;

    const updated = [...existing, client];
    set({
      clients: updated,
    });
  },
  removeClient: (clientNumber) => {
    set((state) => ({
      clients: state.clients.filter(
        (client) => client.clientNumber !== clientNumber
      ),
    }));
  },
  clearClients: () => set({ clients: [] }),
  get totalClients() {
    return get().clients.length;
  },
  get totalDeposits() {
    return get().clients.reduce(
      (sum, client) => sum + (client.initialBal || 0),
      0
    );
  },
}));
