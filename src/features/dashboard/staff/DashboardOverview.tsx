import React from "react";
// import { Link } from "react-router-dom";
import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import { Button } from "@/components/ui/button";
import StaffStats from "./components/StaffStats";
import QuickActions from "./components/QuickActions";
import RecentSalesActivity from "./components/RecentSalesActivity";

const StaffDashboardOverview: React.FC = () => {
  return (
    <main>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-7 gap-4">
        {/* Mobile/tablet */}
        <div className="md:hidden">
          <DashboardTitle
            heading="Dashboard"
            description="Welcome, Staff User!"
            // If DashboardTitle doesn't accept className, remove padding inside its file.
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
          <Button className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)]">
            Refresh
          </Button>
          <Button className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)]">
            + Add Sales
          </Button>
        </div>
      </div>

      <StaffStats />
      <QuickActions />
      <RecentSalesActivity />
    </main>
  );
};

export default StaffDashboardOverview;
