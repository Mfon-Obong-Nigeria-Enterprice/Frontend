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

const tableData = [
  { client: "Walk-in client", amount: "-₦12,750", time: "11:40 AM" },
  { client: "Akpan construction", amount: "+₦150,000", time: "11:25 AM" },
  { client: "Ade properties", amount: "+₦225,000", time: "9:15 AM" },
  { client: "Walk-in client", amount: "-₦7,500", time: "8:10 AM" },
];

// this is recent sales for the admin dashboard
const RecentSales: React.FC = () => {
  const navigate = useNavigate();

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
          {tableData.map((data, index) => (
            <TableRow className={index % 2 !== 0 ? "bg-[#F0F0F3]" : ""}>
              <TableCell className="font-medium pl-4 text-xs text-[var(--cl-secondary)]">
                {data.client}
              </TableCell>
              <TableCell
                className={`text-center text-xs  ${
                  data.amount.includes("+")
                    ? "text-green-400"
                    : "text-[#F95353]"
                }`}
              >
                {data.amount}
              </TableCell>
              <TableCell className="text-center text-xs text-[var(--cl-secondary)]">
                {data.time}
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
