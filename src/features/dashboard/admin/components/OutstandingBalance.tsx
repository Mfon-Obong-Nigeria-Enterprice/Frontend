import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import ClientDetailModal from "@/components/dashboard/ClientDetailModal";

const tableData = [
  {
    client: "Okoro builders",
    balanceDue: "450,000",
    days: "30",
    action: "view",
  },
  {
    client: "Lagos interiors",
    balanceDue: "380,000",
    days: "15",
    action: "view",
  },
  {
    client: "Supreme contractors",
    balanceDue: "275,000",
    days: "7",
    action: "view",
  },
];

// action will be a url to the clients dashboard or page

const OutstandingBalance = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="bg-white border border-[#D9D9D9] p-4 sm:p-8 mt-5 mx-2 rounded-[8px] font-Inter">
      <h4 className="font-medium text-lg sm:text-xl text-text-dark">
        Outstanding Balance
      </h4>
      <div className="mt-5 sm:mt-8 border border-gray-300 rounded-t-xl">
        <Table className="rounded-t-xl overflow-hidden">
          <TableHeader>
            <TableRow className="bg-[#F0F0F3] border-b border-gray-300  ">
              <TableHead className="w-[100px] text-left pl-4 font-medium text-[#333333] text-xs sm:text-base">
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
            {tableData.map((data, index) => (
              <TableRow
                className={`border-b border-gray-300 ${
                  index % 2 !== 0 ? "bg-[#F0F0F3]" : ""
                }`}
              >
                <TableCell className="font-medium pl-4 text-[#444444] text-xs sm:text-base">
                  {data.client}
                </TableCell>
                <TableCell className="text-center  text-[#F95353] text-xs sm:text-base">
                  {data.balanceDue}
                </TableCell>
                <TableCell className="text-center text-[#444444] text-xs sm:text-base">
                  {data.days}
                </TableCell>
                <TableCell
                  className=" text-center text-blue-400 underline cursor-pointer text-xs sm:text-base"
                  onClick={() => setOpenModal(true)}
                >
                  {data.action}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center bg-[#f0f0f3] mt-[7dvh]">
        <div>
          <Button
            onClick={() => navigate("/admin/dashboard/clients")}
            text="View all Balances"
            variant="outline"
          />
        </div>
        <MdKeyboardArrowRight size={24} className="mr-5 text-[#3D80FF]" />
      </div>

      {/* client account modal */}
      {openModal && <ClientDetailModal setOpenModal={setOpenModal} />}
    </div>
  );
};

export default OutstandingBalance;
