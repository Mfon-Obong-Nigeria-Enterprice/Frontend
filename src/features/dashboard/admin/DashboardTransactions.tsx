import DashboardTitle from "../shared/DashboardTitle";
import Transactions from "../shared/Transactions";

interface DashboardTransactionProps {
  isAdminView?: boolean;
}

const DashboardTransactions: React.FC<DashboardTransactionProps> = () => {

  return (
    <section>
      <div className="flex justify-between flex-wrap items-center">
        <DashboardTitle
          heading="Transaction Management"
          description="Track all sales payment & client account activities"
        />
      </div>
      <Transactions />
    </section>
  );
};

export default DashboardTransactions;
