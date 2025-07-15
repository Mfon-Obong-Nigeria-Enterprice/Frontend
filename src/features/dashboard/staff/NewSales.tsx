import React from "react";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NewSales: React.FC = () => {
  return (
    <main>
      <section className="bg-white p-3 rounded-[0.625rem] shadow">
        <h4>Create New sales</h4>
        <div className="p-5 rounded-[8px] border border-[#D9D9D9] mt-3">
          <h6>Select Client</h6>

          {/* search clients */}
          <div className="mt-2 flex gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search clients"
                className="p-5"
              />
            </div>
            <Button className="bg-[#3D80FF] text-white p-5">Walk in</Button>
          </div>

          {/* add product */}
          <div className="mt-7">
            <h6>Add Products</h6>
          </div>
        </div>

        {/* payment method */}
        <div className="p-5 my-7 border border-[#D9D9D9] rounded-[8px]">
          <h5 className="text-[var(--cl-text-dark)] text-xl font-medium mb-4">
            Payment Details
          </h5>

          <div className="flex gap-6">
            <div className="">
              <Label className="text-[#333333] text-sm font-medium mb-2">
                Payment Method
              </Label>
              <Select>
                <SelectTrigger className="w-[180px] bg-[#D9D9D9] border border-[#D9D9D9]">
                  <SelectValue placeholder="Select Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="pos">P.O.S</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#333333] text-sm font-medium mb-2">
                Amount Paid
              </Label>
              <Input type="text" placeholder="0.00" className="w-40" />
            </div>
          </div>
          <p className="mt-3 text-sm">
            Status: <span className="text-[#7D7D7D]">No balance due</span>
          </p>
        </div>
        {/* buttons */}
        <div className="flex gap-3 items-center">
          <Button className="bg-white border border-[#7D7D7D] text-[#444444]">
            Cancel
          </Button>
          <Button className="bg-[#2ECC71] text-white hover:bg-[var(--cl-bg-green-hover)]">
            Complete Sales
          </Button>
        </div>
      </section>
    </main>
  );
};

export default NewSales;
