import Header from "@/components/dashboard/Header";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

// export default function Layout({ children }: { children: React.ReactNode }) {
export default function AdminDashboardLayout() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Admin dashboard error:", error, info);
      }}
    >
      <Header />
      <SidebarProvider className="mt-[2rem]">
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          <Outlet />
          {/* {children} */}
        </main>
      </SidebarProvider>
    </ErrorBoundary>
  );
}

//
// import Sidebar from "./Sidebar";

// // import { error } from "console";

// const AdminDashboardLayout = () => {
//   return (
// <ErrorBoundary
//   FallbackComponent={ErrorFallback}
//   onError={(error, info) => {
//     console.error("Admin dashboard error:", error, info);
//   }}
// >
//       <Header />
//       <div className="flex gap-5">
//         <Sidebar />
//         <Outlet />
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default AdminDashboardLayout;
