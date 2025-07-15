import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/sidebar/AdminSidebar";
import { Suspense } from "react";
import { InventoryProvider } from "@/providers/InventoryProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
// import SkeletonCard from "@/pages/SkeletonCard";

const AdminDashboardLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <div className="w-full">
        <Header userRole="admin" />
        <SidebarTrigger className="fixed z-50" />
        <Suspense fallback={<LoadingSpinner />}>
          <div className="bg-[#f5f5f5] pt-10 md:p-10 mt-[3rem] min-h-[90dvh]">
            <InventoryProvider>
              <Outlet />
            </InventoryProvider>
          </div>
        </Suspense>
      </div>
    </SidebarProvider>
  );
};
export default AdminDashboardLayout;
