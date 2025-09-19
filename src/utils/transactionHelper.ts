/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/transactionHelpers.ts
import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";

/**
 * Ensures transaction has proper structure for the client transaction details
 */
export const normalizeTransaction = (
  transaction: any,
  client?: Client
): Transaction => {
  return {
    _id: transaction._id || `temp_${Date.now()}`,
    type: transaction.type,
    amount: Number(transaction.amount),
    total: Number(transaction.total || transaction.amount),
    description: transaction.description || "",
    paymentMethod: transaction.paymentMethod || "Cash",
    reference: transaction.reference || "",
    createdAt: transaction.createdAt || new Date().toISOString(),
    status: transaction.status || "COMPLETED",

    // Ensure client structure matches what ClientTransactionDetails expects
    client:
      transaction.client ||
      (client
        ? {
            _id: client._id,
            name: client.name,
            phone: client.phone,
          }
        : undefined),

    // Legacy support for clientId
    clientId: transaction.clientId || transaction.client?._id,

    userId: transaction.userId || null,
    invoiceNumber: transaction.invoiceNumber || null,

    // Add any other required fields based on your Transaction type
    ...transaction,
  };
};

/**
 * Validates that a transaction is properly structured
 */
export const validateTransaction = (transaction: any): boolean => {
  const required = ["type", "amount", "createdAt"];
  const hasRequired = required.every(
    (field) => transaction[field] !== undefined
  );

  const hasClientRef = transaction.client?._id || transaction.clientId;

  if (!hasRequired || !hasClientRef) {
    console.warn("Invalid transaction structure:", {
      hasRequired,
      hasClientRef,
      transaction,
    });
    return false;
  }

  return true;
};

/**
 * Debug helper to log transaction flow
 */
export const debugTransactionFlow = (
  stage: string,
  transaction: any,
  additionalData?: any
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`🔍 Transaction Debug [${stage}]:`, {
      transactionId: transaction._id,
      type: transaction.type,
      amount: transaction.amount,
      clientId: transaction.client?._id || transaction.clientId,
      createdAt: transaction.createdAt,
      ...additionalData,
    });
  }
};
