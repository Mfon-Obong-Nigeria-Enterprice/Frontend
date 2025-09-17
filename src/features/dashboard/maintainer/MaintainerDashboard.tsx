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

  const activeUsers = users.filter(
    (user) => user.isActive && !user.isBlocked
  ).length;
  const totalActivityToday = getTotalActivityToday();
  const failedLoginAttempts = getFailedLoginAttempts();
  const dataModifications = getDataModifications();

  const stats: StatCard[] = [
    {
      salesValue: totalActivityToday.toString(),
      heading: "Total Activity Today",
      icon: "/icons/total 1.svg",
    },
    {
      salesValue: failedLoginAttempts.toString(),
      heading: "Failed Login Attempts",
      icon: "/icons/failed 1.svg",
    },
    {
      salesValue: activeUsers.toString(),
      heading: "Active Users",
      icon: "/icons/active 1.svg",
    },
    {
      salesValue: dataModifications.toString(),
      heading: "Data Modifications",
      icon: "/icons/data 1.svg",
    },
  ];

  return (
    <main>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
        <DashboardTitle
          heading="Maintainer's Dashboard"
          description="Welcome back, Maintainer! Here's an overview of your business"
        />
      </div>
      <Stats data={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
  <div className="h-full">
    <SystemHealth />
  </div>
  <div className="h-full p-4">
    <RecentActivity />
  </div>
</div>

    </main>
  );
};

export default MaintainerDashboard;