import { useAuthStore } from "@/stores/useAuthStore";
import DashboardTitle from "../shared/DashboardTitle";
import Transactions from "../shared/Transactions";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import WaybillModal from "../staff/components/WaybillModal";

interface DashboardTransactionProps {
  isAdminView?: boolean;
}

const DashboardTransactions: React.FC<DashboardTransactionProps> = ({
  isAdminView = false,
}) => {
  const { user } = useAuthStore();
  const transactions = useTransactionsStore(
    (state) => state.transactions ?? []
  );
  const [isWaybillModalOpen, setIsWaybillModalOpen] = useState(false);

  // Determine if current user is a manager/super_admin
  const isAdmin = useMemo(() => {
    if (isAdminView) return true;
    if (!user || !user.role) return false;

    const normalizedRole = user.role.toString().trim().toUpperCase();
    return normalizedRole === "ADMIN";
  }, [user, isAdminView]);

  // Filter transactions by branch for admin users
  const branchTransactions = useMemo(() => {
    if (!user?.branchId) return transactions;

    // For ADMIN role, filter transactions by their branch
    if (isAdmin) {
      return transactions.filter((transaction) => {
        const txBranchId =
          typeof transaction.branchId === "string"
            ? transaction.branchId
            : (transaction.branchId as { _id?: string } | undefined)?._id;
        return txBranchId === user.branchId;
      });
    }

    // For other roles, return all transactions
    return transactions;
  }, [transactions, user?.branchId, isAdmin]);

  // Handle waybill assignment success
  const handleWaybillAssigned = (
    transactionId: string,
    waybillNumber: string
  ) => {
    console.log(
      `Waybill ${waybillNumber} assigned to transaction ${transactionId}`
    );
    // You can add additional logic here if needed, like refreshing data
  };

  return (
    <section>
      <div className="flex justify-between flex-wrap items-center">
        <DashboardTitle
          heading="Transaction Management"
          description="Track all sales payment & client account activities"
        />
        {/* {isAdmin && (
          <Button
            className="min-w-40"
            onClick={() => setIsWaybillModalOpen(true)}
          >
            <img src="/icons/brick.svg" alt="" className="w-4" />
            Add Waybill
          </Button>
        )} */}
      </div>
      <Transactions />

      {/* Waybill Modal - Shows only branch-specific transactions for admin */}
      <WaybillModal
        isOpen={isWaybillModalOpen}
        onClose={() => setIsWaybillModalOpen(false)}
        transactions={branchTransactions} // Pass filtered branch transactions
        onWaybillGenerated={handleWaybillAssigned}
      />
    </section>
  );
};

export default DashboardTransactions;
