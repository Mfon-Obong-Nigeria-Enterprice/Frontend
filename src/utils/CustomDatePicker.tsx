import { cn } from "@/lib/utils";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  className,
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="MM/dd/yyyy"
      placeholderText="MM/dd/yyyy"
      className={cn(className)}
    />
  );
};

export default CustomDatePicker;
