import DashboardTitle from "./components/DashboardTitle";
import Stats from "./components/Stats";

const Clients = () => {
  return (
    // mt-[5rem] min-h-screen bg-[#f5f5f5] ml-64
    <main className="w-full p-10">
      <DashboardTitle
        heading="Client Managerment"
        description="Manage client accounts & relationships"
      />
      <Stats />
    </main>
  );
};

export default Clients;
