import localforage from "localforage";
import api from "./baseApi";
import { type AxiosError } from "axios";
import type { Client } from "@/types/types";

type CreateClientPayload = Pick<Client, "name" | "phone" | "email" | "address">;

export const getAllClients = async (): Promise<Client[]> => {
  try {
    const token = await localforage.getItem<string>("access_token");
    if (!token) {
      throw new Error("No access token found");
    }
    //
    const response = await api.get("/clients", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Clients fetched:", response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching clients:", err.response?.data || err.message);
    throw error;
  }
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
    console.log("Client created:", response.data);
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
    console.log("Client deleted:", id);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error deleting client:", err.response?.data || err.message);
    throw error;
  }
};
