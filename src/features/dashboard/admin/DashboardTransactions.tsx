import React from "react";
import DashboardTitle from "../shared/DashboardTitle";
import Transactions from "../shared/Transactions";

const DashboardTransactions = () => {
  return (
    <section>
      <DashboardTitle
        heading="Transaction Management"
        description="Track all sales payment & client account activities"
      />
      <Transactions />
    </section>
  );
};

export default DashboardTransactions;
