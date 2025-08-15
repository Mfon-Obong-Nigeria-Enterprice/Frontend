import localforage from "localforage";
import api from "./baseApi";
import type { Transaction } from "@/types/transactions";
import type { Period } from "@/types/revenue";
import { AxiosError } from "axios";
import type {
  // TransactionItem,
  CreateTransactionPayload,
  // ClientWithTransactions,
} from "@/types/types";

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const token = await localforage.getItem<string>("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const response = await api.get("/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Error fetching products:",
      err.response?.data || err.message
    );
    throw error;
  }
};

type ClientWithTransactions = {
  // Define the structure here or import from the correct file if it exists elsewhere
  // Example:
  id: string;
  name: string;
  transactions: Transaction[];
};

export const createTransaction = async (
  clientId: string,
  transaction: CreateTransactionPayload
): Promise<ClientWithTransactions> => {
  const token = await localforage.getItem<string>("access_token");
  if (!token) throw new Error("No access token found");

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
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Transaction created:", response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Error creating transaction:",
      err.response?.data || err.message
    );
    throw error;
  }
};

export const getRevenue = async (period: Period) => {
  const { data } = await api.get(`/transactions/revenue/${period}`);
  return data;
};
