/** @format */

import React, { useState } from "react";
import { toast } from "react-toastify";

// components
import ClientSearch from "./components/ClientSearch";
import AddSaleProduct from "./components/AddSaleProduct";
import ClientDisplayBox from "./components/ClientDisplayBox";
import WalkinClientDetailBox from "./components/WalkinClientDetailBox";
import SalesReceipt from "./components/SalesReceipt";

// store
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useClientStore } from "@/stores/useClientStore";
import { useAuthStore } from "@/stores/useAuthStore";

// services
import { AddTransaction } from "@/services/transactionService";

// types
import type { Client } from "@/types/types";

// ui
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/Modal";

// utils
import { toSentenceCaseName } from "@/utils/styles";
import { handleApiError } from "@/services/errorhandler";

export type Row = {
  productId: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
  unit?: string;
  productName?: string;
};

const emptyRow: Row = {
  productId: "",
  unitPrice: 0,
  quantity: 1,
  discount: 0,
  total: 0,
  unit: "",
  productName: "",
};

const NewSales: React.FC = () => {
  // Store data
  const { products } = useInventoryStore();
  const clients = useClientStore((state) => state.clients);
  const { user } = useAuthStore();

  // Client state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [walkInData, setWalkInData] = useState({ name: "", phone: "" });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bankName, setBankName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Product state
  const [rows, setRows] = useState<Row[]>([]);
  const [discountReason, setDiscountReason] = useState("");

  // receipt state
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null); // store the info for the receipt

  // check for branchid
  if (!user?.branchId) {
    toast.error("Branch ID is missing");
    return null;
  }

  // Helper to get numeric value safely
  const getAmountPaid = () => {
    const value = parseFloat(amountPaid);
    return isNaN(value) ? null : value;
  };

  // helper function to check requirements for completing sales
  const canSubmit = () => {
    if (!selectedClient && !isWalkIn) return false;
    if (isWalkIn && !walkInData.name.trim()) return false;
    if (!rows.some((row) => row.productId)) return false;
    if (rows.some((row) => row.discount > 0) && !discountReason.trim())
      return false;
    if (!paymentMethod) return false;
    if (["bank", "transfer"].includes(paymentMethod) && !bankName.trim())
      return false;
    const paid = getAmountPaid();
    if (paid === null || paid < 0) return false; // disallow empty or negative

    return true;
  };

  // validate sales
  const validateSales = () => {
    if (!canSubmit()) {
      toast.error("Please fill all required fields correctly");
      return false;
    }
    return true;
  };

  const calculateTotals = () => {
    const subtotal = rows.reduce(
      (acc, row) => acc + (Number(row.quantity) * Number(row.unitPrice) || 0),
      0
    );

    const discountTotal = rows.reduce((acc, row) => {
      const lineAmount = Number(row.quantity) * Number(row.unitPrice);
      const pct = Number(row.discount) || 0;
      const discountAmount = (lineAmount * pct) / 100;
      return acc + discountAmount;
    }, 0);

    const total = subtotal - discountTotal;
    return { subtotal, discountTotal, total };
  };

  const getBalanceInfo = () => {
    const { total } = calculateTotals();
    const paid = parseFloat(amountPaid) || 0;

    // Get up-to-date balance from store
    const clientBalance =
      clients.find((c) => c._id === selectedClient?._id)?.balance || 0;

    const availableBalance = selectedClient ? clientBalance : 0;
    const effectiveAmountPaid = paid + availableBalance;
    const balanceDue = Math.max(0, total - effectiveAmountPaid);

    let statusMessage;
    if (balanceDue === 0) {
      statusMessage = "No balance due";
    } else if (selectedClient && clientBalance > 0) {
      statusMessage = `Balance due: ₦ ${balanceDue.toFixed(
        2
      )} (Account balance: ₦ ${clientBalance.toFixed(2)})`;
    } else {
      statusMessage = `Balance due: ₦ ${balanceDue.toFixed(2)}`;
    }

    return {
      balanceDue,
      clientBalance,
      statusMessage,
    };
  };

  const { statusMessage } = getBalanceInfo();

  const handleWalkInDataChange = (data: { name: string; phone: string }) => {
    setWalkInData(data);
  };

  const handleResetClient = () => {
    setSelectedClient(null);
    setIsWalkIn(false);
    setWalkInData({ name: "", phone: "" });
    setRows([{ ...emptyRow }]);
    setPaymentMethod("");
    setBankName("");
    setAmountPaid("");
    setDiscountReason("");
    setNotes("");
  };

  const handleSubmit = async () => {
    if (!validateSales()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { discountTotal, total } = calculateTotals();
      const effectiveAmountPaid = getAmountPaid() || 0;

      // Transform rows to match API expected format
      const apiItems = rows
        .filter((row) => row.productId) // Only include rows with selected products
        .map((row) => {
          const product = products.find((p) => p._id === row.productId);
          return {
            productId: row.productId,
            quantity: row.quantity,
            unit: product?.unit || "pcs", // Get unit from product or default
            discount: row.discount || 0,
          };
        });

      // Determine sale type
      let saleType: "PURCHASE" | "PICKUP" = "PURCHASE";

      // walk-in always PURCHASE
      if (isWalkIn) {
        saleType = "PURCHASE";
      } else if (selectedClient) {
        const clientBalance = selectedClient.balance || 0;

        if (effectiveAmountPaid + clientBalance >= total) {
          // enough to cover purchase
          saleType = "PURCHASE";
        } else {
          // not enough to cover purchase
          saleType = "PICKUP";
          // amount could be 0
        }
      }

      // Build payload according to API structure
      const payload = {
        ...(selectedClient?._id
          ? { clientId: selectedClient._id }
          : {
              walkInClient: {
                name: walkInData.name,
                phone: walkInData.phone,
              },
            }),
        type: saleType,
        items: apiItems,
        amountPaid: effectiveAmountPaid,
        discount: discountTotal,
        paymentMethod: saleType === "PICKUP" ? "From account" : paymentMethod,

        notes: discountReason
          ? `Discount reason: ${discountReason}${
              notes ? `. Additional notes: ${notes}` : ""
            }`
          : notes,
        // branchId: branchId,
        ...(bankName && saleType === "PURCHASE" ? { bankName } : {}), // Include bank name if provided
      };

      // call API
      const createdTransaction = await AddTransaction(payload);

      // set receipt data and open modal
      setReceiptData(createdTransaction[0]);
      setShowReceipt(true);
      toast.success(`${saleType} created successfully!`);
      // setReceiptData({
      //   client: selectedClient,
      //   walkInClient: isWalkIn ? walkInData : null,
      //   items: rows.filter((row) => row.productId),
      //   totals: calculateTotals(),
      //   paymentMethod,
      //   bankName,
      //   amountPaid: getAmountPaid(),
      //   date: new Date(),

      //   invoiceNumber: "INV-" + Date.now(), // or get from API if returned
      // });

      // Reset form after successful submission
      handleResetClient();
    } catch (error) {
      handleApiError(error, "Transaction error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className="md:bg-white md:px-7 py-5 md:py-10 rounded-[0.625rem] md:shadow">
        <h4 className="text-[#333333] text-lg md:text-xl font-medium mb-6">
          Create New Sales
        </h4>
        <div className="md:p-5 md:rounded-[8px] md:border md:border-[#D9D9D9]">
          {!isWalkIn ? (
            <div>
              <h6 className="hidden md:block">Select Client</h6>

              {/* The select */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 md:mt-2">
                <div className="flex-1 w-full">
                  <ClientSearch
                    selectedClient={selectedClient}
                    onClientSelect={setSelectedClient}
                  />
                </div>
                <Button
                  onClick={() => {
                    setIsWalkIn(true);
                    setSelectedClient(null); // Clear selected client when switching to walk-in
                  }}
                  className="w-full md:w-fit bg-[#3D80FF] text-white p-5"
                >
                  Walk in
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {/* If the walkin button is clicked, show a detail box to collect their data */}
              <div className="flex justify-between items-center mb-4">
                <h6>Walk-in Client Details</h6>
                <Button
                  onClick={() => {
                    setIsWalkIn(false);
                    setWalkInData({ name: "", phone: "" });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Back to Client Search
                </Button>
              </div>
              <WalkinClientDetailBox
                onDataChange={handleWalkInDataChange}
                data={walkInData}
              />
            </div>
          )}

          {/* Show details only if a client is selected */}
          {selectedClient && (
            <ClientDisplayBox
              clientName={selectedClient.name}
              phoneNumber={selectedClient.phone}
              address={selectedClient.address}
              balance={selectedClient.balance}
            />
          )}

          {/* Show walk-in client summary if walk-in is active and data is entered */}
          {isWalkIn && walkInData.name && (
            <div className="mt-4 p-4 border border-[#D9D9D9] rounded-lg bg-[#F8F9FA]">
              <h6 className="font-medium text-[#333333]">Walk-in Client</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <p>Name: {toSentenceCaseName(walkInData.name)}</p>
                {walkInData.phone && <p>Phone: {walkInData.phone}</p>}
              </div>
            </div>
          )}

          {/* add product */}
          <div className="mt-7">
            <AddSaleProduct
              // onRowsChange={setRows}
              rows={rows}
              setRows={setRows}
              onDiscountReasonChange={setDiscountReason}
              discountReason={discountReason}
            />
          </div>
        </div>

        {/* payment method */}
        <div className="p-5 my-7 border border-[#D9D9D9] rounded-[8px]">
          <h5 className="text-[var(--cl-text-dark)] text-xl font-medium mb-4">
            Payment Details
          </h5>

          <div className="flex gap-6 flex-wrap">
            <div className="">
              <Label className="text-[#333333] text-sm font-medium mb-2 block">
                Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-[180px] bg-[#D9D9D9] border border-[#D9D9D9]">
                  <SelectValue placeholder="Select Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="pos">P.O.S</SelectItem>
                  <SelectItem value="balance">From Balance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show bank name input for bank/transfer payments */}
            {(paymentMethod === "bank" || paymentMethod === "transfer") && (
              <div>
                <Label className="text-[#333333] text-sm font-medium mb-2 block">
                  Bank Name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter bank name"
                  className="w-40"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label className="text-[#333333] text-sm font-medium mb-2 block">
                Amount Paid
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                className="w-40"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>
          </div>

          {/* Optional notes field */}
          <div className="mt-4">
            <Label className="text-[#333333] text-sm font-medium mb-2 block">
              Additional Notes (Optional)
            </Label>
            <Input
              type="text"
              placeholder="Enter any additional notes"
              className="w-full max-w-md"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <p className="mt-3 text-sm">
            Status: <span className="text-[#7D7D7D]">{statusMessage}</span>
          </p>
        </div>

        {/* buttons */}
        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            type="button"
            onClick={handleResetClient}
            className="w-30 border-[#7D7D7D] text-[#444444]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className=" text-white"
            disabled={isSubmitting || !canSubmit()}
          >
            {isSubmitting ? "Processing..." : "Complete Sales"}
          </Button>
        </div>
      </section>

      {showReceipt && receiptData && (
        <Modal
          size="xxl"
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
        >
          {/* <SalesReceipt
            data={receiptData}
            onClose={() => setShowReceipt(false)}
          /> */}
          <SalesReceipt transaction={receiptData} />
        </Modal>
      )}
    </main>
  );
};

export default NewSales;
