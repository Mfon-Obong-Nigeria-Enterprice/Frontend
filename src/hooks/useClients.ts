import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";
import { useClientStore } from "@/stores/useClientStore";

export const useClients = () => {
  const setClients = useClientStore((state) => state.setClients);
};
