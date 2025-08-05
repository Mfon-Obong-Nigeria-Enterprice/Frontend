import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/sidebar/AdminSidebar";
// import { Suspense } from "react";
import { AppProvider } from "@/providers/AppProvider";
// import LoadingSpinner from "@/components/LoadingSpinner";

const AdminDashboardLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <div className="w-full">
        <Header userRole="admin" />
        <SidebarTrigger className="fixed z-50" />
        {/* <Suspense
          fallback={
            <div>
              <LoadingSpinner />
            </div>
          } */}
        {/* > */}
        <div className="bg-[#f5f5f5] pt-10 md:p-10 mt-[3rem] min-h-[90dvh]">
          <AppProvider>
            <Outlet />
          </AppProvider>
        </div>
        {/* </Suspense> */}
      </div>
    </SidebarProvider>
  );
};
export default AdminDashboardLayout;
