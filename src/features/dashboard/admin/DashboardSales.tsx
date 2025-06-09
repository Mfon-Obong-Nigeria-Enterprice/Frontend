import DashboardTitle from "./components/DashboardTitle";

const DashboardSales = () => {
  return (
    // ml-64 mt-[5rem] min-h-screen bg-[#f5f5f5]
    <main className="w-full  p-10">
      <DashboardTitle
        heading="Sales Managerment"
        description="Process orders & manage customer purchases"
      />
    </main>
  );
};

export default DashboardSales;
