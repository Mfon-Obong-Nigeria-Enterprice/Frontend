/** @format */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createTransaction } from "@/services/transactionService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import type { Transaction } from "@/types/transactions";
import type { Client, CreateTransactionPayload } from "@/types/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

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
  const { addPayment } = useClientStore();
  const { addTransaction } = useTransactionsStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isProcessing, setIsProcessing] = useState(false);

  const newBalance = useMemo(() => {
    const currentBalance = client?.balance ?? 0;
    const paymentAmount = Number(amount) || 0;

    return currentBalance + paymentAmount; // Fixed: Add payment to reduce debt
  }, [client?.balance, amount]);

  //Mutation to create transaction via API
  const createTransactionMutation = useMutation({
    mutationFn: ({
      clientId,
      transaction,
    }: {
      clientId: string;
      transaction: CreateTransactionPayload;
    }) => createTransaction(clientId, transaction),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      //
      if (response) {
        const newTransaction: Transaction = {
          userId: {
            _id: user?.id || "",
            name: user?.name || "",
          },
          _id: response.id,
          type: "DEPOSIT" as const,
          status: "completed",
          items: [],
          amount: Number(amount),
          total: Number(amount),
          amountPaid: Number(amount),
          paymentMethod,
          clientId: {
            _id: client._id,
            phone: client.phone || "",
            name: client.name,
            balance: "",
          },
          client: client,
          createdAt: new Date().toISOString(),
          reference: `TXN${Date.now()}`,
        };
        addTransaction(newTransaction);
        if (addPayment) {
          addPayment(client._id, newBalance);
        }
      }
      toast.success(
        `Payment of ₦${formatCurrency(amount)} processed successfully!`
      );
      onPaymentSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to process payment. Please try again." + error);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    // Check if payment is greater than debt
    if (client.balance < 0 && amount > Math.abs(client.balance)) {
      const proceed = confirm(
        `Payment amount (${formatCurrency(
          amount
        )}) is greater than the outstanding debt (${formatCurrency(
          Math.abs(client.balance)
        )}). This will result in a credit balance. Continue?`
      );
      if (!proceed) return;
    }

    setIsProcessing(true); // Set processing state immediately after validation

    try {
      const transactionData: CreateTransactionPayload = {
        type: "DEPOSIT",
        amount: Number(amount),
        total: Number(amount),
        amountPaid: Number(amount), // Added amountPaid field
        paymentMethod,
        reference: reference || `TXN${Date.now()}`,
        description: description || `Payment for ${client.name}`, // Added description field
      };

      await createTransactionMutation.mutateAsync({
        clientId: client._id,
        transaction: transactionData,
      });

      // Reset form
      setAmount(0);
      setReference("");
      setDescription("");
      setPaymentMethod("Cash");
    } catch (error) {
      toast.error("Failed to process payment. Please try again." + error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto px-6">
        <DialogHeader className=" border-b-2 pb-4 border-[#D9D9D9] text-start text-[#1E1E1E] font-medium font-Inter flex-shrink-0">
          <DialogTitle>Process Debt Payment</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto space-y-4"
          id="payment-form"
        >
          <div
            className={`border border-l-[6px]   ${
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
                  <span className="text-[#444444]">Client:</span>
                  <span className="text-[#444444] font-medium">
                    {client.name}
                  </span>
                </div>
                <div>
                  <p className="flex gap-1 items-center text-[#444444] text-sm">
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
              <p className={`font-normal text-base`}>
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
                Payment Amount *
              </label>
              <input
                disabled={isProcessing}
                required
                type="number"
                min="0.01"
                step="0.01"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                disabled={isProcessing}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
                <option value="POS">POS</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {/* Added Description Field */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                Description
              </label>
              <textarea
                disabled={isProcessing}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Payment description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                Reference/note
              </label>
              <input
                disabled={isProcessing}
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Transaction reference (optional)"
              />
            </div>

            <div className="rounded-lg bg-[#F5F5F5] px-5 py-4">
              <div className="space-y-4 border-b-1 pb-4 border-[#D9D9D9]">
                <div className="flex justify-between items-center">
                  <p>Current Balance:</p>
                  <p
                    className={`${
                      client?.balance < 0
                        ? " text-[#F95353]"
                        : client?.balance > 0
                        ? " text-[#2ECC71]"
                        : " text-[#7d7d7d]"
                    }`}
                  >
                    {formatCurrency(client?.balance ?? 0)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Payment Amount:</p>
                  <p className="text-[#2ECC71]">+{formatCurrency(amount)}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <p className="font-semibold">New Balance:</p>
                <p
                  className={`font-semibold ${
                    newBalance < 0
                      ? " text-[#F95353]"
                      : newBalance > 0
                      ? " text-[#2ECC71]"
                      : " text-[#7d7d7d]"
                  }`}
                >
                  {formatCurrency(newBalance)}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                type="button"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing || !amount || amount <= 0}
                className="bg-[#2ECC71] hover:bg-[#27ae60] disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Process Payment"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
