import DashboardTitle from "./components/DashboardTitle";

const DashboardSettings = () => {
  return (
    // ml-64 mt-[5rem] min-h-screen bg-[#f5f5f5]
    <div className="w-full  p-10">
      <DashboardTitle
        heading="Admin Settings"
        description="Manage your basic system preferences"
      />
    </div>
  );
};

export default DashboardSettings;
