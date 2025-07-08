// // delete this component before production!
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    label: "SUPER_ADMIN",
    username: import.meta.env.VITE_DEV_SUPER_ADMIN_USERNAME,
    password: import.meta.env.VITE_DEV_SUPER_ADMIN_PASSWORD,
  },
  {
    label: "MAINTAINER",
    username: import.meta.env.VITE_DEV_MAINTAINER_USERNAME,
    password: import.meta.env.VITE_DEV_MAINTAINER_PASSWORD,
  },
  {
    label: "ADMIN",
    username: import.meta.env.VITE_DEV_ADMIN_USERNAME,
    password: import.meta.env.VITE_DEV_ADMIN_PASSWORD,
  },
  {
    label: "STAFF",
    username: import.meta.env.VITE_DEV_STAFF_USERNAME,
    password: import.meta.env.VITE_DEV_STAFF_PASSWORD,
  },
];

const DevRoleSwitcher = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  if (!import.meta.env.DEV) return null;

  const handleLogin = async (
    username: string,
    password: string,
    label: string
  ) => {
    setLoadingRole(label);
    try {
      await login(username, password);
      const user = useAuthStore.getState().user;

      if (!user || !user.role) {
        console.error("No user/role returned from backend");
        return;
      }

      const role = user.role.toString().trim().toUpperCase();

      switch (role) {
        case "SUPER_ADMIN":
          navigate("/manager/dashboard/m-overview");
          break;
        case "MAINTAINER":
          navigate("/maintainer/dashboard/overview");
          break;
        case "ADMIN":
          navigate("/admin/dashboard/overview");
          break;
        case "STAFF":
          navigate("/staff/dashboard/s-overview");
          break;
        default:
          console.error("Unknown role:", role);
      }
    } catch (error) {
      console.error("Dev login failed:", error);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg p-4 rounded-xl z-50">
      <p className="mb-2 font-semibold text-gray-700">🛠 Dev Role Switcher</p>
      <div className="flex flex-col gap-2">
        {roles.map((role) => (
          <Button
            key={role.label}
            onClick={() =>
              handleLogin(role.username, role.password, role.label)
            }
            disabled={loadingRole !== null}
          >
            {loadingRole === role.label
              ? "Logging in..."
              : `Login as ${role.label}`}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DevRoleSwitcher;
