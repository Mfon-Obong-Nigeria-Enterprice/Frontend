import { cn } from "@/lib/utils";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  className?: string;
}

const CustomDatePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className,
}) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={(dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        onChange(start, end);
      }}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      dateFormat="MM/dd/yyyy"
      placeholderText="Select date range"
      className={cn("w-full px-3 py-2 border rounded-md", className)}
      isClearable
    />
  );
};

export default CustomDatePicker;