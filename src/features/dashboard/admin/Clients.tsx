import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import ClientStats from "./components/ClientStats";
import { Button } from "@/components/ui/button";
import { Plus, ChevronUp, Search } from "lucide-react";
import ClientDirectory from "./components/ClientDirectory";

const Clients = () => {
  return (
    <main className="bg-[#f5f5f5] p-10">
      <DashboardTitle
        heading="Client Management"
        description="Manage client accounts & relationships"
      />
      <ClientStats />

      {/* client directory */}
      <section className="bg-white rounded-[0.625rem] pt-4 border border-[#D9D9D9] mt-10 ">
        <div className="flex justify-between px-7 pt-5">
          <h4>Client directory</h4>
          <div className="flex items-center gap-7">
            <Button className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out">
              Export PDF
            </Button>
            <Button className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out">
              Download Excel
            </Button>
            <Button className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] transition-colors duration-200 ease-in-out [&_span]:text-5xl">
              <Plus className="w-10 h-10 text-white" />
              Add Client
            </Button>
          </div>
        </div>

        {/* search */}
        <div className="flex justify-between items-center px-4 py-5 mt-5">
          <div className="bg-[#F5F5F5] flex items-center gap-1 w-1/2 px-4 rounded-md">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search products, categories..."
              className="py-2 outline-0 w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#D9D9D9] flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
              <span>All status</span>
              <ChevronUp />
            </button>
            <button className="bg-[#D9D9D9] flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
              <span>All Balances</span>
              <ChevronUp />
            </button>
          </div>
        </div>

        <ClientDirectory />
      </section>
    </main>
  );
};

export default Clients;
