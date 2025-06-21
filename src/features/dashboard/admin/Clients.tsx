import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import Stats from "./components/Stats";

const Clients = () => {
  return (
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
