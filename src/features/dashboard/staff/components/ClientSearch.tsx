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
import { Label } from "@/components/ui/label";

import type { Client } from "@/types/types";

import { MdOutlineLocalPhone, MdOutlineLocationOn } from "react-icons/md";

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
  console.log("Clients from store:", clients);
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
    <div className="w-full md:max-w-[311px]">
      <Label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">
       Select client
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm font-normal"
          >
            {selectedClient ? selectedClient.name : "Search or select clients..."}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full xl:w-[800px] p-0 -mt-10">
          <Command>
            <CommandInput
              placeholder="Search or select clients..."
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
                    className={`flex justify-between  items-center border-b border-[#D9D9D9] hover:bg-[#D9D9D9]`}
                  >
                    <div className="space-y-2 py-2.5 px-2">
                      <p className="font-medium font-Inter text-[#444444]">
                        {client.name}
                      </p>
                      <div className="flex items-center gap-3.5">
                        {client.phone && (
                          <p className="flex items-center gap-1">
                            <MdOutlineLocalPhone fill="#444444" />
                            <span className="text-[11px] text-[#444444] font-Inter">
                              {client.phone}
                            </span>
                          </p>
                        )}
                        {/* address */}
                        {client?.address && (
                          <p className="flex items-center gap-1">
                            <MdOutlineLocationOn fill="#333333" />
                            <span className="text-[11px] text-[#444444] font-Inter">
                              {client.address}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    {client.isActive === false && (
                      <p className="text-[11px] text-[#F95353] font-medium">
                        Suspended
                      </p>
                    )}
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
