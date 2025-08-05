import React from "react";
import DashboardTitle from "../shared/DashboardTitle";
import Clients from "../shared/Clients";

const ManagerClients = () => {
  return (
    <div>
      <DashboardTitle
        heading="Clients"
        description="Manage your client relationships and view outstanding balances"
      />
      <Clients />
    </div>
  );
};

export default ManagerClients;
