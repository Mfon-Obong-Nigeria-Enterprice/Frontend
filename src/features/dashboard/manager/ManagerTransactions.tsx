import DashboardTitle from "../shared/DashboardTitle";
import Transactions from "../shared/Transactions";

const ManagerTransactions = () => {
  return (
    <section>
      <DashboardTitle
        heading="Transaction"
        description="Oversee All Payments, Credits & Alerts"
      />
      <Transactions />
    </section>
  );
};

export default ManagerTransactions;
