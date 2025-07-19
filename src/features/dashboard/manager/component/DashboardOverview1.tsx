import DashboardTitle from "@/components/dashboard/DashboardTitle";
import Stats1 from "./Stats1";
import { type StatCard} from "./Stats1"


const DashboardOverview1 : React.FC =() => {
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
  return <div className="">
      <main className="flex flex-col gap-4 mb-7">
        <DashboardTitle
          heading="Manager Dashboard"
          description="welcome back! Here’s an overview of your business"
        />
        <Stats1 data={stats} />
      
      </main>
    </div>;
};


export default DashboardOverview1;
