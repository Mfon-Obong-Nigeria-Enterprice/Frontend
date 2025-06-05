import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
// import AdminDashboard from "../pages/adminDashboard/AdminDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import AdminSetup from "../pages/adminSetup/AdminSetup";
import AdminSetupPage02 from "../pages/adminSetup/AdminSetupPage02";
import AdminSetupPage03 from "../pages/adminSetup/AdminSetupPage03";
import AdminSetupPage04 from "../pages/adminSetup/AdminSetupPage04";
import AdminSetupReview from "../pages/adminSetup/AdminSetupReview";
import AdminSetupComplete from "../pages/adminSetup/AdminSetupComplete";

import AdminDashboard from "../pages/adminDashboard/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/manager-dashboard",
    element: <ManagerDashboard />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/staff-dashboard",
    element: <StaffDashboard />,
  },
  {
    path: "/admin-setup",
    element: <AdminSetup />,
  },
  {
    path: "admin-setup-02",
    element: <AdminSetupPage02 />,
  },
  {
    path: "admin-setup-03",
    element: <AdminSetupPage03 />,
  },
  {
    path: "admin-setup-04",
    element: <AdminSetupPage04 />,
  },
  {
    path: "admin-setup-review",
    element: <AdminSetupReview />,
  },
  {
    path: "admin-setup-complete",
    element: <AdminSetupComplete />,
  },
]);

export default router;
