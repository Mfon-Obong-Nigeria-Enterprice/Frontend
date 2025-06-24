import React from "react";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { Button } from "@/components/ui/button";
import InventoryTab from "../admin/components/InventoryTab";
import { IoIosSearch } from "react-icons/io";

const Stock: React.FC = () => {
  return (
    <main className=" bg-[#f5f5f5] p-10">
      <div className="flex justify-between items-end">
        <DashboardTitle
          heading="Stock levels"
          description="View current inventory and availability "
        />
        <Button className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out">
          Refresh
        </Button>
      </div>

      <section className="bg-white rounded-xl mt-5 overflow-hidden">
        {/* search */}
        <div className="flex justify-between items-center px-4 py-5 border">
          <div className="bg-[#F5F5F5] flex items-center gap-1 w-1/2 px-4 rounded-md">
            <IoIosSearch size={18} />
            <input
              type="search"
              placeholder="Search products, categories..."
              className="py-2 outline-0 w-full"
            />
          </div>
        </div>

        {/* tabbed section */}
        <div className="my-5 px-4">
          <InventoryTab />
        </div>
      </section>
    </main>
  );
};

export default Stock;
