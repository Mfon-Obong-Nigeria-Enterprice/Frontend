import {
  Table,
  TableBody,
  // TableCaption,
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

const RecentSales: React.FC = () => {
  return (
    <div className="bg-white px-8 py-6 rounded-lg font-Inter">
      <h4 className="font-medium text-xl text-text-dark">Recent sales</h4>

      <Table className="mt-8 rounded-t-xl overflow-hidden">
        <TableHeader>
          <TableRow className="bg-[#F0F0F3]">
            <TableHead className="w-[100px] text-center">Clients</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((data, index) => (
            <TableRow className={index % 2 !== 0 ? "bg-[#F0F0F3]" : ""}>
              <TableCell className="font-medium pl-4">{data.client}</TableCell>
              <TableCell
                className={`text-center  ${
                  data.amount.includes("+")
                    ? "text-green-400"
                    : "text-[#F95353]"
                }`}
              >
                {data.amount}
              </TableCell>
              <TableCell className="text-center">{data.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center bg-[#f0f0f3] mt-[10dvh]">
        <div>
          <Button text="View all Sales" variant="outline" />
        </div>
        <MdKeyboardArrowRight size={24} className="mr-5" />
      </div>

      {/* <table className="">
        <td>
          <thead>
            <tr className="">
              <th className="">Clients</th>
              <th className="">Amounts</th>
              <th className="">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Walk-in client</td>
              <td>-₦12,750</td>
              <td>11:40 AM</td>
            </tr>
            <tr>
              <td>Akpan construction</td>
              <td>+₦150,000</td>
              <td>11:25 AM</td>
            </tr>
            <tr>
              <td>Ade properties</td>
              <td>+₦225,000</td>
              <td>9:15 AM</td>
            </tr>
            <tr>
              <td>Walk-in client</td>
              <td>-₦7,500</td>
              <td>8:10 AM</td>
            </tr>
          </tbody>
        </td>
      </table> */}
    </div>
  );
};

export default RecentSales;
