import type { Transaction } from "@/types/transactions";

const MySalesActivity = ({
  filteredTransactions,
}: {
  filteredTransactions: Transaction[];
}) => {
  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F5F5] h-[65px]">
            <td className="text-[#333333] font-Inter font-medium text-base text-center">
              Clients
            </td>
            <td className="text-[#333333] font-Inter font-medium text-base text-center">
              Products
            </td>
            <td className="text-[#333333] font-Inter font-medium text-base text-center">
              Amount
            </td>
            <td className="text-[#333333] font-Inter font-medium text-base text-center">
              Time
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions && filteredTransactions?.length > 0 ? (
            filteredTransactions?.map((transaction, i) => (
              <tr key={transaction._id + i}>
                <td>{transaction.clientName}</td>
                <td>ii</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-[#333] text-center py-5">
                No transactions
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MySalesActivity;
