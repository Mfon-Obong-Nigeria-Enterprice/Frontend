import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
};

const DateRangePicker: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Select date range",
  className,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date-range"
          variant="outline"
          className={cn(
            "w-40 justify-between text-left font-normal !bg-[#d9d9d9] !border-[#7D7D7D] h-10 text-[#444444]",
            !value.from && "text-muted-foreground",
            className
          )}
        >
          {value?.from ? (
            value.to ? (
              `${format(value.from, "MMM d, yyyy")} - ${format(
                value.to,
                "MMM d, yyyy"
              )}`
            ) : (
              format(value.from, "MMM d, yyyy")
            )
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          required
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
