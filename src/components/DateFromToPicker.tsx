//This component is a date range picker with two fields: "Date from" and "Date to". Each field opens a calendar popover for date selection.
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateFromToPickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateFromToPicker({
  date,
  onDateChange,
  className,
}: DateFromToPickerProps) {
  const handleDateSelect = (
    field: "from" | "to",
    selectedDate: Date | undefined
  ) => {
    onDateChange({ from: undefined, ...date, [field]: selectedDate });
  };

  return (
    <div className={cn("flex flex-row lg:flex gap-3 w-full", className)}>
      
      {/* DATE FROM FIELD */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs text-[#7D7D7D]">Date from</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn( // Ensure consistent height and styling
                "w-full text-left font-normal  px-3 bg-white border-gray-300 hover:bg-white hover:text-inherit shadow-none rounded-md",
                !date?.from && "text-muted-foreground"
              )}
            >
              <span className={!date?.from ? "text-[#9CA3AF]" : "text-[#333333]"}>
                {date?.from ? format(date.from, "MM/dd/yyyy") : "mm/dd/yyyy"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date?.from}
              onSelect={(d) => handleDateSelect("from", d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* DATE TO FIELD */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs text-[#7D7D7D]">Date to</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn( // Ensure consistent height and styling
                "w-full text-left font-normal  px-3 bg-white border-gray-300 hover:bg-white hover:text-inherit shadow-none rounded-md",
                !date?.to && "text-muted-foreground"
              )}
            >
              <span className={!date?.to ? "text-[#9CA3AF]" : "text-[#333333]"}>
                {date?.to ? format(date.to, "MM/dd/yyyy") : "mm/dd/yyyy"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date?.to}
              onSelect={(d) => handleDateSelect("to", d)}
              disabled={date?.from ? { before: date.from } : undefined}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}