import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" className="text-[#444444] text-xs">
            <span>dd/mm/yyyy</span>
            <CalendarIcon className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            // selected={value}
            // onSelect={onChange}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
