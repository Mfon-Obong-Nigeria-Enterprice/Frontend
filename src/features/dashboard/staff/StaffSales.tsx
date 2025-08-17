import DashboardTitle from "../shared/DashboardTitle";
import MySalesActivity from "./components/MySalesActivity";
// ui
import { Button } from "@/components/ui/button";
import { VscRefresh } from "react-icons/vsc";

const StaffSales = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between gap-3">
        <DashboardTitle
          heading="My Sales"
          description="View your sales activity"
        />

        {/* buttons */}
        <div className="flex gap-5">
          <Button
            variant="tertiary"
            onClick={() => window.location.reload()}
            className="min-w-40 border-[#7d7d7d]"
          >
            <VscRefresh />
            Refresh
          </Button>
          <Button className="min-w-40">
            <img src="/icons/brick.svg" alt="" className="w-4" />
            Add Waybill
          </Button>
        </div>
      </div>

      {/* sales activity */}
      <section className="bg-white border rounded-[10px] mx-4 mt-5">
        <div className="flex justify-between items-center h-[72px] border px-10 py-6">
          <h4 className="font-medium text-lg text-[#1E1E1E] font-Inter">
            Your Sales Activity
          </h4>
          <div className="flex gap-3 items-center">
            <p className="text-[#3D80FF] font-Inter text-sm rounded-[2px] px-5 py-3 bg-[#D8E5FE]">
              Today
            </p>
            <p>This Week</p>
            <p>This Month</p>
          </div>
        </div>
        <MySalesActivity />
      </section>
    </div>
  );
};

export default StaffSales;
