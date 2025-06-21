import React from "react";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StaffSidebar } from "@/features/sidebar/StaffSidebar";

const StaffDashboardLayout: React.FC = () => {
  return (
    <div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          console.error("Admin dashboard error:", error, info);
        }}
      >
        <Header />
        <SidebarProvider className="mt-[2rem]">
          <StaffSidebar />
          <main className="w-full">
            <SidebarTrigger />
            <Outlet />
          </main>
        </SidebarProvider>
      </ErrorBoundary>
    </div>
  );
};

export default StaffDashboardLayout;
