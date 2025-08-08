import { useNavigate } from "react-router-dom";
import DashboardTitle from "../shared/DashboardTitle";
import Stats from "../shared/Stats";
import RecentTransactions from "./component/desktop/RecentTransaction";
import RecentTransactionsMobile from "./component/mobile/RecentTransactionsMobile";
import OutstandingBalance from "../shared/OutstandingBalance";

//icons
import { ChevronRight } from "lucide-react";

// types
import type { StatCard } from "@/types/stats";

// ui
import { Button } from "@/components/ui/button";

const ManagerDashboardOverview = () => {
  const navigate = useNavigate();

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
      <div className="py-14">
        <div className="xl:bg-white xl:rounded-lg xl:border xl:border-gray-200 xl:shadow-sm px-2 py-6 md:p-6">
          <h2 className="bg-white p-4 rounded-md text-xl font-semibold text-gray-800 mb-6">
            Recent Transaction
          </h2>
          <RecentTransactionsMobile />
          <RecentTransactions />
          <div className="bg-white w-full flex items-center justify-between px-4 my-5 xl:py-2 border shadow xl:shadow-none">
            <Button
              onClick={() => navigate("/manager/dashboard/manage-transactions")}
              variant="link"
              className="text-blue-600 hover:text-blue-800 font-medium mt-4 flex justify-between w-full"
            >
              View All Transactions
              <ChevronRight size={10} className="text-gray-500 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <OutstandingBalance />
    </main>
  );
};

export default ManagerDashboardOverview;
