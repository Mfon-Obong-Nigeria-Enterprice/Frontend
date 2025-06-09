import DashboardTitle from "./components/DashboardTitle";
import Stats from "./components/Stats";
import SalesOverview from "./components/SalesOverview";
import RecentSales from "./components/RecentSales";
import OutstandingBalance from "./components/OutstandingBalance";

const DashboardOverview: React.FC = () => {
  return (
    <main className="  bg-[#f5f5f5] p-10">
      <DashboardTitle
        heading="Dashboard"
        description="Welcome, Admin User! Here's an overview of your business today"
      />
      <Stats />
      <div className="mt-5 grid grid-cols-[60fr_40fr] gap-5 ">
        <SalesOverview />
        <RecentSales />
      </div>
      <OutstandingBalance />
    </main>
  );
};

export default DashboardOverview;
