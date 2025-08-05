import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Suggestion = {
  id: string;
  label: string;
};

interface SearchBarProps {
  type: "invoice" | "client"; // or extend to more
  placeholder?: string;
  fetchSuggestions: (query: string) => Promise<Suggestion[]>;
  onSelect: (item: Suggestion) => void;
}

export default function SearchBar({
  type,
  placeholder,
  fetchSuggestions,
  onSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getSuggestions = async () => {
      if (debouncedQuery.trim()) {
        const suggestions = await fetchSuggestions(debouncedQuery.trim());
        setResults(suggestions);
      } else {
        setResults([]);
      }
    };
    getSuggestions();
  }, [debouncedQuery, fetchSuggestions]);

  const handleSelect = (item: Suggestion) => {
    onSelect(item);
    setQuery(""); // clear input
    setOpen(false); // close dropdown
    setResults([]);

    // Scroll to the corresponding row
    const target = document.getElementById(`invoice-${item.label}`);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("ring-2", "ring-blue-400", "rounded-md");

      // Optional: remove the highlight after a few seconds
      setTimeout(() => {
        target.classList.remove("ring-2", "ring-blue-400", "rounded-md");
      }, 2000);
    }
  };

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search
              size={18}
              className="absolute top-0 translate-y-1/2 translate-x-1/2 text-gray-400"
            />
            <Input
              placeholder={placeholder || `Search by ${type}`}
              value={query}
              // onChange={(e) => setQuery(e.target.value)}
              onClick={() => setOpen(true)}
              className="w-full pl-8 !bg-white"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-90 md:w-[35rem] h-60 p-0 overflow-y-auto"
          align="start"
          sideOffset={-35}
        >
          <Command>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={`Search ${type}...`}
            />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {results.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => handleSelect(item)}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

{
  /* <Search
              size={18}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            /> */
}

//         <PopoverContent
//           side="top" // ⬆️ ensures it overlaps on top
//           align="start"
//           className="w-full p-0 absolute left-0 top-0 z-50 border-none shadow-none bg-transparent"
//           avoidCollisions={false}
//         >
//           <Command className="w-full">
//             <div className="relative">
//               <Search
//                 size={18}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//               <CommandInput
//                 value={query}
//                 onValueChange={setQuery}
//                 placeholder={`Search ${type}...`}
//                 className="pl-8 w-full"
//               />
//             </div>
//             <CommandEmpty>No results found.</CommandEmpty>
//             <CommandGroup>
//               {results.map((item) => (
//                 <CommandItem
//                   key={item.id}
//                   value={item.label}
//                   onSelect={() => handleSelect(item)}
//                 >
//                   {item.label}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
