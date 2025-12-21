import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import { SystemHealth } from "./components/SystemHealth";
import type { StatCard } from "@/types/stats";
import Stats from "../shared/Stats";
import { useUserStore } from "@/stores/useUserStore";
import { useActivityLogsStore } from "@/stores/useActivityLogsStore";
import RecentActivity from "./components/RecentActivity";

const MaintainerDashboard = () => {
  const users = useUserStore((s) => s.users);
  const {
    getTotalActivityToday,
    getFailedLoginAttempts,
    getDataModifications,
  } = useActivityLogsStore();

  // Calculate stats
  const activeUsers = users.filter(
    (user) => user.isActive && !user.isBlocked
  ).length;

  const totalActivityToday = getTotalActivityToday();
  // Safe check in case getFailedLoginAttempts is not defined in the store version you have
  const failedLoginAttempts = getFailedLoginAttempts ? getFailedLoginAttempts() : 0; 
  const dataModifications = getDataModifications();

  // Configuration matching the Figma design
  // NOTE: Ensure these files exist in your 'public/icons' folder
  const stats: StatCard[] = [
    {
      heading: "Total Activity Today",
      salesValue: totalActivityToday.toString(),
      icon: "/icons/activity-today.svg",
      color: "#2ECC71",
    },
    {
      heading: "Failed Login Attempts",
      salesValue: failedLoginAttempts.toString(),
      icon: "/icons/failed-login-attempt.svg",
      color: "#F95353",
    },
    {
      heading: "Active Users",
      salesValue: activeUsers.toString(),
      icon: "/icons/active-users.svg",
      color: "#3D80FF",
    },
    {
      heading: "Data modifications",
      salesValue: dataModifications.toString(),
      icon: "/icons/data-modifications.svg",
      color: "#FFA500",
    },
  ];

  return (
    <main>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
        <DashboardTitle
          heading="Maintainer Dashboard"
          description="System administration & User management"
        />
      </div>

      {/* Stats Grid */}
      <Stats data={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mt-2 sm:mt-3 lg:mt-4">
        <div className="h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
          <SystemHealth />
        </div>
        <div className="h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
          <RecentActivity />
        </div>
      </div>
    </main>
  );
};

export default MaintainerDashboard;