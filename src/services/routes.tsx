import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import AdminDashboard from "../pages/AdminDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import AdminSetup from "../pages/AdminSetup";
import AdminSetupPage02 from "../pages/AdminSetupPage02";
import AdminSetupPage03 from "../pages/AdminSetupPage03";

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
    path: "admin-setup-page-02",
    element: <AdminSetupPage02 />,
  },
  {
    path: "admin-setup-page-03",
    element: <AdminSetupPage03 />,
  },
]);

export default router;
