import api from "./baseApi";
import { type AxiosError } from "axios";
import type { Client } from "@/types/types";

type CreateClientPayload = Pick<Client, "name" | "phone" | "email" | "address">;

export const getAllClients = async (): Promise<Client[]> => {
  try {
    const response = await api.get("/clients");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching clients:", err.response?.data || err.message);
    throw error;
  }
};

export const getClientById = async (id: string): Promise<Client> => {
  try {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching client:", err.response?.data || err.message);
    throw error;
  }
};

export const getClientDebt = async (): Promise<Client[]> => {
  try {
    const response = await api.get("/clients/debtors");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Error fetching client debt:",
      err.response?.data || err.message
    );
    throw error;
  }
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

export const blockClient = async (clientId: string): Promise<void> => {
  try {
    const response = await api.patch(`/clients/${clientId}/block`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error blocking client:", err.response?.data || err.message);
    throw error;
  }
};

export const unblockClient = async (clientId: string): Promise<void> => {
  try {
    const response = await api.patch(`/clients/${clientId}/unblock`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Error unblocking client:",
      err.response?.data || err.message
    );
    throw error;
  }
};
