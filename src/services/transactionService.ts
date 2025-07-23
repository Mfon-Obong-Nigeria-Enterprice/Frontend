import localforage from "localforage";
import api from "./baseApi";
import type { Transaction } from "@/types/transactions";
import { AxiosError } from "axios";
// import type {
//   // TransactionItem,
//   CreateTransactionPayload,
//   ClientWithTransactions,
// } from "@/types/types";

export const getAllTransactions = async (): Promise<Transaction> => {
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
// export const createTransaction = async (
//   clientId: string,
//   transaction: CreateTransactionPayload
// ): Promise<ClientWithTransactions> => {
//   const token = await localforage.getItem<string>("access_token");
//   if (!token) throw new Error("No access token found");

//   try {
//     const response = await api.post<ClientWithTransactions>(
//       `/clients/${clientId}/transactions`,
//       transaction,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     console.log("Transaction created:", response.data);
//     return response.data;
//   } catch (error) {
//     const err = error as AxiosError;
//     console.error(
//       "Error creating transaction:",
//       err.response?.data || err.message
//     );
//     throw error;
//   }
// };
