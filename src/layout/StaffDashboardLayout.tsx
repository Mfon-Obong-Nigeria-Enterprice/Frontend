import React from "react";
import { useLocation } from "react-router-dom";
import Header from "@/features/dashboard/shared/header/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StaffSidebarWithModal } from "@/features/sidebar/StaffSidebar";
import { AppProvider } from "@/providers/AppProvider";

const StaffDashboardLayout: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <StaffSidebarWithModal />
      <div className="w-full">
        <Header userRole="staff" />
        <SidebarTrigger className="fixed z-50" />
        <div
          className={`bg-[#f5f5f5] mt-[3rem] p-4 min-h-[90dvh] ${
            pathname === "/staff/dashboard/new-sales" ? "md:p-0" : " md:p-10"
          }`}
        >
          <AppProvider>
            <Outlet />
          </AppProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StaffDashboardLayout;
