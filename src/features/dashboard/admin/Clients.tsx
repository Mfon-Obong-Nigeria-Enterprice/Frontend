/** @format */

import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import ClientStats from "./components/ClientStats";
import { Button } from "@/components/ui/Button";
import { Plus, ChevronUp, Search } from "lucide-react";
import ClientDirectory from "./components/ClientDirectory";
import { useState } from "react";
import { AddClientDialog } from "./components/AddClientDialog";

const Clients = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <main>
      <DashboardTitle
        heading="Client Management"
        description="Manage client accounts & relationships"
      />
      <ClientStats />

      {/* client directory */}
      <section className="bg-white rounded-[0.625rem] pt-4 border border-[#D9D9D9] mt-10 mx-3 md:mx-1 ">
        <div className="flex justify-between px-7 pt-5 flex-wrap">
          <h4 className="font-medium text-xl font-Inter text-[#1E1E1E]">
            Client directory
          </h4>
          <div className="flex items-center gap-3 pt-5 sm:pt-0 justify-self-end sm:justify-self-auto">
            <Button className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out">
              Export PDF
            </Button>
            <Button className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out">
              Download Excel
            </Button>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] transition-colors duration-200 ease-in-out [&_span]:text-5xl"
            >
              <Plus className="w-10 h-10 text-white" />
              Add Client
            </Button>
          </div>
        </div>

        {/* search */}
        <div className="flex justify-between items-center px-4 py-5 mt-5 flex-wrap sm:flex-nowrap sm:px-2 md:px-8 ">
          <div className="bg-[#F5F5F5] flex items-center gap-1 px-4 rounded-md w-full sm:w-1/2">
            <Search size={18} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              placeholder="Search products, categories..."
              className="py-2 outline-0 w-full"
            />
          </div>
          <div className="flex items-center gap-4 pt-4 sm:pt-0  md:gap-3">
            <button className="bg-[#D9D9D9] flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d] text-sm">
              <span>All status</span>
              <ChevronUp />
            </button>
            <button className="bg-[#D9D9D9] flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]  text-sm">
              <span>All Balances</span>
              <ChevronUp />
            </button>
          </div>
        </div>

        <ClientDirectory searchTerm={searchTerm} />
      </section>
      <AddClientDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </main>
  );
};

export default Clients;
