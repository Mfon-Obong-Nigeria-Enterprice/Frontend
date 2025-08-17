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
    // extract search from queryKey
    const search = queryKey[1]; // second element of queryKey
    const response = await api.get("/clients", {
      params: search ? { search } : {},
      signal,
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
  try {
    const response = await api.post("/clients", client);

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
  try {
    const response = await api.patch(`/clients/${id}`, updatedData);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error updating client:", err.response?.data || err.message);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/clients/${id}`);

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error deleting client:", err.response?.data || err.message);
    throw error;
  }
};
