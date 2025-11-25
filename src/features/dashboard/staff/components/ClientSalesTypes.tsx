import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type SalesType = "Retail" | "Wholesale";

interface ClientSalesTypesProps {
  salesType: SalesType;
  onSalesTypeChange: (value: SalesType) => void;
}

const ClientSalesTypes: React.FC<ClientSalesTypesProps> = ({
  salesType,
  onSalesTypeChange,
}) => {
  return (
    <div className="w-full md:max-w-[311px]">
      <Label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">
        Sales Type
      </Label>
      <Select value={salesType} onValueChange={onSalesTypeChange}>
        <SelectTrigger className="w-full md:w-[311px]">
          <SelectValue placeholder="Select Sales Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Retail">Retail</SelectItem>
          <SelectItem value="Wholesale">Wholesale</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSalesTypes;