import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ManagerSidebar from "@/features/sidebar/ManagerSidebar";

const ManagerDashboardLayout = () => {
  return (
    <SidebarProvider>
      <ManagerSidebar />

      <div className="w-full">
        <Header userRole="manager" />
        <SidebarTrigger className="fixed z-50" />
        <div className="bg-[#f5f5f5] p-10 mt-[3rem] min-h-[90dvh]">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ManagerDashboardLayout;
