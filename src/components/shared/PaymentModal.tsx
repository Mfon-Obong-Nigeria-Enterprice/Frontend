/** @format */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddClientPayment } from "@/services/transactionService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import type { Transaction } from "@/types/transactions";
import type { Client } from "@/types/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { bankNames, posNames } from "@/data/banklist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { AlertTriangle } from "lucide-react";

type PaymentModalProps = {
  client: Client;
  onClose: () => void;
  onPaymentSuccess: () => void;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  client,
  onClose,
  onPaymentSuccess,
}) => {
  const { updateClient } = useClientStore();
  const { addTransaction } = useTransactionsStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(0);
  const [amountDisplay, setAmountDisplay] = useState("₦0");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [subMethod, setSubMethod] = useState("");
  const [bankSearch, setBankSearch] = useState("");

  const getSubList = () =>
    paymentMethod === "POS" ? posNames : bankNames;

  const formattedPaymentMethod = () => {
    if (paymentMethod === "Cash" || !subMethod) return paymentMethod;
    if (paymentMethod === "POS") return `POS - ${subMethod}`;
    return `${paymentMethod} to ${subMethod}`;
  };

  // Format currency display with Naira symbol and commas
  const formatCurrencyDisplay = (value: string) => {
    if (!value) return "₦0";
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly === "") return "₦0";
    const numericValue = parseFloat(digitsOnly);
    return `₦${numericValue.toLocaleString("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const numericValue = digitsOnly === "" ? 0 : parseFloat(digitsOnly);
    setAmount(numericValue);
    setAmountDisplay(formatCurrencyDisplay(digitsOnly));
  };

  const newBalance = useMemo(() => {
    const currentBalance = client?.balance ?? 0;
    const paymentAmount = Number(amount) || 0;
    return currentBalance + paymentAmount;
  }, [client?.balance, amount]);

  // Mutation to create transaction via API
  const createTransactionMutation = useMutation({
    mutationFn: (transactionData: {
      type: "DEPOSIT";
      amount: number;
      paymentMethod: string;
      reference: string;
      description: string;
      clientId: string;
    }) => AddClientPayment(transactionData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["client", client._id] });
      queryClient.invalidateQueries({
        queryKey: ["clientTransactions", client._id],
      });

      if (response) {
        const newTransaction: Transaction = {
          userId: {
            _id: user?.id || "",
            name: user?.name || "",
          },
          _id: response._id,
          type: "DEPOSIT" as const,
          status: "completed",
          items: [],
          amount: Number(amount),
          total: Number(amount),
          amountPaid: Number(amount),
          subtotal: Number(amount),
          discount: 0,
          paymentMethod: formattedPaymentMethod(),
          clientId: {
            _id: client._id,
            phone: client.phone || "",
            name: client.name,
            balance: newBalance,
          },
          client: {
            ...client,
            balance: newBalance,
          },
          createdAt: response.createdAt || new Date().toISOString(),
          reference: reference || response.reference || `TXN${Date.now()}`,
          description:
            description || response.description || `Payment for ${client.name}`,
        };

        addTransaction(newTransaction);

        if (updateClient) {
          updateClient(client._id, {
            balance: newBalance,
            lastTransactionDate: new Date().toISOString(),
          });
        }
      }

      toast.success(
        `Payment of ${formatCurrency(amount)} processed successfully!`
      );
      onPaymentSuccess();
      onClose();
    },
    onError: (error) => {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment. Please try again.");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.warn("Please enter a valid payment amount");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      await createTransactionMutation.mutateAsync({
        type: "DEPOSIT" as const,
        amount: Number(amount),
        paymentMethod: formattedPaymentMethod(),
        reference: reference || `TXN${Date.now()}`,
        description: description || `Payment for ${client.name}`,
        clientId: client._id,
      });
    } catch (error) {
      console.error("Payment processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto px-6" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="border-b-2 pb-4 border-[#D9D9D9] text-start text-[#1E1E1E] font-medium font-Inter flex-shrink-0">
          <DialogTitle>
            {showConfirmation
              ? "Confirm Payment"
              : client.balance < 0
              ? "Process Debt Payment"
              : "Add Credit"}
          </DialogTitle>
        </DialogHeader>

        {!showConfirmation ? (
          /* ── FORM SCREEN ── */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`border border-l-[6px] ${
                client?.balance !== null &&
                typeof client?.balance === "number" &&
                client?.balance < 0
                  ? "border-[#DA251C] bg-[#FFE9E9] text-[#F95353]"
                  : client?.balance > 0
                  ? "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]"
                  : "border-[#7d7d7d] bg-[#f6f6f6] text-[#7d7d7d]"
              } mt-7 mb-2 px-3 py-4 rounded-[0.875rem]`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#444444]">Client: </span>
                    <span className="text-[#444444] font-medium">
                      {client.name}
                    </span>
                  </div>
                  <div>
                    <p className="flex gap-1 items-center text-[#444444] text-sm">
                      <span className="text-[#444444]">Phone: </span>
                      <span>{client.phone}</span>
                    </p>
                  </div>
                </div>
                <address className="flex gap-0.5 items-center text-[#444444] text-sm">
                  <span>{client.address || "No address Provided"}</span>
                </address>
              </div>
              <div className="flex justify-between items-center">
                <p>Current Account Balance:</p>
                <p className="font-normal text-base">
                  {client?.balance && client?.balance < 0
                    ? "-"
                    : client.balance > 0
                    ? "+"
                    : ""}
                  ₦
                  {Math.abs(client?.balance ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-4 px-2">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={amountDisplay}
                  onChange={handleAmountChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="₦0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setSubMethod("");
                    setBankSearch("");
                  }}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Transfer">Transfer</option>
                  <option value="POS">POS</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              {/* Bank / POS picker — shown for non-cash methods */}
              {paymentMethod !== "Cash" && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                    Choose {paymentMethod === "POS" ? "POS Terminal" : "Bank"}{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder={`Search ${paymentMethod === "POS" ? "POS" : "bank"}...`}
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
                  />
                  <div className={`border rounded-lg max-h-36 overflow-y-auto bg-white ${subMethod && bankSearch === subMethod ? "hidden" : ""}`}>
                    {getSubList()
                      .filter((name) =>
                        name.toLowerCase().includes(bankSearch.toLowerCase())
                      )
                      .map((name) => (
                        <div
                          key={name}
                          onClick={() => {
                            setSubMethod(name);
                            setBankSearch(name);
                          }}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#F5F5F5] ${
                            subMethod === name
                              ? "bg-[#E8F8EE] text-[#2ECC71] font-medium"
                              : "text-[#333333]"
                          }`}
                        >
                          {name}
                        </div>
                      ))}
                    {getSubList().filter((name) =>
                      name.toLowerCase().includes(bankSearch.toLowerCase())
                    ).length === 0 && (
                      <p className="px-3 py-2 text-sm text-gray-400">No results found</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Payment description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                  Reference/Note (optional)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Transaction reference (optional)"
                />
              </div>

              <div className="rounded-lg bg-[#F5F5F5] px-5 py-4">
                <div className="space-y-4 border-b pb-4 border-[#D9D9D9]">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Current Balance:</p>
                    <p
                      className={`font-medium ${
                        client?.balance < 0
                          ? "text-[#F95353]"
                          : client?.balance > 0
                          ? "text-[#2ECC71]"
                          : "text-[#7d7d7d]"
                      }`}
                    >
                      {formatCurrency(client?.balance ?? 0)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">Payment Amount:</p>
                    <p className="text-[#2ECC71] font-medium">
                      +{formatCurrency(amount)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <p className="font-semibold">New Balance:</p>
                  <p
                    className={`font-semibold text-lg ${
                      newBalance < 0
                        ? "text-[#F95353]"
                        : newBalance > 0
                        ? "text-[#2ECC71]"
                        : "text-[#7d7d7d]"
                    }`}
                  >
                    {formatCurrency(newBalance)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!amount || amount <= 0}
                  className="bg-[#2ECC71] hover:bg-[#27ae60] disabled:bg-gray-400"
                >
                  {client.balance < 0 ? "Process Debt Payment" : "Add Credit"}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          /* ── CONFIRMATION SCREEN ── */
          <div className="space-y-4 py-2">
            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-amber-900 font-medium text-sm">
                  Important: Review Before Confirming
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  This payment cannot be reversed after confirmation. Please verify all details carefully.
                </p>
              </div>
            </div>

            {/* Client */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Client</p>
              <p className="font-semibold text-base text-gray-900">{client.name}</p>
            </div>

            {/* Payment Details */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment Amount</span>
                <span className="font-bold text-green-600 text-base">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900">{formattedPaymentMethod()}</span>
              </div>
              {reference && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Reference</span>
                  <span className="font-mono text-xs text-gray-700">{reference}</span>
                </div>
              )}
              {description && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700">{description}</p>
                </div>
              )}
            </div>

            {/* Balance Summary */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Current Balance</span>
                <span
                  className={`font-semibold text-sm ${
                    client.balance < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatCurrency(client.balance)}
                </span>
              </div>
              <div className="pt-3 border-t border-blue-300 flex justify-between items-center">
                <span className="font-semibold text-gray-900 text-sm">New Balance</span>
                <span
                  className={`font-bold text-xl ${
                    newBalance < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatCurrency(newBalance)}
                </span>
              </div>
              {newBalance >= 0 && client.balance < 0 && (
                <div className="bg-green-100 border border-green-300 rounded-md p-2">
                  <p className="text-xs text-green-800 font-medium text-center">
                    ✓ This payment will clear the outstanding debt!
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={isProcessing}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  "Confirm Payment"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
