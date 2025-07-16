import localforage from "localforage";
import api from "./baseApi";
import { type AxiosError } from "axios";
import type {
  // TransactionItem,
  CreateTransactionPayload,
  ClientWithTransactions,
} from "@/types/types";

export const createTransaction = async (
  clientId: string,
  transaction: CreateTransactionPayload
): Promise<ClientWithTransactions> => {
  const token = await localforage.getItem<string>("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const response = await api.post<ClientWithTransactions>(
      `/clients/${clientId}/transactions`,
      transaction,
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

// export const getClientTransactions = async (
//   clientId: string,
//   limit?: number,
//   offset?: number
// ): Promise<TransactionItem[]> => {
//   const token = await localforage.getItem<string>("access_token");
//   if (!token) throw new Error("No access token found");

//   const params = new URLSearchParams();
//   if (limit) params.append("limit", limit.toString());
//   if (offset) params.append("offset", offset.toString());

//   try {
//     const response = await api.get(
//       `/clients/${clientId}/transactions?${params}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     console.log("Fetched transactions:", response.data);
//     return response.data;
//   } catch (error) {
//     const err = error as AxiosError;
//     console.error(
//       "Error fetching transactions:",
//       err.response?.data || err.message
//     );
//     throw error;
//   }
// };
