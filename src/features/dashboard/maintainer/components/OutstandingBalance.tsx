/** @format */

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
const tableData = [
  {
    client: "XYZ builders",
    balanceDue: "₦54,350",
  },
  {
    client: "Metro developers",
    balanceDue: "₦120,800",
  },
  {
    client: "City build Ltd",
    balanceDue: "₦97,400",
  },
];

// action will be a url to the clients dashboard or page

const OutstandingBalance = () => {
  return (
    <div className="bg-white border border-[#D9D9D9] p-1 sm:p-8 mt-5 mx-2 rounded-[8px] font-Inter">
      <Table className="rounded-t-xl overflow-hidden">
        <h4 className="font-medium text-lg sm:text-lg text-text-dark pb-4 pl-1">
          Outstanding Balance
        </h4>
        <TableBody>
          {tableData.map((data, index) => (
            <TableRow className={`border-b `}>
              <TableCell className="font-medium text-left text-[#444444] text-xs sm:text-base">
                {data.client}
              </TableCell>
              <TableCell className="text-right  text-[#F95353] text-xs sm:text-base">
                {data.balanceDue}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OutstandingBalance;
