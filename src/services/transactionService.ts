import api from "./baseApi";
import type { Transaction } from "@/types/transactions";
import type { Period } from "@/types/revenue";
import { handleApiError } from "./errorhandler";
import type {
  CreateTransactionPayload,
  ClientWithTransactions,
} from "@/types/types";
import type { TransactionCreate } from "@/types/transactions";
import { useAuthStore } from "@/stores/useAuthStore";

export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get("/transactions");
    return response.data;
  } catch (error) {
    handleApiError(error, "Error fetching products");
    throw error;
  }
};

export const AddTransaction = async (
  data: TransactionCreate
): Promise<Transaction[]> => {
  try {
    const { user } = useAuthStore.getState();
    if (!user?.branchId) throw new Error("Branch ID missing");

    const response = await api.post("/transactions", {
      ...data,
      branchId: user.branchId,
    });

    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create transaction");

    throw error;
  }
};

export const createTransaction = async (
  clientId: string,
  transaction: CreateTransactionPayload
): Promise<ClientWithTransactions> => {
  try {
    //handling payment transactions specifically
    const payload =
      transaction.type === "DEPOSIT"
        ? {
            ...transaction,
            subtotal: transaction.amount,
            discount: 0,
            total: transaction.amount,
            amountPaid: transaction.amount,
            status: "COMPLETED",
            item: [],
          }
        : transaction;
    const response = await api.post<ClientWithTransactions>(
      `/clients/${clientId}/transactions`,
      payload
    );
    console.log("Transaction created:", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error creating transaction:");
    throw error;
  }
};

export const getRevenue = async (period: Period) => {
  const { data } = await api.get(`/transactions/revenue/${period}`);
  return data;
};
