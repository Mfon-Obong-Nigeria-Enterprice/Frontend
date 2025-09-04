import React from "react";
import Header from "@/features/dashboard/shared/header/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StaffSidebar } from "@/features/sidebar/StaffSidebar";
import { AppProvider } from "@/providers/AppProvider";

const StaffDashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <div className="w-full">
        <Header userRole="staff" />
        <SidebarTrigger className="fixed z-50" />
        <div className="bg-[#f5f5f5] p-4 md:p-10 mt-[3rem] min-h-[90dvh]">
          <AppProvider>
            <Outlet />
          </AppProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StaffDashboardLayout;
