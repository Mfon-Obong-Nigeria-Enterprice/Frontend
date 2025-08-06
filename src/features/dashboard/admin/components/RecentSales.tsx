import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/MyButton";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { toSentenceCaseName } from "@/utils/styles";

// this is recent sales for the admin dashboard
const RecentSales: React.FC = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactionsStore();

  return (
    <div className="bg-white p-4 sm:px-8 sm:py-6 mx-2 rounded-lg font-Inter">
      <h4 className="font-medium text-lg sm:text-xl text-text-dark">
        Recent sales
      </h4>

      <Table className="mt-5 sm:mt-8 rounded-t-xl overflow-hidden">
        <TableHeader>
          <TableRow className="bg-[#F0F0F3]">
            <TableHead className="w-[100px] text-center text-[#444444]">
              Clients
            </TableHead>
            <TableHead className="text-center text-[#444444]">Amount</TableHead>
            <TableHead className="text-center text-[#444444]">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...(transactions || [])]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5)
            .map((txn, index) => (
              <TableRow
                key={txn._id}
                className={index % 2 !== 0 ? "bg-[#F0F0F3]" : ""}
              >
                <TableCell className="font-medium pl-4 text-xs text-[var(--cl-secondary)]">
                  {toSentenceCaseName(
                    typeof txn?.clientId === "object" && txn?.clientId?.name
                      ? txn.clientId.name
                      : txn?.walkInClient?.name || ""
                  )}
                </TableCell>
                <TableCell
                  className={`text-center text-xs  ${
                    txn.total > 0 ? "text-green-400" : "text-[#F95353]"
                  }`}
                >
                  ₦{txn.total.toLocaleString()}
                </TableCell>
                <TableCell className="text-center text-xs text-[var(--cl-secondary)]">
                  {new Date(txn.createdAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center bg-[#f0f0f3] mt-10 sm:mt-[13dvh]">
        <div>
          <Button
            onClick={() => navigate("/admin/dashboard/sales")}
            text="View all Sales"
            variant="outline"
            fullWidth={false}
          />
        </div>
        <MdKeyboardArrowRight size={24} className="text-[#3D80FF] mr-5" />
      </div>
    </div>
  );
};

export default RecentSales;
