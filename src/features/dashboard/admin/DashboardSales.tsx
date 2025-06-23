import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import SalesAnalytics from "./components/AdminSales/SalesAnalytics";
import SalesTableData from "./components/AdminSales/SalesTableData";

const DashboardSales = () => {
  return (
    // ml-64 mt-[5rem] min-h-screen bg-[#f5f5f5]
    <main className="w-full bg-[#f5f5f5] min-h-screen p-10 font-Inter">
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
        <SalesAnalytics />

        <SalesTableData />
      </section>
    </main>
  );
};

export default DashboardSales;
