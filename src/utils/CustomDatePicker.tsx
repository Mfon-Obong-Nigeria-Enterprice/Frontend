import { cn } from "@/lib/utils";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  disabled?: boolean;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  disabled,
  className,
}) => {
  return (
    <div className=" sm:w-[250px] md:w-[190px] transition-all w-full">
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="MM/dd/yyyy"
        placeholderText="MM/dd/yyyy"
        disabled={disabled}
        className={cn(
          " sm:w-[250px] md:w-[190px] transition-all w-full",
          disabled && "bg-gray-100 cursor-not-allowed",
          className
        )}
      />
    </div>
  );
};

export default CustomDatePicker;
