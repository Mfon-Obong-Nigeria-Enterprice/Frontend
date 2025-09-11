import { useQuery } from "@tanstack/react-query";
import { getAllClients, getClientById } from "@/services/clientService";

// Client query keys
export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  list: (search?: string) => [...clientKeys.lists(), search] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

// Hook to get all clients
export const useClientsQuery = (search?: string) => {
  return useQuery({
    queryKey: clientKeys.list(search),
    queryFn: () => getAllClients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to get a single client
export const useClientQuery = (clientId: string) => {
  return useQuery({
    queryKey: clientKeys.detail(clientId),
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
