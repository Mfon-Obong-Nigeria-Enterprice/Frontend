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
  const [open, setOpen] = React.useState(false);
  const [tempValue, setTempValue] = React.useState(value);

  const handleApply = () => {
    onChange(tempValue);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value); // revert to original
    setOpen(false);
  };

  const handleClear = () => {
    onChange({ from: undefined, to: undefined });
    setTempValue({ from: undefined, to: undefined });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date-range"
          variant="outline"
          className={cn(
            "relative w-40 justify-between text-left font-normal  text-[#444444] overflow-hidden",
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
          <span className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer">
            {value.from ? (
              <span
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening the popover
                  handleClear();
                }}
                className="block font-extrabold h-full pl-3 pr-3 bg-[#d9d9d9]"
              >
                X
              </span>
            ) : (
              <CalendarIcon className="mx-2 h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={tempValue}
          onSelect={setTempValue}
          numberOfMonths={2}
          required
        />
        <div className="flex justify-end gap-2 mt-2 p-5">
          <Button size="sm" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
