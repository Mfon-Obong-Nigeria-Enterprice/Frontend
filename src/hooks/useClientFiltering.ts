import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";
import { useCallback, useMemo, useState } from "react";

export type clientStat = "All status" | "registered" | "unregistered";
export type clientBalance = "All Balances" | "PURCHASE" | "WHOLESALE" | "RETURN" | "DEPOSIT";

function useClientFiltering(clients: Client[] = [], allTransactions?: Transaction[]) {
  const [clientStatus, setClientStatus] = useState<clientStat>("All status");
  const [clientBalance, setClientBalance] = useState<clientBalance>("All Balances");

  // Build a map of clientId → latest transaction type using allTransactions (same source as display)
  const latestTypeMap = useMemo(() => {
    if (!allTransactions || allTransactions.length === 0) return null;
    const sorted = [...allTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const map = new Map<string, string>();
    sorted.forEach((txn) => {
      const clientId =
        (typeof txn.clientId === "object" ? txn.clientId?._id : txn.clientId) ||
        (typeof txn.client === "object" && txn.client !== null ? (txn.client as any)?._id : undefined);
      if (clientId && !map.has(clientId)) map.set(clientId, txn.type);
    });
    return map;
  }, [allTransactions]);

  const clientStat = useCallback(
    (client: Client) => {
      if (clientStatus === "All status") return true;
      if (clientStatus === "registered") return client.isRegistered === true;
      if (clientStatus === "unregistered") return client.isRegistered === false;
      return true;
    },
    [clientStatus]
  );

  const clientBal = useCallback(
    (client: Client) => {
      if (clientBalance === "All Balances") return true;

      // Use allTransactions-based map when available (same data source as Type column display)
      if (latestTypeMap) {
        return latestTypeMap.get(client._id) === clientBalance;
      }

      // Fallback: use client.transactions embedded on the client object
      if (
        !client.transactions ||
        !Array.isArray(client.transactions) ||
        client.transactions.length === 0
      ) {
        return false;
      }
      const sorted = [...client.transactions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sorted[0]?.type === clientBalance;
    },
    [clientBalance, latestTypeMap]
  );

  const filteredClients = useMemo(() => {
    if (!clients || !Array.isArray(clients)) return [];
    return clients
      .filter((client) => clientStat(client))
      .filter((client) => clientBal(client));
  }, [clients, clientStat, clientBal]);

  return {
    filteredClients,
    clientBalance,
    clientStatus,
    setClientBalance,
    setClientStatus,
  };
}

export default useClientFiltering;
