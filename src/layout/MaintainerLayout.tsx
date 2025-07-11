/** @format */

import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MaintainerSidebar from "@/features/sidebar/MaintainerSidebar";

const MaintainerLayout = () => {
  return (
    <SidebarProvider>
      <MaintainerSidebar />
      <div className="w-full">
        <Header userRole="maintainer" />
        <SidebarTrigger className="fixed z-50" />
        <div className="bg-[#f5f5f5] p-10 mt-[3rem] min-h-[90dvh]">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};
export default MaintainerLayout;
