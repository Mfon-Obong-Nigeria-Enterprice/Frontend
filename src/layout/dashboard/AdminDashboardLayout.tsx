import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header";

const AdminDashboardLayout = () => {
  return (
    <div>
      <Header />
      <div>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
