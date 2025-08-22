import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Client } from "@/types/types";
import {
  createClient,
  updateClient,
  deleteClient,
  blockClient,
  unblockClient,
} from "@/services/clientService";

export const useClientMutations = () => {
  const queryClient = useQueryClient();

  const createMutate = useMutation({
    mutationFn: createClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const updateMutate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Client }) =>
      updateClient(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const deleteMutate = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const blockMutate = useMutation({
    mutationFn: blockClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const unblockMutate = useMutation({
    mutationFn: unblockClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  return {
    createMutate,
    updateMutate,
    deleteMutate,
    blockMutate,
    unblockMutate,
  };
};
