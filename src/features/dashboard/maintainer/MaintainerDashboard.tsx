/** @format */

import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
// import Stats, {
//   type StatCard,
// } from "@/features/dashboard/maintainer/components/Stats";
// import { Button } from "@/components/ui/button";

import { SystemHealth } from "./components/SystemHealth";

const MaintainerDashboard = () => {
  // const stats: StatCard[] = [
  //   {
  //     heading: "Total Activity (Today)",
  //     salesValue: "₦ 135,500",
  //     statValue: "15% from yesterday",
  //     color: "green",
  //   },
  //   {
  //     heading: "Monthly Revenue",
  //     salesValue: "₦ 446,850",
  //     statValue: "8% from last month",
  //     color: "green",
  //   },
  //   {
  //     heading: "Outstanding balances",
  //     salesValue: "₦ 1,355,800",
  //     statValue: "5 Clients with overdue balances",
  //     color: "orange",
  //   },
  // ];

  return (
    <main>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
        <DashboardTitle
          heading="Maintainer's Dashboard"
          description="Welcome back, Maintainer! Here's an overview of your business"
        />
      </div>
      {/* <Stats data={stats} /> */}
      <SystemHealth />
    </main>
  );
};

export default MaintainerDashboard;
