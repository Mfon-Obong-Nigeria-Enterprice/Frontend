import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  useClientStore,
  // useSyncClientsWithQuery,
} from "@/stores/useClientStore";
import { ChevronDown } from "lucide-react";

import type { Client } from "@/types/types";

interface ClientSearchProps {
  selectedClient: Client | null;
  onClientSelect?: (client: Client) => void;
}

const ClientSearch = ({
  selectedClient,
  onClientSelect,
}: ClientSearchProps) => {
  // useSyncClientsWithQuery(); // Loads all clients initially

  const { clients } = useClientStore();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  // const hasFetchedInitially = useRef(false);

  // When dropdown first opens, preload all clients if not already loaded
  // useEffect(() => {
  //   if (open && !hasFetchedInitially.current && clients.length === 0) {
  //     fetchAllClients().then((data) => {
  //       setClients(data);
  //       hasFetchedInitially.current = true;
  //     });
  //   }
  // }, [open, clients.length, setClients]);
  // const { data: fetchedClients = [] } = useQuery({
  //   queryKey: ["clients"],
  //   queryFn: getAllClients,
  //   enabled: clients.length === 0, // only fetch if store is empty
  //   onSuccess: setClients, // update store after fetch
  // });

  // Use either store data or fetched data
  // const clientList = clients;
  // Debounced search API calls
  // useEffect(() => {
  //   if (!searchText) return; // skip if empty — will show all clients
  //   const delay = setTimeout(() => {
  //     fetchAllClients(searchText).then((data: Client[]) => setClients(data)); // backend handles filtering
  //   }, 400);
  //   return () => clearTimeout(delay);
  // }, [searchText, setClients]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedClient ? selectedClient.name : "Select client..."}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full xl:w-[800px] p-0 -mt-10">
          <Command>
            <CommandInput
              placeholder="Search clients..."
              value={searchText}
              onValueChange={setSearchText}
            />
            <CommandList>
              <CommandEmpty>No clients found.</CommandEmpty>
              <CommandGroup>
                {clients.map((client) => (
                  <CommandItem
                    key={client._id}
                    onSelect={() => {
                      setOpen(false);
                      onClientSelect?.(client);
                    }}
                  >
                    {client.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default ClientSearch;
