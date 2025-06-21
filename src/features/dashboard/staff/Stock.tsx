import React from "react";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
const Stock: React.FC = () => {
  return (
    <main className="  bg-[#f5f5f5] p-10">
      <DashboardTitle
        heading="Stock levels"
        description="View current inventory and availability "
      />
    </main>
  );
};

export default Stock;
