// // delete this component before production!
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    label: "SUPER_ADMIN",
    username: import.meta.env.VITE_DEV_SUPER_ADMIN_USERNAME,
    password: import.meta.env.VITE_DEV_SUPER_ADMIN_PASSWORD,
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
      const response = await login(username, password);
      const user = response?.data?.user;

      if (!user || !user.role) {
        console.error("No user/role returned from backend");
        return;
      }

      const role = user.role.toString().trim().toUpperCase();

      switch (role) {
        case "SUPER_ADMIN":
          navigate("/manager/dashboard");
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

  const simulateAdminRoute = () => {
    console.warn("🚨 Simulating Admin route — no real login done.");
    navigate("/admin/setup");
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

        <Button
          variant="outline"
          onClick={simulateAdminRoute}
          disabled={loadingRole !== null}
        >
          🚧 Simulate Admin Route
        </Button>
      </div>
    </div>
  );
};

export default DevRoleSwitcher;
