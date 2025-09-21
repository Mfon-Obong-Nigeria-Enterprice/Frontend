import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

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
import type { Transaction } from "@/types/transactions";

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
import ClientStatusBadge from "@/pages/ClientStatusBadge";

// utils
import {
  toSentenceCaseName,
  balanceTextClass,
  formatCurrency,
} from "@/utils/styles";
import { handleApiError } from "@/services/errorhandler";

// icons
import { AlertCircle } from "lucide-react";

// data
import { bankNames, posNames } from "@/data/banklist";

// connect to socket
const socket = io("https://mfon-obong-enterprise.onrender.com");

export type Row = {
  productId: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  discountType: "percent" | "amount";
  total: number;
  unit?: string;
  productName?: string;
};

// Define a simple type for the receipt data based on backend structure
type ReceiptData = Transaction;

const emptyRow: Row = {
  productId: "",
  unitPrice: 0,
  quantity: 1,
  discount: 0,
  discountType: "amount",
  total: 0,
  unit: "",
  productName: "",
};

const NewSales: React.FC = () => {
  const queryClient = useQueryClient();
  // Store data
  const { products } = useInventoryStore();
  const clients = useClientStore((state) => state.clients);
  const { user } = useAuthStore();

  // Client state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [walkInData, setWalkInData] = useState({ name: "", phone: "" });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [subMethod, setSubMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState("0");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product state
  const [rows, setRows] = useState<Row[]>([emptyRow]);
  const amountPaidInputRef = useRef<HTMLInputElement>(null);

  // discount state
  const [discountReason, setDiscountReason] = useState("");
  const [globalDiscount, setGlobalDiscount] = useState(0);

  // receipt state
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const [bankSearch, setBankSearch] = useState("");

  // listen for socket event
  useEffect(() => {
    socket.on("transaction_created", (data: ReceiptData) => {
      setReceiptData(data);
      setShowReceipt(true);
    });
    //clean up function
    return () => {
      socket.off("transaction_created");
    };
  }, []);

  if (!user?.branchId) {
    toast.error("Branch ID is missing");
    return null;
  }

  const formatCurrencyInput = (value: string) => {
    if (!value) return "₦0.00";

    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Handle empty value
    if (digitsOnly === "") return "₦0.00";

    // Convert to number and format
    const numericValue = parseFloat(digitsOnly);

    return `₦${numericValue.toLocaleString()}`;
  };

  // Parse formatted currency back to raw digits
  const parseCurrency = (formattedValue: string) => {
    return formattedValue.replace(/[^\d]/g, "");
  };

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const originalValue = input.value;

    // Get raw digits from current value

    // Get new raw value by processing the input
    let newRawValue = parseCurrency(originalValue);

    // Limit to 12 digits (₦999,999,999.99)
    if (newRawValue.length > 12) {
      newRawValue = newRawValue.slice(0, 12);
    }

    setAmountPaid(newRawValue);

    // Set cursor position after formatting
    setTimeout(() => {
      if (amountPaidInputRef.current) {
        // Calculate new cursor position based on formatting changes
        const formattedValue = formatCurrencyInput(newRawValue);
        const newCursorPosition = formattedValue.length;

        // Try to maintain cursor position relative to the end
        amountPaidInputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);
  };

  const handleAmountPaidKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Allow navigation keys, backspace, delete, tab, etc.
    const allowedKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Backspace",
      "Delete",
      "Tab",
      "Home",
      "End",
    ];

    if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      // Allow only digits
      if (!/\d/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handleAmountPaidFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text when focused for easy editing
    setTimeout(() => e.target.select(), 0);
  };

  // Check if selected client is blocked/suspended
  const isClientBlocked = selectedClient?.isActive === false;

  // get list for payment method
  const getSubList = () => {
    if (paymentMethod === "bank" || paymentMethod === "transfer")
      return bankNames;
    if (paymentMethod === "pos") return posNames;
    return [];
  };

  // Helper to get numeric value safely
  const getAmountPaid = () => {
    if (!amountPaid) return 0;
    const value = parseFloat(amountPaid) / 100; // Convert raw digits to actual amount
    return isNaN(value) ? null : value;
  };

  const canSubmit = () => {
    if (selectedClient && isClientBlocked) return false;
    if (!selectedClient && !isWalkIn) return false;
    if (isWalkIn && !walkInData.name.trim()) return false;
    if (!rows.some((row) => row.productId)) return false;
    // if (rows.some((row) => row.discount > 0) && !discountReason.trim())
    if (
      (rows.some((row) => row.discount > 0) || globalDiscount > 0) &&
      !discountReason.trim()
    )
      return false;
    if (!paymentMethod) return false;
    const paid = getAmountPaid();
    if (paid === null || paid < 0) return false;
    return true;
  };

  const validateSales = () => {
    if (selectedClient && isClientBlocked) {
      toast.error(
        "Cannot create transaction for suspended client. Please contact manager."
      );
      return false;
    }
    if (!canSubmit()) {
      toast.error("Please fill all required fields correctly");
      return false;
    }

    // prevent walk-in from overpaying
    if (isWalkIn) {
      const { total } = calculateTotals();
      const paid = getAmountPaid() || 0;

      if (Math.abs(paid - total) > 0.01) {
        // Allow for small rounding differences
        toast.error(
          `Walk-in clients must pay exactly ${formatCurrency(total)}`
        );
        return false;
      }
    }

    return true;
  };

  const calculateTotals = () => {
    const subtotal = rows.reduce(
      (acc, row) => acc + (Number(row.quantity) * Number(row.unitPrice) || 0),
      0
    );

    const rowDiscountTotal = rows.reduce((acc, row) => {
      const lineAmount = Number(row.quantity) * Number(row.unitPrice);
      if (!row.discount) return acc;

      let discountAmount = 0;
      if (row.discountType === "percent") {
        discountAmount = (lineAmount * Number(row.discount)) / 100;
      } else if (row.discountType === "amount") {
        discountAmount = Number(row.discount);
      }

      return acc + discountAmount;
    }, 0);

    // only apply global discount if no discount exists
    const discountTotal =
      rowDiscountTotal > 0 ? rowDiscountTotal : globalDiscount;

    const total = subtotal - discountTotal;
    return { subtotal, discountTotal, total };
  };

  const getBalanceInfo = () => {
    const { total } = calculateTotals();
    const paid = parseFloat(amountPaid) || 0;
    const clientBalance =
      clients.find((c) => c._id === selectedClient?._id)?.balance || 0;

    const availableBalance = selectedClient ? clientBalance : 0;
    const effectiveAmountPaid = paid + availableBalance;
    const balanceDue = Math.max(0, total - effectiveAmountPaid);
    const newBalance = effectiveAmountPaid - total;

    let statusMessage;
    if (isWalkIn) {
      if (paid === total) {
        statusMessage = "Payment complete";
      } else if (paid > total) {
        statusMessage = `Overpayment: ${formatCurrency(
          paid - total
        )} (not allowed for walk-in)`;
      } else {
        statusMessage = `Amount due: ${formatCurrency(
          total - paid
        )} (full payment required)`;
      }
    } else if (balanceDue === 0) {
      statusMessage = "No balance due";
    } else if (selectedClient && clientBalance > 0) {
      statusMessage = `Balance due: ${formatCurrency(
        balanceDue
      )} (Account balance: ${formatCurrency(clientBalance)})`;
    } else {
      statusMessage = `Balance due: ${formatCurrency(balanceDue)}`;
    }

    return { statusMessage, total, paid, clientBalance, newBalance };
  };

  const { statusMessage, total, paid, clientBalance, newBalance } =
    getBalanceInfo();

  const handleWalkInDataChange = (data: { name: string; phone: string }) => {
    setWalkInData(data);
  };

  const handleResetClient = () => {
    setSelectedClient(null);
    setIsWalkIn(false);
    setWalkInData({ name: "", phone: "" });
    setRows([{ ...emptyRow }]);
    setPaymentMethod("cash");
    setAmountPaid("");
    setDiscountReason("");
    setNotes("");
    setIsSubmitting(false);
    setGlobalDiscount(0);
  };

  const handleSubmit = async () => {
    if (!validateSales()) return;

    setIsSubmitting(true);
    try {
      const { discountTotal, total } = calculateTotals();
      const effectiveAmountPaid = getAmountPaid() || 0;

      // Debug log
      // console.log("Transaction calculation:", {
      //   subtotal,
      //   discountTotal,
      //   total,
      //   effectiveAmountPaid,
      //   globalDiscount,
      //   rowDiscounts: rows.map((r) => r.discount),
      // });

      const apiItems = rows
        .filter((row) => row.productId)
        .map((row) => {
          const product = products.find((p) => p._id === row.productId);
          return {
            productId: row.productId,
            quantity: row.quantity,
            unit: product?.unit || "pcs",
            discount: 0,
            // discount: row.discount || 0,
          };
        });

      let saleType: "PURCHASE" | "PICKUP" = "PURCHASE";
      if (!isWalkIn && selectedClient) {
        const clientBalance = selectedClient.balance || 0;
        const canCover = effectiveAmountPaid + clientBalance >= total;

        saleType = canCover ? "PURCHASE" : "PICKUP";
      }

      let paymentMethodForBackend = paymentMethod;
      if (subMethod) {
        if (paymentMethod === "bank" || paymentMethod === "transfer") {
          paymentMethodForBackend = `Transfer from ${subMethod}`;
        } else if (paymentMethod === "pos") {
          paymentMethodForBackend = `POS with ${subMethod}`;
        }
      }

      const payload = {
        ...(selectedClient?._id
          ? { clientId: selectedClient._id }
          : { walkInClient: walkInData }),
        type: saleType,
        items: apiItems,
        amountPaid: effectiveAmountPaid,
        discount: discountTotal,
        paymentMethod:
          // saleType === "PICKUP" ? "PICKUP" : paymentMethodForBackend,
          saleType === "PICKUP" ? "Credit" : paymentMethodForBackend,
        notes,
      };

      // get the actual transaction returned from backend
      await AddTransaction(payload);
      // const transaction = await AddTransaction(payload);

      toast.success("Transaction created successfully");

      // pass the backend transaction to the receipt
      // setReceiptData(transaction);
      // setShowReceipt(true);

      // Invalidate so transactions refetch immediately
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["clients"] });

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
        <h4 className="text-[#333] text-lg md:text-xl font-medium mb-6">
          Create New Sales
        </h4>

        {/* Client Selection */}
        <div className="md:p-5 md:rounded-[8px] md:border md:border-[#D9D9D9]">
          {!isWalkIn ? (
            <div>
              <h6 className="hidden md:block">Select Client</h6>
              <div className="flex flex-col md:flex-row gap-4 md:gap-10 md:mt-2">
                <ClientSearch
                  selectedClient={selectedClient}
                  onClientSelect={setSelectedClient}
                />
                <Button
                  onClick={() => {
                    setIsWalkIn(true);
                    setSelectedClient(null);
                  }}
                  className="w-full md:w-fit bg-[#3D80FF] text-white"
                >
                  Walk in
                </Button>
              </div>
            </div>
          ) : (
            <div>
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
                  Back
                </Button>
              </div>
              <WalkinClientDetailBox
                onDataChange={handleWalkInDataChange}
                data={walkInData}
              />
            </div>
          )}

          {selectedClient && (
            <>
              <div className="mt-4">
                <ClientStatusBadge client={selectedClient} />
              </div>
              {isClientBlocked && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 text-sm">
                    This client is suspended.
                  </p>
                </div>
              )}
              <ClientDisplayBox
                clientName={selectedClient.name}
                phoneNumber={selectedClient.phone}
                address={selectedClient.address}
                balance={selectedClient.balance}
              />
            </>
          )}

          {isWalkIn && walkInData.name && (
            <div className="mt-4 p-4 border rounded-lg bg-[#F8F9FA]">
              <h6 className="font-medium text-[#333]">Walk-in Client</h6>
              <p>Name: {toSentenceCaseName(walkInData.name)}</p>
              {walkInData.phone && <p>Phone: {walkInData.phone}</p>}
            </div>
          )}

          {(!selectedClient || !isClientBlocked || isWalkIn) && (
            <div className="mt-7">
              <AddSaleProduct
                rows={rows}
                setRows={setRows}
                emptyRow={emptyRow}
                onDiscountReasonChange={setDiscountReason}
                discountReason={discountReason}
                setGlobalDiscount={setGlobalDiscount}
                globalDiscount={globalDiscount}
              />
            </div>
          )}
        </div>

        {/* Payment Section */}
        {(!selectedClient || !isClientBlocked || isWalkIn) && (
          <div className="p-5 my-7 border rounded-[8px]">
            <h5 className="text-xl font-medium mb-4">Payment Details</h5>
            <div className="flex gap-6 flex-wrap">
              <div>
                <Label className="mb-1">Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(val) => {
                    setPaymentMethod(val);
                    setSubMethod("");
                    setBankSearch("");
                  }}
                >
                  <SelectTrigger className="w-[180px] bg-[#D9D9D9]">
                    <SelectValue placeholder="Select Payment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="pos">P.O.S</SelectItem>
                    {!isWalkIn && (
                      <>
                        <SelectItem value="balance">From Balance</SelectItem>
                        <SelectItem value="credit">On Credit</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {["bank", "transfer", "pos"].includes(paymentMethod) && (
                <div>
                  <Label className="mb-1">
                    Choose {paymentMethod === "pos" ? "POS" : "Bank"}
                  </Label>

                  <Select value={subMethod} onValueChange={setSubMethod}>
                    <SelectTrigger className="w-[180px] bg-[#D9D9D9]">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent
                      side="top"
                      className="max-h-[250px] overflow-y-auto"
                    >
                      <div
                        className="px-2 py-2 sticky top-0 bg-white z-10"
                        onClick={(e) => e.stopPropagation()} // prevent dropdown from closing
                      >
                        <Input
                          type="text"
                          placeholder={`Search ${
                            paymentMethod === "pos" ? "POS" : "Bank"
                          }`}
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>

                      {/* Filtered List */}
                      {getSubList()
                        .filter((name) =>
                          name.toLowerCase().includes(bankSearch.toLowerCase())
                        )
                        .map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}

                      {/* Show message if no results */}
                      {getSubList().filter((name) =>
                        name.toLowerCase().includes(bankSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No matches found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="mb-1">Amount Paid</Label>
                <Input
                  ref={amountPaidInputRef}
                  type="text"
                  placeholder="₦0.00"
                  className="w-40"
                  value={formatCurrencyInput(amountPaid)}
                  onChange={handleAmountPaidChange}
                  onKeyDown={handleAmountPaidKeyDown}
                  onFocus={handleAmountPaidFocus}
                />
              </div>
            </div>
            {isWalkIn && (
              <p className="mt-3 text-sm text-[#7D7D7D]">{statusMessage}</p>
            )}

            {/* for registered client, show account details */}
            {selectedClient && total > 0 && (
              <div className="bg-[#f0f0f3] px-5 py-5 rounded-[10px] mt-5 space-y-2.5">
                {/* client balance */}
                <p className="flex justify-between items-center text-sm font-Inter">
                  <span className="text-[#444444]">
                    Current Client Balance:
                  </span>
                  <span
                    className={`font-medium ${balanceTextClass(clientBalance)}`}
                  >
                    {formatCurrency(clientBalance)}
                  </span>
                </p>

                {/* total purchase */}
                <p className="flex justify-between items-center text-sm font-Inter">
                  <span className="text-[#444444]">Purchase Total:</span>
                  <span className="font-medium text-[#F95353]">
                    -₦
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </p>

                {/* amount paid */}
                <p className="flex justify-between items-center text-sm font-Inter">
                  <span className="text-[#444444]">Amount Paid:</span>
                  <span className="font-medium text-[#2ECC71]">
                    +₦
                    {`${paid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`}
                  </span>
                </p>

                {/* new balance */}
                <p className="flex justify-between items-center text-sm font-Inter border-t border-[#7D7D7D] pt-2 font-medium">
                  <span className="text-[#7D7D7D]">
                    New balance (After purchase):
                  </span>
                  <span className={balanceTextClass(newBalance)}>
                    {formatCurrency(newBalance)}{" "}
                    {newBalance > 0 ? "(Credit)" : "(Debt)"}
                  </span>
                </p>
              </div>
            )}
            {/* only show warning if the client will owe */}
            {selectedClient && newBalance < 0 && (
              <div className="flex items-center bg-[#FFF2CE] border border-[#ffa500] rounded-[8px] min-h-[63px] px-14 mt-5">
                <p className="font-Inter text-amber-800">
                  <span className="font-medium text-[15px]">Warning:</span>
                  <span className="text-sm">
                    This transaction will result in a debt of ₦
                    {Math.abs(newBalance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                    . Client will owe money after this purchase
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleResetClient}
            className="w-30"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit()}
            className="text-white"
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
          <SalesReceipt transaction={receiptData} />
        </Modal>
      )}
    </main>
  );
};

export default NewSales;
