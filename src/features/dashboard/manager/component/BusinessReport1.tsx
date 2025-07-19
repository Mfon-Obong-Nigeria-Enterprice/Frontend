import DashboardTitle from "@/components/dashboard/DashboardTitle";
import Stats1 from "./Stats1";
import { type StatCard} from "./Stats1"


const BusinessReport1 : React.FC =() => {
  const stats: StatCard[] = [
    {
      heading: "Total Sales (This week)",
      salesValue: "8",
      statValue: "3% more than last week",
      color: "blue",
    },
    {
      heading: "Total Sales (This month)",
      salesValue: "₦ 2,235,600",
      statValue: "12% more than last month",
      color: "green",
    },
    {
      heading: "Total Transaction logged",
      salesValue: "42",
      statValue: "5% more than last month",
      color: "orange",
    },
  ];
  return <div className="">
      <main className="flex flex-col gap-4 mb-7">
        <DashboardTitle
          heading="Business Report"
          description="Here’s is a breakdown of your business performance"
        />
        <Stats1 data={stats} />
      
      </main>
    </div>;
};


export default BusinessReport1;
