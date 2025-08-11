/** @format */

import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ManagerSidebar from "@/features/sidebar/ManagerSidebar";
import { AppProvider } from "@/providers/AppProvider";

const ManagerDashboardLayout = () => {
  return (
    <SidebarProvider>
      <ManagerSidebar />

      <div className="w-full">
        <Header userRole="manager" />
        <SidebarTrigger className="fixed z-50" />
        <div className="bg-[#f5f5f5] py-5 px-2 md:p-10 mt-[3rem] min-h-[90dvh] border-2">
          <AppProvider>
            <Outlet />
          </AppProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManagerDashboardLayout;
