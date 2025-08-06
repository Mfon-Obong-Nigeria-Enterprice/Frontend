import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useClientStore } from "@/stores/useClientStore";
import { formatCurrency } from "@/utils/formatCurrency";
import ClientTransactionModal from "../../shared/ClientTransactionModal";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { getDaysSince } from "@/utils/helpersfunction";

const OutstandingBalance = () => {
  const navigate = useNavigate();
  const { getClientById } = useClientStore();

  const { transactions, selectedTransaction, open, openModal } =
    useTransactionsStore();

  const mergedTransactions = useMemo(() => {
    return (transactions ?? []).map((transaction) => {
      const clientId =
        typeof transaction.clientId === "string"
          ? transaction.clientId
          : transaction.clientId?._id;
      const client = clientId ? getClientById(clientId) : null;

      return {
        ...transaction,
        client,
      };
    });
  }, [transactions, getClientById]);

  const debtors = mergedTransactions.filter(
    (tx) => tx.client && tx.client?.balance < 0
  );

  return (
    <div className="bg-white border border-[#D9D9D9] p-4 sm:p-8 mt-5 mx-2 rounded-[8px] font-Inter">
      <h4 className="font-medium text-lg sm:text-xl text-text-dark">
        Outstanding Balance
      </h4>

      <div className="mt-5 sm:mt-8 border border-gray-300 rounded-t-xl">
        <Table className="rounded-t-xl overflow-hidden">
          <TableHeader>
            <TableRow className="bg-[#F0F0F3] border-b border-gray-300">
              <TableHead className="w-[100px] text-center pl-4 font-medium text-[#333333] text-xs sm:text-base">
                Client
              </TableHead>
              <TableHead className="text-center font-medium text-[#333333] text-xs sm:text-base">
                Balance due
              </TableHead>
              <TableHead className="text-center font-medium text-[#333333] text-xs sm:text-base">
                Days
              </TableHead>
              <TableHead className="text-center font-medium text-[#333333] text-xs sm:text-base">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {debtors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No outstanding balances.
                </TableCell>
              </TableRow>
            ) : (
              debtors.map((entry, index) => (
                <TableRow
                  key={entry._id}
                  className={`border-b border-gray-300 ${
                    index % 2 !== 0 ? "bg-[#F0F0F3]" : ""
                  }`}
                >
                  <TableCell className="font-medium pl-4 text-[#444444] text-xs sm:text-base">
                    {entry.client?.name}
                  </TableCell>
                  <TableCell className="text-center text-[#F95353] text-xs sm:text-base">
                    {formatCurrency(Number(entry.client?.balance))}
                  </TableCell>
                  <TableCell className="text-center text-[#444444] text-xs sm:text-base">
                    {getDaysSince(entry.createdAt)}
                  </TableCell>
                  <TableCell className="text-center text-blue-400 underline cursor-pointer text-xs sm:text-base">
                    <button onClick={() => openModal(entry)}>View</button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-[#f0f0f3] items-center mt-[7dvh] flex justify-between">
        <Button
          className=" text-start"
          onClick={() => navigate("/admin/dashboard/clients")}
          variant="outline"
        >
          View all Balances
        </Button>
        <MdKeyboardArrowRight size={24} className="mr-5 text-[#3D80FF]" />
      </div>

      {open && selectedTransaction && <ClientTransactionModal />}
    </div>
  );
};

export default OutstandingBalance;
