import DashboardTitle from "@/components/dashboard/DashboardTitle";
import Stats1 from "./Stats1";
import { type StatCard} from "./Stats1"


const Clients : React.FC =() => {
  const stats: StatCard[] = [
    {
      heading: "Total Clients",
      salesValue: "42",
      statValue: "3% more than last month",
      color: "green",
    },
    {
      heading: "Active Clients",
      salesValue: "19",
      statValue: "76% of total",
      color: "blue",
    },
    {
      heading: "Outstanding balances",
      salesValue: "₦ 1,355,800",
      statValue: "5% Clients with overdue balances",
      color: "orange",
    },
  ];
  return <div className="">
      <main className="flex flex-col gap-4 mb-7">
        <DashboardTitle
          heading="Clients"
          description="Manage your client relationships and view outstanding balances"
        />
        <Stats1 data={stats} />
      
      </main>
    </div>;
};


export default Clients;
