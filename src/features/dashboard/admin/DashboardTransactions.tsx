import DashboardTitle from "./components/DashboardTitle";

const DashboardTransactions = () => {
  return (
    // ml-64 mt-[5rem] min-h-screen bg-[#f5f5f5]
    <div className="w-full  p-10">
      <DashboardTitle
        heading="Transaction Managerment"
        description="Track all sales payment & client account activities"
      />
    </div>
  );
};

export default DashboardTransactions;
