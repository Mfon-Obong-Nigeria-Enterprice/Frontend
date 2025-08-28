/** @format */

import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MaintainerSidebar from "@/features/sidebar/MaintainerSidebar";
import { AppProvider } from "@/providers/AppProvider";

const MaintainerLayout = () => {
  const pathname = useLocation();

  return (
    <SidebarProvider>
      <MaintainerSidebar />
      <div className="w-full">
        <Header userRole="maintainer" />
        <SidebarTrigger className="fixed z-50" />
        <div
          className={`   min-h-[90dvh] ${
            pathname.pathname.endsWith("/user")
              ? "bg-[#f5f5f5] xl:bg-white mt-[4rem] border border-[#D9D9D9]"
              : "bg-[#f5f5f5] p-10 mt-[3rem]"
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
export default MaintainerLayout;
