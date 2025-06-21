import React from "react";
import DashboardTitle from "@/components/dashboard/DashboardTitle";

const StaffDashboardOverview: React.FC = () => {
  return (
    <main className="  bg-[#f5f5f5] p-10">
      <DashboardTitle
        heading="Dashboard"
        description="Welcome, Staff User! Ready to assist customer today"
      />
    </main>
  );
};

export default StaffDashboardOverview;
