import React from "react";
import DashboardTitle from "@/components/dashboard/DashboardTitle";

const StaffClients: React.FC = () => {
  return (
    <main className="  bg-[#f5f5f5] p-10">
      <DashboardTitle
        heading="Clients"
        description="Search, view, and edit client transaction"
      />
    </main>
  );
};

export default StaffClients;
