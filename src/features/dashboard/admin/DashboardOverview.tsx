import { Link } from "react-router-dom";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import Stats from "./components/Stats";
import SalesOverview from "./components/SalesOverview";
import OutstandingBalance from "./components/OutstandingBalance";
import RecentSales from "./components/RecentSales";
import { Button } from "@/components/ui/button";
import { VscRefresh } from "react-icons/vsc";
import { Plus } from "lucide-react";

const DashboardOverview: React.FC = () => {
  return (
    <main className="bg-[#f5f5f5] p-10">
      <div className="flex justify-between items-end mb-7">
        <DashboardTitle
          heading="Dashboard"
          description="Welcome, Admin User! Here's an overview of your business today"
        />
        <div className="flex gap-5">
          <Button
            onClick={() => window.location.reload()}
            className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out"
          >
            <VscRefresh />
            Refresh
          </Button>
          <Link to="/add-prod">
            <Button className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] transition-colors duration-200 ease-in-out [&_span]:text-5xl">
              <Plus className="w-10 h-10 text-white" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>
      <Stats />
      <div className="mt-5 grid grid-cols-[60fr_40fr] gap-5 ">
        <SalesOverview />
        <RecentSales />
      </div>
      <OutstandingBalance />
    </main>
  );
};

export default DashboardOverview;
