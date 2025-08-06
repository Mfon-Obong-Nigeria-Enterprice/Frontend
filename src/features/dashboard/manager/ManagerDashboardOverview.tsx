import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
import RecentTransactions from "./component/RecentTransaction";
import OutstandingBalance from "../shared/OutstandingBalance";

// types
import type { StatCard } from "@/types/stats";

const ManagerDashboardOverview = () => {
  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: "₦ 135,500",
      statValue: "15% from yesterday",
      color: "green",
    },
    {
      heading: "Monthly Revenue",
      salesValue: "₦ 446,850",
      statValue: "8% from last month",
      color: "green",
    },
    {
      heading: "Outstanding balances",
      salesValue: "₦ 1,355,800",
      statValue: "5% Clients with overdue balances",
      color: "orange",
    },
  ];
  return (
    <main>
      <DashboardTitle
        heading="Manager Dashboard"
        description="welcome back! Here’s an overview of your business"
      />
      <Stats data={stats} />
      <RecentTransactions />
      <OutstandingBalance />
    </main>
  );
};

export default ManagerDashboardOverview;
