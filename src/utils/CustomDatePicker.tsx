import { cn } from "@/lib/utils";
import React, { useCallback, useRef } from "react";
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
  const lastCallRef = useRef<number>(0);
  
  const handleDateChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    
    // Throttle the onChange calls
    const now = Date.now();
    if (now - lastCallRef.current < 100) {
      return;
    }
    lastCallRef.current = now;
    
    onChange(start, end);
  }, [onChange]);

  return (
    <DatePicker
      selected={startDate}
      onChange={handleDateChange}
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