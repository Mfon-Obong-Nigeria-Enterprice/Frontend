import type { Client } from "@/types/types";
import { useCallback, useMemo, useState } from "react";

export type clientStat = "All status" | "registered" | "unregistered";
export type clientBalance = "All Balances" | "PURCHASE" | "PICKUP" | "DEPOSIT";

function useClientFiltering(clients: Client[] = []) {
  const [clientStatus, setClientStatus] = useState<clientStat>("All status");
  const [clientBalance, setClientBalance] =
    useState<clientBalance>("All Balances");

  //
  const clientStat = useCallback(
    (client: Client) => {
      if (clientStatus === "All status") return true;
      if (clientStatus === "registered") return client.isRegistered === true;
      if (clientStatus === "unregistered") return client.isRegistered === false;
      return true;
    },
    [clientStatus]
  );

  //
  const clientBal = useCallback(
    (client: Client) => {
      if (clientBalance === "All Balances") return true;

      // Check if client has transactions
      if (
        !client.transactions ||
        !Array.isArray(client.transactions) ||
        client.transactions.length === 0
      ) {
        return false;
      }

      const hasPurchase = client.transactions.some((transaction) => {
        return transaction.type === "PURCHASE";
      });

      const hasPickup = client.transactions.some((transaction) => {
        return transaction.type === "PICKUP";
      });
      const hasDeposit = client.transactions.some((transaction) => {
        return transaction.type === "DEPOSIT";
      });
      if (clientBalance === "PURCHASE") return hasPurchase;
      if (clientBalance === "PICKUP") return hasPickup;
      if (clientBalance === "DEPOSIT") return hasDeposit;

      return true;
    },
    [clientBalance]
  );

  //
  // Usage example with filtered clients
  const filteredClients = useMemo(() => {
    if (!clients || !Array.isArray(clients)) {
      return [];
    }
    // console.log("📊 Original clients count:", clients.length);

    // Apply status filter first
    const statusFiltered = clients.filter((client) => {
      const passes = clientStat(client);
      return passes;
    });

    // Apply balance filter
    const balanceFiltered = statusFiltered.filter((client) => {
      const passes = clientBal(client);
      return passes;
    });

    return balanceFiltered;
  }, [clients, clientStat, clientBal]);

  //
  return {
    filteredClients,
    clientBalance,
    clientStatus,
    setClientBalance,
    setClientStatus,
  };
}

export default useClientFiltering;
