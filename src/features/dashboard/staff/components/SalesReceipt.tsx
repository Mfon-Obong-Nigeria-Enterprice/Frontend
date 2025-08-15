import React from "react";
import type { Row } from "../NewSales";
import type { Client } from "@/types/types";
import type { Transaction } from "@/types/transactions";
import { Button } from "@/components/ui/button";

// interface SalesReceiptProps {
//   data: {
//     client?: Client | null;
//     walkInClient?: { name: string; phone: string } | null;
//     items: Row[];
//     totals: { subtotal: number; discountTotal: number; total: number };
//     paymentMethod: string;
//     bankName?: string;
//     amountPaid: number;
//     date: Date;
//     invoiceNumber: string;
//   };
//   onClose: () => void;
// }
interface SalesReceiptProps {
  transaction: Transaction;
}

const SalesReceipt: React.FC<SalesReceiptProps> = ({ transaction }) => {
  return (
    <div>
      <div className="bg-[#F4E8E7] py-4  rounded-md">
        {/* logo */}
        <div className="flex justify-center gap-2.5 items-end">
          <img src="/logo.png" alt="" className="w-20" />
          <p className="font-extrabold text-gray-600 text-base">
            MFON-OBONG ENTERPRISE
            <span className="font-normal text-xs block text-center">
              Uyo, Akwa Ibom
            </span>
          </p>
        </div>
        {/* heading */}
        <div className="bg-[#8C1C1380] w-fit mx-auto mt-5 p-2 rounded">
          <p className="text-sm text-gray-100 ">SALES INVOICE</p>
        </div>
      </div>

      {/* details */}
      <div className="flex justify-between items-center">
        <div className="my-7 mx-7 space-y-1.5">
          {/* name and address */}
          <div className="flex gap-0.5">
            <p className="text-xs text-gray-600 font-bold">Name:</p>
            <p className="text-[0.625rem] ml-5 min-w-30">
              {/* {data.client?.name || data.walkInClient?.name} */}
              {transaction.clientName || transaction.walkInClientName}
            </p>
          </div>
          {/* address */}
          <div className="flex gap-0.5">
            <p className="text-sm text-gray-600 font-bold">Address:</p>
            <p className=" ml-1 min-w-30"></p>
          </div>
          {/* number */}
          <div className="flex gap-0.5">
            <p className="text-sm text-gray-600 font-bold">Phone number:</p>
            <p className=" ml-1 border-b border-gray-400 min-w-30">
              {/* {data.client?.phone || data.walkInClient?.phone} */}
              {transaction.clientId?.phone || transaction.walkInClient?.phone}
            </p>
          </div>
        </div>

        <div className="my-7 mx-7 space-y-4">
          {/* inv and date */}
          <div className="flex gap-0.5">
            <p className="text-sm text-gray-600 font-bold">Date:</p>
            <p className=" ml-5 min-w-30">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* address */}
          <div className="flex gap-0.5">
            <p className="text-sm text-gray-600 font-bold">Invoice Number:</p>
            <p className=" ml-1 border-b border-gray-400 min-w-30">
              {transaction.invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      {/* main description */}
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-3 border-r text-sm">QTY</th>
            <th className="px-1.5 text-center text-sm border-r">DESCRIPTION</th>
            <th className="px-1.5 text-center text-sm border-r">UNIT PRICE</th>
            <th className="px-1.5 text-center text-sm border-r">DISCOUNT</th>
            <th className="px-1.5 text-center text-sm">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="px-2 py-3 text-center text-xs border-r">
                {row.quantity}
              </td>
              <td className="px-1.5 text-center text-xs border-r">
                {row.productName}
              </td>
              <td className="px-1.5 text-center text-xs border-r">
                {row.unitPrice}
              </td>
              <td className="px-1.5 text-center text-xs border-r">
                {row.discount}
              </td>
              <td className="px-1.5 text-center text-xs ">{row.subtotal}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              colSpan={4}
              className="py-3 px-1.5 text-center text-sm border-r"
            >
              Amount Paid
            </td>
            <td className="px-1.5 text-center text-sm font-bold">
              {transaction.amountPaid}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="my-10 bg-[#f5f5f5] mx-5 p-5">
        {/* Balance Due: */}
        <p className="text-sm text-gray-600 font-bold">
          Balance Due: <span className="ml-1.5 font-normal">"NIL"</span>
        </p>
        {/* payment method */}
        <p className="text-sm text-gray-600 font-bold">
          Payment Method:
          <span className="ml-1.5 font-normal">
            {transaction.paymentMethod}
          </span>
        </p>
        {/* if the user pays with bank */}
        {/* {transaction.bankName && (
          <p className="text-sm text-gray-600 font-bold">
            Name of Bank:
            <span className="ml-1.5 font-normal">{transaction.bankName}</span>
          </p>
        )} */}
      </div>

      {/* buttons to save */}
      <div className="flex items-center gap-10 mx-5 mb-10">
        <Button onClick={() => window.print()}>Print receipt</Button>
        <Button variant="secondary">Download PDF</Button>
      </div>
    </div>
  );
};

export default SalesReceipt;
