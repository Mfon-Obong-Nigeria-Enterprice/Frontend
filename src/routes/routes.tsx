import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/components/login/Login";
import AdminSetupLayout from "@/layout/setup/AdminSetupLayout";
import SetupOne from "@/features/setup/admin/SetupOne";
import SetupTwo from "@/features/setup/admin/SetupTwo";
import SetupThree from "@/features/setup/admin/SetupThree";
import SetupFour from "@/features/setup/admin/SetupFour";
import Review from "@/features/setup/admin/Review";
import Complete from "@/features/setup/admin/Complete";

// manager (super admin)
import ManagerDashboardLayout from "@/layout/dashboard/ManagerDashboardLayout";

// admin
import AdminDashboardLayout from "@/layout/dashboard/AdminDashboardLayout";
import DashboardOverview from "@/features/dashboard/admin/DashboardOverview";
import AdminInventory from "@/features/dashboard/admin/AdminInventory";
import Clients from "@/features/dashboard/admin/Clients";
import DashboardSales from "@/features/dashboard/admin/DashboardSales";
import DashboardTransactions from "@/features/dashboard/admin/DashboardTransactions";
import DashboardSettings from "@/features/dashboard/admin/DashboardSettings";

// staff
import StaffDashboardLayout from "@/layout/dashboard/StaffDashboardLayout";
import StaffDashboardOverview from "@/features/dashboard/staff/DashboardOverview";
import StaffSales from "@/features/dashboard/staff/Staffsales";
import NewSales from "@/features/dashboard/staff/Newsales";
import Stock from "@/features/dashboard/staff/Stock";
import StaffClients from "@/features/dashboard/staff/StaffClients";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/manager/dashboard", element: <ManagerDashboardLayout /> },
  {
    path: "/admin/setup",
    element: <AdminSetupLayout />,
    children: [
      { index: true, element: <Navigate to="step-01" replace /> },
      { path: "step-01", element: <SetupOne /> },
      { path: "step-02", element: <SetupTwo /> },
      { path: "step-03", element: <SetupThree /> },
      { path: "step-04", element: <SetupFour /> },
      { path: "review", element: <Review /> },
      { path: "complete", element: <Complete /> },
    ],
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: "overview", element: <DashboardOverview /> },
      { path: "inventory", element: <AdminInventory /> },
      { path: "clients", element: <Clients /> },
      { path: "sales", element: <DashboardSales /> },
      { path: "transactions", element: <DashboardTransactions /> },
      { path: "settings", element: <DashboardSettings /> },
    ],
  },
  {
    path: "/staff/dashboard",
    element: <StaffDashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/s-overview" replace /> },

      { path: "s-stock", element: <Stock /> },
      {
        path: "s-clients",
        element: <StaffClients />,
      },
      { path: "s-overview", element: <StaffDashboardOverview /> },
      { path: "s-sales", element: <StaffSales /> },
      { path: "new-sales", element: <NewSales /> },
    ],
  },
]);

export default router;
