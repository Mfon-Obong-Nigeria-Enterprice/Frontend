import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  getAllClients,
  createClient,
  deleteClient,
} from "@/services/clientService";
import { type Client } from "@/types/types";

const clientsQueryKey = ["clients"] as const;

const clientsQueryOptions: UseQueryOptions<Client[], Error, Client[]> = {
  queryKey: clientsQueryKey,
  queryFn: getAllClients,
  refetchInterval: 3000, // every 3s
  staleTime: 2000, // 1s
  refetchOnWindowFocus: true,
};

export function useClients() {
  return useQuery(clientsQueryOptions);
}

export function useAddClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsQueryKey });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientsQueryKey });
    },
  });
}
