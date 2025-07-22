import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const DatePicker = ({ value, onChange }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="text-[#444444] text-xs w-[150px] justify-between"
        >
          {value ? format(value, "dd/MM/yyyy") : "dd/mm/yyyy"}
          <CalendarIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;

// import { CalendarIcon } from "lucide-react";
// import { Calendar } from "./ui/calendar";
// import { Button } from "./ui/Button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// const DatePicker = () => {
//   return (
//     <div>
//       <Popover>
//         <PopoverTrigger>
//           <Button variant="outline" className="text-[#444444] text-xs">
//             <span>dd/mm/yyyy</span>
//             <CalendarIcon className="ml-auto h-4 w-4" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent>
//           <Calendar
//             mode="single"
//             // selected={value}
//             // onSelect={onChange}
//             disabled={(date) =>
//               date > new Date() || date < new Date("1900-01-01")
//             }
//             captionLayout="dropdown"
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

// export default DatePicker;
