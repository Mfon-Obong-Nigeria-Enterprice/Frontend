import React, { useState, useEffect } from "react";
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
// type ReceiptData = {
//   invoiceNumber: string;
//   clientName?: string;
//   walkInClient?: { name: string; phone?: string };
//   amountPaid: number;
//   total: number;
//   paymentMethod: string;
//   items: {
//     productId: string;
//     productName: string;
//     quantity: number;
//     unit: string;
//     unitPrice: number;
//     discount: number;
//   }[];
//   date: string;
// };

const emptyRow: Row = {
  productId: "",
  unitPrice: 0,
  quantity: 1,
  discount: 0,
  discountType: "percent",
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
  const [subMethod, setSubMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product state
  const [rows, setRows] = useState<Row[]>([emptyRow]);
  const [discountReason, setDiscountReason] = useState("");

  // receipt state
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  // ✅ listen for socket event
  useEffect(() => {
    socket.on("transaction_created", (data: ReceiptData) => {
      setReceiptData(data);
      setShowReceipt(true);
    });

    return () => {
      socket.off("transaction_created");
    };
  }, []);

  if (!user?.branchId) {
    toast.error("Branch ID is missing");
    return null;
  }

  console.log("showReceipt:", showReceipt, "receiptData:", receiptData);

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
    const value = parseFloat(amountPaid);
    return isNaN(value) ? null : value;
  };

  const canSubmit = () => {
    if (selectedClient && isClientBlocked) return false;
    if (!selectedClient && !isWalkIn) return false;
    if (isWalkIn && !walkInData.name.trim()) return false;
    if (!rows.some((row) => row.productId)) return false;
    if (rows.some((row) => row.discount > 0) && !discountReason.trim())
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
      if (paid > total) {
        toast.error(`Amount is greater than total - ${total}`);
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

    const discountTotal = rows.reduce((acc, row) => {
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
    if (balanceDue === 0) {
      statusMessage = "No balance due";
    } else if (selectedClient && clientBalance > 0) {
      statusMessage = `Balance due: ₦${balanceDue.toFixed(
        2
      )} (Account balance: ₦${clientBalance.toFixed(2)})`;
    } else {
      statusMessage = `Balance due: ₦${balanceDue.toFixed(2)}`;
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
    setPaymentMethod("");
    setAmountPaid("");
    setDiscountReason("");
    setNotes("");
  };

  // const handleSubmit = async () => {
  //   if (!validateSales()) return;

  //   setIsSubmitting(true);
  //   try {
  //     const { discountTotal, total } = calculateTotals();
  //     const effectiveAmountPaid = getAmountPaid() || 0;

  //     const apiItems = rows
  //       .filter((row) => row.productId)
  //       .map((row) => {
  //         const product = products.find((p) => p._id === row.productId);
  //         return {
  //           productId: row.productId,
  //           quantity: row.quantity,
  //           unit: product?.unit || "pcs",
  //           discount: row.discount || 0,
  //         };
  //       });

  //     let saleType: "PURCHASE" | "PICKUP" = "PURCHASE";
  //     if (!isWalkIn && selectedClient) {
  //       const clientBalance = selectedClient.balance || 0;
  //       if (effectiveAmountPaid + clientBalance < total) {
  //         saleType = "PICKUP";
  //       }
  //     }

  //     let paymentMethodForBackend = paymentMethod;
  //     if (subMethod) {
  //       if (paymentMethod === "bank" || paymentMethod === "transfer") {
  //         paymentMethodForBackend = `Transfer from ${subMethod}`;
  //       } else if (paymentMethod === "pos") {
  //         paymentMethodForBackend = `POS with ${subMethod}`;
  //       }
  //     }

  //     const payload = {
  //       ...(selectedClient?._id
  //         ? { clientId: selectedClient._id }
  //         : { walkInClient: walkInData }),
  //       type: saleType,
  //       items: apiItems,
  //       amountPaid: effectiveAmountPaid,
  //       discount: discountTotal,
  //       paymentMethod:
  //         saleType === "PICKUP" ? "Credit" : paymentMethodForBackend,
  //       notes,
  //     };

  //     await AddTransaction(payload);

  //     toast.info("Transaction created, waiting for receipt...");

  //     setReceiptData({
  //       client: selectedClient,
  //       walkInClient: isWalkIn ? walkInData : null,
  //       items: rows.filter((row) => row.productId),
  //       totals: calculateTotals(),
  //       paymentMethod,
  //       //  bankName,
  //       amountPaid: getAmountPaid(),
  //       date: new Date(),
  //     });
  //     setIsReceiptOpen(true);

  //     handleResetClient();
  //   } catch (error) {
  //     handleApiError(error, "Transaction error");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
    if (!validateSales()) return;

    setIsSubmitting(true);
    try {
      const { discountTotal, total } = calculateTotals();
      const effectiveAmountPaid = getAmountPaid() || 0;

      const apiItems = rows
        .filter((row) => row.productId)
        .map((row) => {
          const product = products.find((p) => p._id === row.productId);
          return {
            productId: row.productId,
            quantity: row.quantity,
            unit: product?.unit || "pcs",
            discount: row.discount || 0,
          };
        });

      let saleType: "PURCHASE" | "PICKUP" = "PURCHASE";
      if (!isWalkIn && selectedClient) {
        const clientBalance = selectedClient.balance || 0;
        if (effectiveAmountPaid + clientBalance < total) {
          saleType = "PICKUP";
        }
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
          saleType === "PICKUP" ? "Credit" : paymentMethodForBackend,
        notes,
      };

      // ✅ get the actual transaction returned from backend
      const transaction = await AddTransaction(payload);

      toast.success("Transaction created successfully");

      // ✅ pass the backend transaction to the receipt
      setReceiptData(transaction);
      setShowReceipt(true);

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
                    <SelectContent>
                      {getSubList().map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="mb-1">Amount Paid</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="w-40"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
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
                    {/* ₦
                    {clientBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })} */}
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
                  <span
                    // className={
                    //   newBalance >= 0
                    //     ? "text-green-600 font-semibold"
                    //     : "text-red-600 font-semibold"
                    // }
                    className={balanceTextClass(newBalance)}
                  >
                    {/* {newBalance >= 0
                      ? `₦${newBalance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })} (Credit)`
                      : `₦${Math.abs(newBalance).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })} (Debt)`} */}
                    {formatCurrency(newBalance)}{" "}
                    {newBalance > 0 ? "(Credit)" : "(Debt)"}
                  </span>
                </p>
              </div>
            )}
            {/* only show warning if the client will owe */}
            {newBalance < 0 && (
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
      {/* {transaction && <SalesReceipt transaction={receiptData} />} */}
    </main>
  );
};

export default NewSales;

// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";

// // components
// import ClientSearch from "./components/ClientSearch";
// import AddSaleProduct from "./components/AddSaleProduct";
// import ClientDisplayBox from "./components/ClientDisplayBox";
// import WalkinClientDetailBox from "./components/WalkinClientDetailBox";
// import SalesReceipt from "./components/SalesReceipt";

// // store
// import { useInventoryStore } from "@/stores/useInventoryStore";
// import { useClientStore } from "@/stores/useClientStore";
// import { useAuthStore } from "@/stores/useAuthStore";

// // services
// import { AddTransaction } from "@/services/transactionService";

// // types
// import type { Client } from "@/types/types";

// // ui
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Modal from "@/components/Modal";

// // utils
// import { toSentenceCaseName } from "@/utils/styles";
// import { handleApiError } from "@/services/errorhandler";
// import { AlertCircle } from "lucide-react";
// import ClientStatusBadge from "@/pages/ClientStatusBadge";

// // data
// import { bankNames, posNames } from "@/data/banklist";

// // connet to socket
// const socket = io("https://mfon-obong-enterprise.onrender.com");

// export type Row = {
//   productId: string;
//   unitPrice: number;
//   quantity: number;
//   discount: number;
//   discountType: "percent" | "amount";
//   total: number;
//   unit?: string;
//   productName?: string;
// };

// // Define a type for the receipt data based on your transaction structure
// type ReceiptData = ReturnType<typeof AddTransaction> extends Promise<
//   (infer U)[]
// >
//   ? U
//   : unknown;

// const emptyRow: Row = {
//   productId: "",
//   unitPrice: 0,
//   quantity: 1,
//   discount: 0,
//   discountType: "percent",
//   total: 0,
//   unit: "",
//   productName: "",
// };

// const NewSales: React.FC = () => {
//   // Store data
//   const { products } = useInventoryStore();
//   const clients = useClientStore((state) => state.clients);
//   const { user } = useAuthStore();

//   // Client state
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
//   const [isWalkIn, setIsWalkIn] = useState(false);
//   const [walkInData, setWalkInData] = useState({ name: "", phone: "" });

//   // Payment state
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [subMethod, setSubMethod] = useState("");
//   // const [bankName, setBankName] = useState("");
//   const [amountPaid, setAmountPaid] = useState("");
//   const [notes, setNotes] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Product state
//   const [rows, setRows] = useState<Row[]>([emptyRow]);
//   const [discountReason, setDiscountReason] = useState("");

//   // receipt state

//   const [showReceipt, setShowReceipt] = useState(false);
//   const [receiptData, setReceiptData] = useState<ReceiptData | null>(null); // store the info for the receipt

//   useEffect(() => {
//   // When backend finishes transaction and sends receipt
//     socket.on("transaction_created", (data) => {
//       setReceiptData(data);
//       setShowReceipt(true);

//     return () => {
//       socket.off("transaction_created");
//     };
//   },[]);

//   // check for branchid
//   if (!user?.branchId) {
//     toast.error("Branch ID is missing");
//     return null;
//   }
//   // Check if selected client is blocked/suspended
//   const isClientBlocked = selectedClient?.isActive === false;

//   // get list for payment method
//   const getSubList = () => {
//     if (paymentMethod === "bank" || paymentMethod === "transfer")
//       return bankNames;
//     if (paymentMethod === "pos") return posNames;
//     return [];
//   };

//   // Helper to get numeric value safely
//   const getAmountPaid = () => {
//     const value = parseFloat(amountPaid);
//     return isNaN(value) ? null : value;
//   };

//   // helper function to check requirements for completing sales
//   const canSubmit = () => {
//     if (selectedClient && isClientBlocked) return false;
//     if (!selectedClient && !isWalkIn) return false;
//     if (isWalkIn && !walkInData.name.trim()) return false;
//     if (!rows.some((row) => row.productId)) return false;
//     if (rows.some((row) => row.discount > 0) && !discountReason.trim())
//       return false;
//     if (!paymentMethod) return false;
//     // if (["bank", "transfer"].includes(paymentMethod) && !bankName.trim())
//     //   return false;
//     const paid = getAmountPaid();
//     if (paid === null || paid < 0) return false; // disallow empty or negative

//     return true;
//   };

//   // validate sales
//   const validateSales = () => {
//     if (selectedClient && isClientBlocked) {
//       toast.error(
//         "Cannot create transaction for suspended client. Please contact manager to reactive the Client"
//       );
//       return false;
//     }
//     if (!canSubmit()) {
//       toast.error("Please fill all required fields correctly");
//       return false;
//     }
//     return true;
//   };

//   const calculateTotals = () => {
//     const subtotal = rows.reduce(
//       (acc, row) => acc + (Number(row.quantity) * Number(row.unitPrice) || 0),
//       0
//     );

//     const discountTotal = rows.reduce((acc, row) => {
//       const lineAmount = Number(row.quantity) * Number(row.unitPrice);
//       const pct = Number(row.discount) || 0;
//       const discountAmount = (lineAmount * pct) / 100;
//       return acc + discountAmount;
//     }, 0);

//     const total = subtotal - discountTotal;
//     return { subtotal, discountTotal, total };
//   };

//   const getBalanceInfo = () => {
//     const { total } = calculateTotals();
//     const paid = parseFloat(amountPaid) || 0;

//     // Get up-to-date balance from store
//     const clientBalance =
//       clients.find((c) => c._id === selectedClient?._id)?.balance || 0;

//     const availableBalance = selectedClient ? clientBalance : 0;
//     const effectiveAmountPaid = paid + availableBalance;
//     const balanceDue = Math.max(0, total - effectiveAmountPaid);

//     let statusMessage;
//     if (balanceDue === 0) {
//       statusMessage = "No balance due";
//     } else if (selectedClient && clientBalance > 0) {
//       statusMessage = `Balance due: ₦ ${balanceDue.toFixed(
//         2
//       )} (Account balance: ₦ ${clientBalance.toFixed(2)})`;
//     } else {
//       statusMessage = `Balance due: ₦ ${balanceDue.toFixed(2)}`;
//     }

//     return {
//       balanceDue,
//       clientBalance,
//       statusMessage,
//     };
//   };

//   const { statusMessage } = getBalanceInfo();

//   const handleWalkInDataChange = (data: { name: string; phone: string }) => {
//     setWalkInData(data);
//   };

//   const handleResetClient = () => {
//     setSelectedClient(null);
//     setIsWalkIn(false);
//     setWalkInData({ name: "", phone: "" });
//     setRows([{ ...emptyRow }]);
//     setPaymentMethod("");
//     // setBankName("");
//     setAmountPaid("");
//     setDiscountReason("");
//     setNotes("");
//   };

//   const handleSubmit = async () => {
//     if (!validateSales()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const { discountTotal, total } = calculateTotals();
//       const effectiveAmountPaid = getAmountPaid() || 0;

//       // Transform rows to match API expected format
//       const apiItems = rows
//         .filter((row) => row.productId) // Only include rows with selected products
//         .map((row) => {
//           const product = products.find((p) => p._id === row.productId);
//           return {
//             productId: row.productId,
//             quantity: row.quantity,
//             unit: product?.unit || "pcs", // Get unit from product or default
//             discount: row.discount || 0,
//           };
//         });

//       // Determine sale type
//       let saleType: "PURCHASE" | "PICKUP" = "PURCHASE";

//       // walk-in always PURCHASE
//       if (isWalkIn) {
//         saleType = "PURCHASE";
//       } else if (selectedClient) {
//         const clientBalance = selectedClient.balance || 0;

//         if (effectiveAmountPaid + clientBalance >= total) {
//           // enough to cover purchase
//           saleType = "PURCHASE";
//         } else {
//           // not enough to cover purchase
//           saleType = "PICKUP";
//           // amount could be 0
//         }
//       }

//       // Build payment method string for backend
//       let paymentMethodForBackend = paymentMethod;
//       if (subMethod) {
//         if (paymentMethod === "bank" || paymentMethod === "transfer") {
//           paymentMethodForBackend = `Transfer from ${subMethod}`;
//         } else if (paymentMethod === "pos") {
//           paymentMethodForBackend = `POS with ${subMethod}`;
//         }
//       }

//       // Build payload according to API structure
//       const payload = {
//         ...(selectedClient?._id
//           ? { clientId: selectedClient._id }
//           : {
//               walkInClient: {
//                 name: walkInData.name,
//                 phone: walkInData.phone,
//               },
//             }),
//         type: saleType,
//         items: apiItems,
//         amountPaid: effectiveAmountPaid,
//         discount: discountTotal,
//         paymentMethod:
//           saleType === "PICKUP" ? "Credit" : paymentMethodForBackend,

//         notes: discountReason
//           ? `Discount reason: ${discountReason}${
//               notes ? `. Additional notes: ${notes}` : ""
//             }`
//           : notes,
//         // branchId: branchId,
//         // ...(bankName && saleType === "PURCHASE" ? { bankName } : {}), // Include bank name if provided
//       };

//       // call API
//       // const createdTransaction = await AddTransaction(payload);

//       const created = await AddTransaction(payload);
// toast.info("Transaction created, waiting for receipt...");

//       // set receipt data and open modal
//       setReceiptData(created[0]);
//       // setReceiptData(createdTransaction[0]);
//       setShowReceipt(true);
//       toast.success(`${saleType} created successfully!`);
//       // setReceiptData({
//       //   client: selectedClient,
//       //   walkInClient: isWalkIn ? walkInData : null,
//       //   items: rows.filter((row) => row.productId),
//       //   totals: calculateTotals(),
//       //   paymentMethod,
//       //   bankName,
//       //   amountPaid: getAmountPaid(),
//       //   date: new Date(),

//       //   invoiceNumber: "INV-" + Date.now(), // or get from API if returned
//       // });

//       // Reset form after successful submission
//       handleResetClient();
//     } catch (error) {
//       handleApiError(error, "Transaction error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main>
//       <section className="md:bg-white md:px-7 py-5 md:py-10 rounded-[0.625rem] md:shadow">
//         <h4 className="text-[#333333] text-lg md:text-xl font-medium mb-6">
//           Create New Sales
//         </h4>
//         <div className="md:p-5 md:rounded-[8px] md:border md:border-[#D9D9D9]">
//           {!isWalkIn ? (
//             <div>
//               <h6 className="hidden md:block">Select Client</h6>

//               {/* The select */}
//               <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 md:mt-2">
//                 <div className="flex-1 w-full">
//                   <ClientSearch
//                     selectedClient={selectedClient}
//                     onClientSelect={setSelectedClient}
//                   />
//                 </div>
//                 <Button
//                   onClick={() => {
//                     setIsWalkIn(true);
//                     setSelectedClient(null); // Clear selected client when switching to walk-in
//                   }}
//                   className="w-full md:w-fit bg-[#3D80FF] text-white p-5"
//                 >
//                   Walk in
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div>
//               {/* If the walkin button is clicked, show a detail box to collect their data */}
//               <div className="flex justify-between items-center mb-4">
//                 <h6>Walk-in Client Details</h6>
//                 <Button
//                   onClick={() => {
//                     setIsWalkIn(false);
//                     setWalkInData({ name: "", phone: "" });
//                   }}
//                   variant="outline"
//                   size="sm"
//                 >
//                   Back to Client Search
//                 </Button>
//               </div>
//               <WalkinClientDetailBox
//                 onDataChange={handleWalkInDataChange}
//                 data={walkInData}
//               />
//             </div>
//           )}

//           {/* Show details only if a client is selected */}
//           {selectedClient && (
//             <div>
//               {/* Client Status Badge */}
//               <div className="mt-4">
//                 <ClientStatusBadge client={selectedClient} />
//               </div>

//               {/* Show warning if client is blocked */}
//               {isClientBlocked && (
//                 <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//                   <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
//                   <div>
//                     <p className="text-red-800 font-medium">Client Suspended</p>
//                     <p className="text-red-700 text-sm">
//                       This client has been suspended and cannot make new
//                       transactions. Please contact management to reactivate the
//                       client before proceeding.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <ClientDisplayBox
//                 clientName={selectedClient.name}
//                 phoneNumber={selectedClient.phone}
//                 address={selectedClient.address}
//                 balance={selectedClient.balance}
//               />
//             </div>
//           )}

//           {/* Show warning if client is blocked */}
//           {/* {isClientBlocked && (
//             <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//               <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
//               <div>
//                 <p className="text-red-800 font-medium">Client Suspended</p>
//                 <p className="text-red-700 text-sm">
//                   This client has been suspended and cannot make new
//                   transactions. Please contact management to reactivate the
//                   client before proceeding.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Show details only if a client is selected *
//           {selectedClient && (
//             <ClientDisplayBox
//               clientName={selectedClient.name}
//               phoneNumber={selectedClient.phone}
//               address={selectedClient.address}
//               balance={selectedClient.balance}
//             />
//           )} */}

//           {/* Show walk-in client summary if walk-in is active and data is entered */}
//           {isWalkIn && walkInData.name && (
//             <div className="mt-4 p-4 border border-[#D9D9D9] rounded-lg bg-[#F8F9FA]">
//               <h6 className="font-medium text-[#333333]">Walk-in Client</h6>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
//                 <p>Name: {toSentenceCaseName(walkInData.name)}</p>
//                 {walkInData.phone && <p>Phone: {walkInData.phone}</p>}
//               </div>
//             </div>
//           )}

//           {/* add product - only show if client is not blocked or if it's a walk-in */}
//           {(!selectedClient || !isClientBlocked || isWalkIn) && (
//             <div className="mt-7">
//               <AddSaleProduct
//                 rows={rows}
//                 setRows={setRows}
//                 emptyRow={emptyRow}
//                 onDiscountReasonChange={setDiscountReason}
//                 discountReason={discountReason}
//               />
//             </div>
//           )}
//         </div>

//         {/* payment method - only show if client is not blocked or if it's a walk-in */}
//         {(!selectedClient || !isClientBlocked || isWalkIn) && (
//           <div className="p-5 my-7 border border-[#D9D9D9] rounded-[8px]">
//             <h5 className="text-[var(--cl-text-dark)] text-xl font-medium mb-4">
//               Payment Details
//             </h5>

//             <div className="flex gap-6 flex-wrap">
//               <div className="">
//                 <Label className="text-[#333333] text-sm font-medium mb-2 block">
//                   Payment Method
//                 </Label>
//                 <Select
//                   value={paymentMethod}
//                   onValueChange={(val) => {
//                     setPaymentMethod(val);
//                     setSubMethod(""); // reset subselect when changing main payment methos
//                   }}
//                 >
//                   <SelectTrigger className="w-[180px] bg-[#D9D9D9] border border-[#D9D9D9]">
//                     <SelectValue placeholder="Select Payment Type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="cash">Cash</SelectItem>
//                     <SelectItem value="transfer">Transfer</SelectItem>
//                     <SelectItem value="bank">Bank</SelectItem>
//                     <SelectItem value="pos">P.O.S</SelectItem>
//                     <SelectItem value="balance">From Balance</SelectItem>
//                     <SelectItem value="credit">On Credit</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               {/* sub select for bank, transfer or POS */}

//               {["bank", "transfer", "pos"].includes(paymentMethod) && (
//                 <div>
//                   <Label className="text-[#333333] text-sm font-medium mb-2 block">
//                     Choose bank
//                   </Label>
//                   <Select value={subMethod} onValueChange={setSubMethod}>
//                     <SelectTrigger className="w-[180px] bg-[#D9D9D9] border border-[#D9D9D9]">
//                       <SelectValue
//                         placeholder={`Select ${
//                           paymentMethod === "bank" ? "Bank" : "POS"
//                         }`}
//                       />
//                     </SelectTrigger>
//                     <SelectContent position="popper">
//                       {getSubList().map((name) => (
//                         <SelectItem key={name} value={name}>
//                           {name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}

//               {/* Show bank name input for bank/transfer payments */}
//               {/* {(paymentMethod === "bank" || paymentMethod === "transfer") && (
//                 <div>
//                   <Label className="text-[#333333] text-sm font-medium mb-2 block">
//                     Bank Name
//                   </Label>
//                   <Input
//                     type="text"
//                     placeholder="Enter bank name"
//                     className="w-40"
//                     value={bankName}
//                     onChange={(e) => setBankName(e.target.value)}
//                   />
//                 </div>
//               )} */}

//               <div>
//                 <Label className="text-[#333333] text-sm font-medium mb-2 block">
//                   Amount Paid
//                 </Label>
//                 <Input
//                   type="number"
//                   placeholder="0.00"
//                   className="w-40"
//                   value={amountPaid}
//                   onChange={(e) => setAmountPaid(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Optional notes field */}
//             {/* <div className="mt-4">
//               <Label className="text-[#333333] text-sm font-medium mb-2 block">
//                 Additional Notes (Optional)
//               </Label>
//               <Input
//                 type="text"
//                 placeholder="Enter any additional notes"
//                 className="w-full max-w-md"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//             </div> */}

//             <p className="mt-3 text-sm">
//               Status: <span className="text-[#7D7D7D]">{statusMessage}</span>
//             </p>
//           </div>
//         )}

//         {/* buttons */}
//         <div className="flex gap-3 items-center">
//           <Button
//             variant="outline"
//             type="button"
//             onClick={handleResetClient}
//             className="w-30 border-[#7D7D7D] text-[#444444]"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             className=" text-white"
//             disabled={isSubmitting || !canSubmit()}
//           >
//             {isSubmitting ? "Processing..." : "Complete Sales"}
//           </Button>
//         </div>
//       </section>

//       {showReceipt && receiptData && (
//         <Modal
//           size="xxl"
//           isOpen={showReceipt}
//           onClose={() => setShowReceipt(false)}
//         >
//           {/* <SalesReceipt
//             data={receiptData}
//             onClose={() => setShowReceipt(false)}
//           /> */}

//           <SalesReceipt transaction={receiptData} />
//         </Modal>
//       )}
//     </main>
//   );
// }

// export default NewSales;
