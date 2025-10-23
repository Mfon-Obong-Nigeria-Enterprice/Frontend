/** @format */

import Modal from "@/components/Modal";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { balanceClassT } from "@/utils/styles";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalkinTransactionModal = () => {
  const { open, selectedTransaction, closeModal } = useTransactionsStore();

  // Export PDF function
  const handleExportPDF = () => {
    if (!selectedTransaction) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Walk-in Transaction Details", 14, 16);

    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
      14,
      26
    );

    // Client Information
    doc.setFontSize(12);
    doc.text("Client Information", 14, 40);

    const clientData = [
      ["Client Type", "Walk-in client"],
      ["Client Name", selectedTransaction.walkInClientName || "N/A"],
      ["Phone", selectedTransaction.walkInClient?.phone || "Not provided"],
      ["Registration", "Unregistered"],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Field", "Value"]],
      body: clientData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [44, 204, 113] },
    });

    // Transaction Information
    doc.setFontSize(12);
    doc.text("Transaction Information", 14, 90);

    const transactionData = [
      ["Invoice Number", selectedTransaction.invoiceNumber || "N/A"],
      ["Date & Time", new Date(selectedTransaction.createdAt).toLocaleString()],
      ["Transaction Type", selectedTransaction.type || "N/A"],
      ["Amount", formatCurrency(selectedTransaction.total)],
      ["Processed by", selectedTransaction.userId?.name || "N/A"],
    ];

    autoTable(doc, {
      startY: 100,
      head: [["Field", "Value"]],
      body: transactionData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [44, 204, 113] },
    });

    // Items Table
    doc.setFontSize(12);
    doc.text("Items/Services", 14, 150);

    const itemsData = selectedTransaction.items.map((item) => [
      item.productName,
      item.quantity,
      formatCurrency(item.unitPrice),
      "₦0.00", // Discount
      formatCurrency(item.subtotal),
    ]);

    autoTable(doc, {
      startY: 160,
      head: [["Description", "Quantity", "Unit Price", "Discount", "Total"]],
      body: itemsData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [44, 204, 113] },
    });

    // Summary
    const summaryY = 200;
    doc.setFontSize(10);
    doc.text(
      `Total Discount: ${
        selectedTransaction?.discount
          ? formatCurrency(selectedTransaction.discount)
          : "₦0.00"
      }`,
      14,
      summaryY
    );
    doc.text(
      `Total Amount: ${formatCurrency(selectedTransaction.total)}`,
      14,
      summaryY + 10
    );

    doc.save(`walkin_transaction_${selectedTransaction.invoiceNumber}.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  // Export Excel function
  const handleExportExcel = () => {
    if (!selectedTransaction) return;

    const data = {
      "Invoice Number": selectedTransaction.invoiceNumber || "N/A",
      Date: new Date(selectedTransaction.createdAt).toLocaleDateString(),
      Time: new Date(selectedTransaction.createdAt).toLocaleTimeString(),
      "Client Type": "Walk-in client",
      "Client Name": selectedTransaction.walkInClientName || "N/A",
      Phone: selectedTransaction.walkInClient?.phone || "Not provided",
      "Registration Status": "Unregistered",
      "Transaction Type": selectedTransaction.type || "N/A",
      Amount: selectedTransaction.total,
      "Processed By": selectedTransaction.userId?.name || "N/A",
      "Total Discount": selectedTransaction?.discount || 0,
      "Items Count": selectedTransaction.items?.length || 0,
    };

    // Add items details
    const itemsData = selectedTransaction.items.map((item, index) => ({
      [`Item ${index + 1} - Product`]: item.productName,
      [`Item ${index + 1} - Quantity`]: item.quantity,
      [`Item ${index + 1} - Unit Price`]: item.unitPrice,
      [`Item ${index + 1} - Subtotal`]: item.subtotal,
    }));

    // Merge main data with items data
    const finalData = { ...data, ...Object.assign({}, ...itemsData) };

    const worksheet = XLSX.utils.json_to_sheet([finalData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Walk-in Transaction");
    XLSX.writeFile(
      workbook,
      `walkin_transaction_${selectedTransaction.invoiceNumber}.xlsx`
    );
    toast.success("Excel file downloaded successfully!");
  };

  return (
    <Modal isOpen={open} onClose={closeModal} size="xxl">
      <h4 className="text-lg text-text-dark font-medium py-3 px-6 mb-2 border-b border-[#d9d9d9]">
        Walk-in Client
      </h4>
      {/* subtitle */}
      {selectedTransaction && selectedTransaction.walkInClient && (
        <section>
          <div className="flex justify-between items-center px-6 py-2 border-b border-[#d9d9d9]">
            <div>
              <p className="font-medium text-[#444444]">
                Transaction Details - {selectedTransaction.invoiceNumber}
              </p>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"tertiary"}>
                    <ChevronUp />
                    Export Data
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={handleExportPDF}
                    className="cursor-pointer hover:bg-[#f5f5f5] focus:bg-[#f5f5f5] p-3 rounded-md"
                  >
                    <span className="text-[#333333] font-Inter font-medium">
                      Export PDF
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleExportExcel}
                    className="cursor-pointer hover:bg-[#f5f5f5] focus:bg-[#f5f5f5] p-3 rounded-md"
                  >
                    <span className="text-[#333333] font-Inter font-medium">
                      Download Excel
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* client info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-4 px-4">
            <article className="py-2 border border-[#D9D9D9] rounded-[0.625rem]">
              <p className="text-[#444444] text-sm font-medium p-2 border-b border-[#d9d9d9]">
                Client Information
              </p>
              <p className="flex justify-between items-center text-xs border-b border-[#d9d9d9] py-1 px-3">
                <span className="text-[#7D7D7D] font-medium">Client Type:</span>
                <span className="text-[#444444] font-light">
                  Walk-in client
                </span>
              </p>

              {/* name */}
              <p className="flex justify-between items-center text-xs text-[#7D7D7D]  border-b border-[#d9d9d9] py-1 px-3">
                <span className="font-medium">Client Name:</span>
                <span className=" font-light">
                  {selectedTransaction.walkInClientName}
                </span>
              </p>
              {/* phone number */}
              <p className="flex justify-between items-center text-xs border-b border-[#d9d9d9] py-1 px-3">
                <span className="text-[#7D7D7D] font-medium">
                  Client Phone:
                </span>
                <span className="text-[#7d7d7d] italic font-light">
                  {selectedTransaction.walkInClient.phone || "Not provided"}
                </span>
              </p>

              {/* resgister status */}
              <p className="flex justify-between items-center text-xs border-b border-[#d9d9d9] py-1 px-3">
                <span className="text-[#7D7D7D] font-medium">
                  Registration:
                </span>
                <span className="bg-[#F39C12] text-white font-light py-1 px-2 rounded-[0.625rem]">
                  Unregistered
                </span>
              </p>
            </article>

            {/* Transaction info */}
            <article className="py-2 border border-[#D9D9D9] rounded-[0.625rem]">
              <p className="text-[#444444] text-sm font-medium p-2 border-b border-[#d9d9d9]">
                Transaction Information
              </p>
              <p className="flex justify-between items-center text-xs text-[#7D7D7D]  border-b border-[#d9d9d9] py-1 px-3">
                <span className="font-medium">Invoice Number:</span>
                <span className=" font-light text-[#444444]">
                  {selectedTransaction.invoiceNumber}
                </span>
              </p>
              <p className="flex justify-between items-center text-xs text-[#7D7D7D]  border-b border-[#d9d9d9] py-1 px-3">
                <span className="font-medium">Date & Time:</span>
                <p className=" font-light text-[#444444]">
                  <span>
                    {new Date(
                      selectedTransaction.createdAt
                    ).toLocaleDateString()}
                  </span>
                  <span className="text-[9px] ml-1.5">
                    {new Date(selectedTransaction.createdAt).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </span>
                </p>
              </p>
              {/* type */}
              <p className="flex justify-between items-center text-xs text-[#7D7D7D]  border-b border-[#d9d9d9] py-1 px-3">
                <span className="font-medium">Transaction Type:</span>
                <span
                  className={`font-light text-[0.625rem] px-2 py-1 rounded-[0.625rem] capitalize ${
                    selectedTransaction.type === "PURCHASE"
                      ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                      : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
                  }`}
                >
                  {typeof selectedTransaction?.type === "string"
                    ? selectedTransaction.type.toLowerCase()
                    : "N/A"}
                </span>
              </p>
              {/* amount */}
              <p className="flex justify-between items-center text-xs text-[#7D7D7D]  border-b border-[#d9d9d9] py-1 px-3">
                <span className="font-medium">Amount:</span>
                <span className={` font-light ${balanceClassT}`}>
                  {formatCurrency(selectedTransaction.total)}
                </span>
              </p>
              {/* process by */}
              <p className="flex justify-between items-center text-xs text-[#7D7D7D]  border-b border-[#d9d9d9] py-1 px-3">
                <span className="font-medium">Process by:</span>
                <span className=" font-light text-[#444444]">
                  {selectedTransaction.userId.name}
                </span>
              </p>
              <p className="min-h-4"></p>
            </article>
          </div>

          {/* items or services */}
          <div className="border border-[#d9d9d9] rounded-[0.625rem] mx-4">
            <h6 className="border-b border-[#d9d9d9] py-2 px-4">
              Item/Services
            </h6>
            {/* table */}
            <div className="p-4">
              <table className="w-full">
                <thead className="w-full bg-[#F5F5F5] text-center border-b border-[#d9d9d9]">
                  <tr>
                    <td className="text-[#7D7D7D] py-3 text-xs">Description</td>
                    <td className="text-[#7D7D7D] py-3 text-xs">Quantity</td>
                    <td className="text-[#7D7D7D] py-3 text-xs">Unit Price</td>
                    <td className="text-[#7D7D7D] py-3 text-xs">Discount</td>
                    <td className="text-[#7D7D7D] py-3 text-xs">Total</td>
                  </tr>
                </thead>
                <tbody>
                  {selectedTransaction.items.map((item) => (
                    <tr
                      key={item.productId}
                      className="text-[#444444] text-center text-xs border-b border-[#d9d9d9]"
                    >
                      <td className="py-2">{item.productName}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2">₦0.00</td>
                      <td className="py-2">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* discount and total */}
            <div className="flex justify-end px-5 mt-5 pb-3">
              <div className="space-y-1 ">
                <p className="font-medium text-sm">
                  <span className="text-[#333333]">Total Discount</span>
                  <span className="text-text-dark ml-3">
                    {selectedTransaction?.discount
                      ? formatCurrency(selectedTransaction.discount)
                      : "0"}
                  </span>
                </p>

                {/* total */}
                <p className="font-medium text-sm">
                  <span className="text-[#333333]">Total Amount:</span>
                  <span className="text-[#1c1818] ml-3">
                    {formatCurrency(selectedTransaction.total)}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* discounts */}
          <p className="bg-[#FFE7A4] mt-5 mb-10 mx-4 px-3 py-3 rounded-[0.625rem] ">
            <span className="mr-1 text-sm text-[#7d7d7d]">Total Discount:</span>
            <span className="text-sm text-[#7D7D7D] font-medium">
              {selectedTransaction?.discount
                ? formatCurrency(selectedTransaction.discount)
                : "No Discounts Applied..."}
            </span>
          </p>
        </section>
      )}
    </Modal>
  );
};

export default WalkinTransactionModal;
