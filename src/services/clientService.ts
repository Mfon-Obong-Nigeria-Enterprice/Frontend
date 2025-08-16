import localforage from "localforage";
import api from "./baseApi";
import { type AxiosError } from "axios";

// type
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { Client } from "@/types/types";

type CreateClientPayload = Pick<Client, "name" | "phone" | "email" | "address">;

export const getAllClients = async ({
  queryKey,
  signal,
}: QueryFunctionContext<[string, string?]>): Promise<Client[]> => {
  try {
    const token = await localforage.getItem<string>("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    // extract search from queryKey
    const search = queryKey[1]; // second element of queryKey
    const response = await api.get("/clients", {
      params: search ? { search } : {},
      signal,
      //  {
      // headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching clients:", err.response?.data || err.message);
    throw error;
  }
};

export const getClientById = async (id: string): Promise<Client> => {
  const response = await api(`/clients/${id}`);
  return response.data;
};

export const createClient = async (
  client: CreateClientPayload
): Promise<Client> => {
  const token = await localforage.getItem<string>("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const response = await api.post("/clients", client, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error creating client:", err.response?.data || err.message);
    throw error;
  }
};

export const updateClient = async (
  id: string,
  updatedData: Partial<Client>
): Promise<Client> => {
  const token = await localforage.getItem<string>("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const response = await api.patch(`/clients/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error updating client:", err.response?.data || err.message);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  const token = await localforage.getItem<string>("access_token");
  if (!token) throw new Error("No access token found");

  try {
    const response = await api.delete(`/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error deleting client:", err.response?.data || err.message);
    throw error;
  }
};
