import api from "./baseApi";
import type { ClientPaymentCreate, Transaction } from "@/types/transactions";
import type { Period } from "@/types/revenue";
import type { TransactionCreate } from "@/types/transactions";
import { useAuthStore } from "@/stores/useAuthStore";

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("/transactions");
  return response.data;
};

export const getTransactionsByBranch = async (
  branchId?: string
): Promise<Transaction[]> => {
  const response = await api.get(
    branchId ? `/transactions/branch/${branchId}` : `/transactions/branch/ `
  );
  return response.data;
};

export const getTransactionByUserId = async (
  userId?: string
): Promise<Transaction[]> => {
  const url = userId ? `/transactions/user/${userId}` : `/transactions/user/`;

  const response = await api.get(url);
  return response.data;
};

export const AddTransaction = async (
  data: TransactionCreate
): Promise<Transaction> => {
  const { user } = useAuthStore.getState();
  if (!user?.branchId) throw new Error("Branch ID missing");

  const response = await api.post("/transactions", {
    ...data,
    branchId: user.branchId,
  });
  return response.data;
};

// Specific function for client debt payments
export const AddClientPayment = async (
  data: ClientPaymentCreate
): Promise<Transaction> => {
  const { user } = useAuthStore.getState();
  if (!user?.branchId) throw new Error("Branch ID missing");

  const response = await api.post(`/clients/${data.clientId}/transactions`, {
    type: data.type,
    amount: data.amount,
    description: data.description || `Debt payment received`,
    paymentMethod: data.paymentMethod || "Cash",
    reference: data.reference,
    branchId: user.branchId,
  });

  return response.data;
};

export const createTransaction = async (
  transactionData: Partial<Transaction>
): Promise<Transaction> => {
  const response = await api.post("/transactions", transactionData);
  return response.data;
};

export const getRevenue = async (period: Period) => {
  const { data } = await api.get(`/transactions/revenue/${period}`);
  return data;
};
