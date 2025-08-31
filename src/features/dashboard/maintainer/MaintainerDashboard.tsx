import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import { useActivityLogsStore } from "@/stores/useActivityLogsStore";
// import Stats, {
//   type StatCard,
// } from "@/features/dashboard/maintainer/components/Stats";
// import { Button } from "@/components/ui/button";

import { SystemHealth } from "./components/SystemHealth";

const MaintainerDashboard = () => {
  const { activities } = useActivityLogsStore();

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
      <div className="grid grid-cols-1 md:grid-cols-[60fr_40fr] gap-5">
        <SystemHealth />

        {/* recent activity */}
        <div className="bg-white rounded-[10px]">
          <h5>Recent Activity</h5>

          {/* list */}
          <ul>
            {[
              ...activities
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .slice(0, 8)
                .map((a, i) => (
                  <li key={i} className="flex justify-between border-b py-1">
                    <div>
                      <p>{a.details}</p>
                      <span className="block">{a.timestamp}</span>
                    </div>

                    {/* device */}
                    <p>{a.device}</p>
                  </li>
                )),
            ]}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default MaintainerDashboard;
