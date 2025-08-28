import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  requiredMessage: string;
  onChange: (value: string) => void;
};

function InputWithSuggestions({
  label,
  placeholder,
  options = [],
  value,
  requiredMessage,
  onChange,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="bg-[#FFF2CE] border border-[#FFA500] rounded-md mt-10 py-2.5 px-4">
      {label && <p className="text-sm text-[#333333]">{label}</p>}

      <div className="py-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="bg-white border border-[#FFA500] rounded-md flex items-center px-3 cursor-text">
              <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full py-2 text-[#333333] outline-none"
                onFocus={() => setOpen(true)}
              />
              <ChevronDown className="h-4 w-4 opacity-50 cursor-pointer" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 bg-[#FFF2CE] border-[#FFA500]">
            <Command>
              <CommandInput
                placeholder={placeholder}
                value={value}
                onValueChange={onChange}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option, idx) => (
                    <CommandItem
                      key={idx}
                      value={option}
                      onSelect={(val) => {
                        onChange(val);
                        setOpen(false);
                      }}
                    >
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {requiredMessage && (
        <p className="text-xs text-[#F95353]">{requiredMessage}</p>
      )}
    </div>
  );
}

export default InputWithSuggestions;

// import { ChevronDown } from "lucide-react";

// type Props = {
//   label: string;
//   placeholder: string;
//   options: string[];
//   value: string;
//   requiredMessage: string;
//   onChange: (value: string) => void;
// };

// function InputWithSuggestions({
//   label,
//   placeholder,
//   options = [],
//   value,
//   requiredMessage,
//   onChange,
//   ...props
// }: Props) {
//   const listId = `${label.replace(/\s+/g, "-").toLowerCase()}-list`;

//   return (
//     <div className="bg-[#FFF2CE] border border-[#FFA500] rounded-md mt-10 py-2.5 px-4">
//       {label && <p className="text-sm text-[#333333]">{label}</p>}

//       <div className="py-4">
//         <div className="bg-white border border-[#FFA500] rounded-md flex items-center px-3 no-arrow">
//           <input
//             list={listId}
//             placeholder={placeholder}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full py-2 text-[#333333] outline-none"
//             {...props}
//           />
//           <ChevronDown />
//         </div>
//         <datalist id={listId}>
//           {options.map((option, idx) => (
//             <option key={idx} value={option} />
//           ))}
//         </datalist>
//       </div>

//       {requiredMessage && (
//         <p className="text-xs text-[#F95353]">{requiredMessage}</p>
//       )}
//     </div>
//   );
// }

// export default InputWithSuggestions;
