import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";

// Auth components - keep eagerly loaded for initial page
import Login from "@/features/auth/Login";
import Notfound from "@/components/Notfound";

// Lazy load components to reduce initial bundle size
// Manager Components
const ManagerDashboardLayout = lazy(() => import("@/layout/ManagerDashboardLayout"));
const ManagerDashboardOverview = lazy(() => import("@/features/dashboard/manager/ManagerDashboardOverview"));
const BusinessReport = lazy(() => import("@/features/dashboard/manager/BusinessReport"));
const ManagerTransactions = lazy(() => import("@/features/dashboard/manager/ManagerTransactions"));
const ManagerClients = lazy(() => import("@/features/dashboard/manager/ManagerClients"));
const RevenueAnalytics = lazy(() => import("@/features/dashboard/manager/RevenueAnalytics"));
const UserManagement = lazy(() => import("@/features/dashboard/manager/UserManagement"));
const ManagerSettings = lazy(() => import("@/features/dashboard/manager/ManagerSettings"));
const ManagerNotifications = lazy(() => import("@/features/dashboard/manager/ManagerNotifications"));

// Maintainer Components
const MaintainerLayout = lazy(() => import("@/layout/MaintainerLayout"));
const MaintainerDashboard = lazy(() => import("@/features/dashboard/maintainer/MaintainerDashboard"));
const ActivityLog = lazy(() => import("@/features/dashboard/maintainer/ActivityLog"));
const MaintainerSettings = lazy(() => import("@/features/dashboard/maintainer/MaintainerSettings"));
const MaintainerNotification = lazy(() => import("@/features/dashboard/maintainer/MaintainerNotification"));
const ColumnSettings = lazy(() => import("@/features/dashboard/shared/usermanagement/columnsettings"));
const ManageUser = lazy(() => import("@/features/dashboard/maintainer/ManageUser"));

// Admin Components
const AdminDashboardLayout = lazy(() => import("@/layout/AdminDashboardLayout"));
const DashboardOverview = lazy(() => import("@/features/dashboard/admin/DashboardOverview"));
const AdminInventory = lazy(() => import("@/features/dashboard/admin/AdminInventory"));
const Clients = lazy(() => import("@/features/dashboard/admin/Clients"));
const DashboardSales = lazy(() => import("@/features/dashboard/admin/DashboardSales"));
const DashboardTransactions = lazy(() => import("@/features/dashboard/admin/DashboardTransactions"));
const DashboardSettings = lazy(() => import("@/features/dashboard/admin/DashboardSettings").then(module => ({ default: module.DashboardSettings })));
const AdminNotification = lazy(() => import("@/features/dashboard/admin/AdminNotification"));

// Staff Components
const StaffDashboardLayout = lazy(() => import("@/layout/StaffDashboardLayout"));
const StaffDashboardOverview = lazy(() => import("@/features/dashboard/staff/DashboardOverview"));
const StaffSales = lazy(() => import("@/features/dashboard/staff/StaffSales"));
const NewSales = lazy(() => import("@/features/dashboard/staff/NewSales"));
const Stock = lazy(() => import("@/features/dashboard/staff/Stock"));
const StaffClients = lazy(() => import("@/features/dashboard/staff/StaffClients"));

// Shared Components
const UserDetailsPage = lazy(() => import("@/features/dashboard/shared/usermanagement/userdetailpage"));
const AddProduct = lazy(() => import("@/features/dashboard/shared/inventory/AddProduct"));
const ClientDetailsPage = lazy(() => import("@/pages/ClientDetailsPage"));
const ImportStockPage = lazy(() => import("@/features/import/ImportStockPage"));
const UserLog = lazy(() => import("@/features/dashboard/manager/component/UserLog"));

// Loading wrapper component
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);
// import UserLog from "@/features/dashboard/shared/usermanagement/UserLog";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },

  // Manager Routes - Only for SUPER_ADMIN
  {
    path: "/manager/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
        <LazyWrapper>
          <ManagerDashboardLayout />
        </LazyWrapper>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="m-overview" replace /> },
      { path: "m-overview", element: <LazyWrapper><ManagerDashboardOverview /></LazyWrapper> },
      { path: "business-report", element: <LazyWrapper><BusinessReport /></LazyWrapper> },
      { path: "manage-clients", element: <LazyWrapper><ManagerClients /></LazyWrapper> },
      { path: "manage-transactions", element: <LazyWrapper><ManagerTransactions /></LazyWrapper> },
      { path: "revenue-analytics", element: <LazyWrapper><RevenueAnalytics /></LazyWrapper> },
      { path: "manage-user", element: <LazyWrapper><UserManagement /></LazyWrapper> },
      { path: "manager-settings", element: <LazyWrapper><ManagerSettings /></LazyWrapper> },
      { path: "manager-notifications", element: <LazyWrapper><ManagerNotifications /></LazyWrapper> },
      { path: "user-management/:id", element: <LazyWrapper><UserDetailsPage /></LazyWrapper> },
      { path: "user-management/col-settings", element: <LazyWrapper><ColumnSettings /></LazyWrapper> },
      { path: "user-log", element: <LazyWrapper><UserLog/></LazyWrapper> },
    ],
  },

  // Maintainer Routes - Only for MAINTAINER
  {
    path: "/maintainer/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["MAINTAINER"]}>
        <MaintainerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/maintainer/dashboard/overview" replace />,
      },
      { path: "overview", element: <MaintainerDashboard /> },
      { path: "maintainer-notifications", element: <MaintainerNotification /> },
      { path: "maintainer-settings", element: <MaintainerSettings /> },
      { path: "user-management", element: <ManageUser /> },
      { path: "user-management/:id", element: <UserDetailsPage /> },
      { path: "user-management/col-settings", element: <ColumnSettings /> },
      { path: "log", element: <ActivityLog /> },
      { path: "settings", element: <MaintainerSettings /> },
    ],
  },

  // Admin Routes - Only for ADMIN
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview", element: <DashboardOverview /> },
      { path: "inventory", element: <AdminInventory /> },
      { path: "clients", element: <Clients /> },
      { path: "sales", element: <DashboardSales /> },
      { path: "sale", element: <NewSales /> },
      { path: "transactions", element: <DashboardTransactions /> },
      { path: "settings", element: <DashboardSettings /> },
      { path: "admin-notifications", element: <AdminNotification /> },
    ],
  },

  // Staff Routes - Only for STAFF
  {
    path: "/staff/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["STAFF"]}>
        <StaffDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="s-overview" replace /> },
      { path: "s-stock", element: <Stock /> },
      { path: "s-clients", element: <StaffClients /> },
      { path: "s-overview", element: <StaffDashboardOverview /> },
      { path: "s-sales", element: <StaffSales /> },
      { path: "new-sales", element: <NewSales /> },
    ],
  },

  // Other Routes - Protected but no specific role required
  { 
    path: "add-prod", 
    element: (
      <ProtectedRoute>
        <AddProduct />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "clients/:clientId", 
    element: (
      <ProtectedRoute>
        <ClientDetailsPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "import-stock", 
    element: (
      <ProtectedRoute>
        <ImportStockPage />
      </ProtectedRoute>
    ) 
  },
  { path: "*", element: <Notfound /> },
]);

export default router;