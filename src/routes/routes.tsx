import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/features/auth/Login";
import Notfound from "@/components/Notfound";
import UserDetailsPage from "@/pages/UserDetailsPage";
import AddProduct from "@/components/inventory/AddProduct";
import ClientDetailsPage from "@/pages/ClientDetailsPage";
import ImportStockPage from "@/features/import/ImportStockPage";
import RootInterceptorLayout from "@/layout/RootInterceptorLayout";
import ErrorFallback from "@/components/ErrorFallback";

// manager (super admin)
import ManagerDashboardLayout from "@/layout/ManagerDashboardLayout";
import ManagerDashboardOverview from "@/features/dashboard/manager/ManagerDashboardOverview";
import BusinessReport from "@/features/dashboard/manager/BusinessReport";
import ManagerTransactions from "@/features/dashboard/manager/ManagerTransactions";
import ManagerClients from "@/features/dashboard/manager/ManagerClients";
import RevenueAnalytics from "@/features/dashboard/manager/RevenueAnalytics";
import UserManagement from "@/features/dashboard/manager/UserManagement";
import ManagerSettings from "@/features/dashboard/manager/ManagerSettings";
import ActivityLogPage from "@/pages/ActivityLogPage";

// maintainer
import MaintainerLayout from "@/layout/MaintainerLayout";
import MaintainerDashboard from "@/features/dashboard/maintainer/MaintainerDashboard";

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
import StaffSales from "@/features/dashboard/staff/StaffSales";
import NewSales from "@/features/dashboard/staff/NewSales";
import Stock from "@/features/dashboard/staff/Stock";
import StaffClients from "@/features/dashboard/staff/StaffClients";

const router = createBrowserRouter([
  {
    element: <RootInterceptorLayout />,
    errorElement: <ErrorFallback />,
    children: [
      { path: "/", element: <Login /> },

      {
        path: "/manager/dashboard",
        element: <ManagerDashboardLayout />,
        children: [
          { index: true, element: <Navigate to="m-overview" replace /> },
          { path: "m-overview", element: <ManagerDashboardOverview /> },
          { path: "business-report", element: <BusinessReport /> },
          { path: "manage-clients", element: <ManagerClients /> },
          { path: "manage-transactions", element: <ManagerTransactions /> },
          { path: "activity-log", element: <ActivityLogPage /> },
          { path: "revenue-analytics", element: <RevenueAnalytics /> },
          { path: "manage-user", element: <UserManagement /> },
          { path: "manager-settings", element: <ManagerSettings /> },
        ],
      },
      {
        path: "/maintainer/dashboard",
        element: <MaintainerLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/maintainer/dashboard/overview" replace />,
          },
          { path: "overview", element: <MaintainerDashboard /> },
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
        path: "clients/:clientId",
        element: <ClientDetailsPage />,
      },
      { path: "import-stock", element: <ImportStockPage /> },
      { path: "user-management/:userId", element: <UserDetailsPage /> },
      {
        path: "*",
        element: <Notfound />,
      },
    ],
  },
]);

export default router;
