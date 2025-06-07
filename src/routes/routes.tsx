import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/components/Login";
import AdminSetupLayout from "@/layout/setup/AdminSetupLayout";
import SetupOne from "@/features/setup/admin/SetupOne";
import SetupTwo from "@/features/setup/admin/SetupTwo";
import SetupThree from "@/features/setup/admin/SetupThree";
import SetupFour from "@/features/setup/admin/SetupFour";
import Review from "@/features/setup/admin/Review";
import Complete from "@/features/setup/admin/Complete";

import AdminDashboardLayout from "@/layout/dashboard/AdminDashboardLayout";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/admin/setup",
    element: <AdminSetupLayout />,
    children: [
      { index: true, element: <Navigate to="step-01" /> },
      { path: "step-01", element: <SetupOne /> },
      { path: "step-02", element: <SetupTwo /> },
      { path: "step-03", element: <SetupThree /> },
      { path: "step-04", element: <SetupFour /> },
      { path: "review", element: <Review /> },
      { path: "complete", element: <Complete /> },
    ],
  },
  // { path: "/admin/dashboard", element: <AdminDashboardLayout /> },
  {
    path: "/admin-dashboard",
    element: <AdminDashboardLayout />,
    children: [
      // { index: true, element: <DashboardOverview /> },
      // { path: "clients", element: <ClientsPage /> },
      // { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

export default router;
