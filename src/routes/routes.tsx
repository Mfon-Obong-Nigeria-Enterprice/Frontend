import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/components/login/Login";
import AdminSetupLayout from "@/layout/setup/AdminSetupLayout";
import SetupOne from "@/features/setup/admin/SetupOne";
import SetupTwo from "@/features/setup/admin/SetupTwo";
import SetupThree from "@/features/setup/admin/SetupThree";
import SetupFour from "@/features/setup/admin/SetupFour";
import Review from "@/features/setup/admin/Review";
import Complete from "@/features/setup/admin/Complete";

import AddProduct from "@/components/AddProduct";
import Notfound from "@/components/Notfound";

// manager (super admin)
import ManagerDashboardLayout from "@/layout/ManagerDashboardLayout";
import ManagerDashboardOverview from "@/features/dashboard/manager/ManagerDashboardOverview";
import BusinessReport from "@/features/dashboard/manager/BusinessReport";
import ManagerClients from "@/features/dashboard/manager/ManagerClients";
import RevenueAnalytics from "@/features/dashboard/manager/RevenueAnalytics";
import UserManagement from "@/features/dashboard/manager/UserManagement";
import ManagerSettings from "@/features/dashboard/manager/ManagerSettings";

// admin
import AdminDashboardLayout from "@/layout/AdminDashboardLayout";
import DashboardOverview from "@/features/dashboard/admin/DashboardOverview";
import AdminInventory from "@/features/dashboard/admin/AdminInventory";
import Clients from "@/features/dashboard/admin/Clients";
import DashboardSales from "@/features/dashboard/admin/DashboardSales";
import DashboardTransactions from "@/features/dashboard/admin/DashboardTransactions";
import DashboardSettings from "@/features/dashboard/admin/DashboardSettings";

// staff
import StaffDashboardLayout from "@/layout/StaffDashboardLayout";
import StaffDashboardOverview from "@/features/dashboard/staff/DashboardOverview";
import StaffSales from "@/features/dashboard/staff/Staffsales";
import NewSales from "@/features/dashboard/staff/Newsales";
import Stock from "@/features/dashboard/staff/Stock";
import StaffClients from "@/features/dashboard/staff/StaffClients";
import ClientDetailsPage from "@/pages/ClientDetailsPage";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/manager/dashboard",
    element: <ManagerDashboardLayout />,
    children: [
      { index: true, element: <Navigate to="m-overview" replace /> },
      { path: "m-overview", element: <ManagerDashboardOverview /> },
      {
        path: "business-report",
        element: <BusinessReport />,
      },
      { path: "manage-clients", element: <ManagerClients /> },
      {
        path: "manage-transactions",
        element: <ManagerClients />,
      },
      {
        path: "revenue-analytics",
        element: <RevenueAnalytics />,
      },
      {
        path: "manage-user",
        element: <UserManagement />,
      },
      {
        path: "manager-settings",
        element: <ManagerSettings />,
      },
    ],
  },
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
  {
    path: "add-prod",
    element: <AddProduct />,
  },
  {
    path: "client-details",
    element: <ClientDetailsPage />,
  },
  {
    path: "*",
    element: <Notfound />,
  },
]);

export default router;
