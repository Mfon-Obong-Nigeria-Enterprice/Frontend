import React from "react";
import { Link } from "react-router-dom";
import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import { Button } from "@/components/ui/button";
import { GrRefresh } from "react-icons/gr";
import StaffStats from "./components/StaffStats";
import QuickActions from "./components/QuickActions";
import RecentSalesActivity from "./components/RecentSalesActivity";

// icons
import { MdKeyboardArrowRight } from "react-icons/md";
import RecentSalesMobile from "./components/mobile/RecentSalesMobile";

const StaffDashboardOverview: React.FC = () => {
  return (
    <main>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-7 gap-4">
        {/* Mobile/tablet */}
        <div className="md:hidden">
          <DashboardTitle
            heading="Dashboard"
            description="Welcome, Staff User!"
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <DashboardTitle
            heading="Dashboard"
            description="Welcome, Staff User! Ready to assist customer today"
          />
        </div>

        <div className="flex gap-3 md:gap-5">
<Button
  onClick={() => window.location.reload()}
  className="
    bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)]
    font-extrabold text-lg sm:text-sm px-8 sm:px-4 py-4 sm:py-2
  "
>
  <GrRefresh className="size-5" />
  Refresh
</Button>

<Link to="/staff/dashboard/new-sales">
  <Button
    className="
      font-extrabold text-lg sm:text-sm px-8 sm:px-4 py-4 sm:py-2
    "
  >
    + Add Sales
  </Button>
</Link>

</div>


      </div>

      <StaffStats />
      <QuickActions />

      {/* recent sales activity */}
      <div className="bg-white rounded-[0.625rem] md:border md:border-[#D9D9D9] py-1 font-Inter">
        <div className="flex justify-between items-center p-4 gap-4">
          <h5 className="font-medium text-[var(--cl-text-dark)] text-base md:text-lg">
            Your Recent Sales Activity
          </h5>
          <Link
            to="/staff/dashboard/s-sales"
            className="flex md:gap-1 items-center text-[#3D80FF]"
          >
            <button className="flex gap-1 text-sm cursor-pointer">
              View all <span className="hidden md:flex">Sales</span>
            </button>
            <MdKeyboardArrowRight />
          </Link>
        </div>

        {/* ===== MOBILE VIEW (cards) ===== */}
        <RecentSalesMobile />
        {/* ===== DESKTOP VIEW (table) ===== */}
        <RecentSalesActivity />
      </div>
    </main>
  );
};

export default StaffDashboardOverview;
