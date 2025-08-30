import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ManagerSidebar from "@/features/sidebar/ManagerSidebar";
import { AppProvider } from "@/providers/AppProvider";
import { useLocation } from "react-router-dom";

const ManagerDashboardLayout = () => {
  const pathname = useLocation();

  return (
    <SidebarProvider>
      <ManagerSidebar />

      <div className="w-full">
        <Header userRole="manager" />
        <SidebarTrigger className="fixed z-50" />
        <div
          className={`min-h-[90dvh] border-2  ${
            pathname.pathname.endsWith("/manage-user")
              ? "bg-[#f5f5f5] xl:bg-white mt-[3.95rem] border border-[#D9D9D9]"
              : "bg-[#f5f5f5] py-5 px-2 md:p-10 mt-[3rem]"
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

export default ManagerDashboardLayout;
