/** @format */

import React from "react";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import { Button } from "@/components/ui/Button";
import StaffStats from "./components/StaffStats";
import QuickActions from "./components/QuickActions";
import RecentSalesActivity from "./components/RecentSalesActivity";

const StaffDashboardOverview: React.FC = () => {
  return (
    <main>
      <div className="flex justify-between items-end mb-7">
        <DashboardTitle
          heading="Dashboard"
          description="Welcome, Staff User! Ready to assist customer today"
        />

        <div className="flex gap-5">
          <Button className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out">
            Refresh
          </Button>
          <Button className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] transition-colors duration-200 ease-in-out">
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
