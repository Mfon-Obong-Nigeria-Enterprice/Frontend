import { Link } from "react-router-dom";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import Stats from "./components/Stats";
import SalesOverview from "./components/SalesOverview";
import OutstandingBalance from "./components/OutstandingBalance";
import RecentSales from "./components/RecentSales";
import { Button } from "@/components/ui/Button";
import { VscRefresh } from "react-icons/vsc";
import { Plus } from "lucide-react";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useClientStore } from "@/stores/useClientStore";
import { type StatCard } from "@/types/stats";

const DashboardOverview: React.FC = () => {
  const products = useInventoryStore((state) => state.products);
  const { getActiveClients, getActiveClientsPercentage } = useClientStore();
  const lowStockCount = products.filter(
    (prod) => prod.stock <= prod.minStockLevel
  ).length;

  const activeClients = getActiveClients();
  const activeClientsPercentage = getActiveClientsPercentage();

  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: 1250000,
      format: "currency",
      statValue: "12% from yesterday",
      statColor: "green",
    },
    {
      heading: "Outstanding balances",
      salesValue: 400000,
      format: "currency",
      statValue: "5% from last week",
      statColor: "orange",
    },
    {
      heading: "Low Stock Items",
      salesValue: `${lowStockCount} Products`,
      statValue: "Needs attention",
      // format: "text",
      statColor: "red",
      hideArrow: true,
    },
    {
      heading: "Active Clients",
      salesValue: `${activeClients}`,
      statValue: `${activeClientsPercentage}% new clients this week`,
      statColor: "green",
      // format: "text",
    },
  ];

  return (
    <main>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
        <DashboardTitle
          heading="Dashboard"
          description="Welcome, Admin User! Here's an overview of your business today"
        />
        <div className="flex gap-5 mx-5">
          <Button
            onClick={() => window.location.reload()}
            className="w-40 bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out"
          >
            <VscRefresh />
            Refresh
          </Button>
          <Link to="/add-prod">
            <Button className="w-40 bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] transition-colors duration-200 ease-in-out [&_span]:text-5xl">
              <Plus className="w-10 h-10 text-white" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>
      <Stats data={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-5 mt-5">
        <SalesOverview />
        <RecentSales />
      </div>
      <OutstandingBalance />
    </main>
  );
};

export default DashboardOverview;
