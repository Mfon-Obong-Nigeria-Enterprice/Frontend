import Header from "@/features/dashboard/shared/header/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebarWithModal } from "@/features/sidebar/AdminSidebar";
import { AppProvider } from "@/providers/AppProvider";
import { Toaster } from "sonner";

const AdminDashboardLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebarWithModal />

      <div className="w-full">
        <Header userRole="admin" />
        <SidebarTrigger className="fixed z-50" />

        <div className="bg-[#f5f5f5] p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 mt-[3rem] min-h-[90dvh] overflow-x-hidden">
          <AppProvider>
            <Outlet />
          </AppProvider>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};
export default AdminDashboardLayout;
