import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import SalesAnalytics from "./components/AdminSales/SalesAnalytics";
import SalesTableData from "./components/AdminSales/SalesTableData";

const todaysMetrics = {
  totalSales: 475200,
  transactionCount: 28,
  activeClients: 42,
  averageTransaction: 16971,
};

const topProducts = [
  {
    prodName: "cement",
    soldUnit: 320,
    revenue: 960000,
    category: "construction",
  },
  {
    prodName: "Rod",
    soldUnit: 190,
    revenue: 285000,
    category: "Reinforcement",
  },
  {
    prodName: "Tiles",
    soldUnit: 100,
    revenue: 280000,
    category: "Finishing",
  },
];
const DashboardSales = () => {
  return (
    <main>
      <DashboardTitle
        heading="Sales Management"
        description="Process orders & manage customer purchases"
      />
      <section>
        <div className="flex gap-[24px] items-end justify-end">
          <button className="bg-white flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
            <span>Download Excel</span>
          </button>
          <button className="bg-[#2ECC71] text-[#ffff] flex gap-1 items-center rounded-md py-2 px-[24px] border border-[#2ECC71]">
            <span>Export PDF</span>
          </button>
        </div>
        <SalesAnalytics metrics={todaysMetrics} topProduct={topProducts} />

        <SalesTableData />
      </section>
    </main>
  );
};

export default DashboardSales;
