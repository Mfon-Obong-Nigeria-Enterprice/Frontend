import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createTransaction } from "@/services/transactionService";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import type { Client, CreateTransactionPayload } from "@/types/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";

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
  //   const { addPayment } = useClientStore();
  const { addTransaction } = useTransactionsStore();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isProcessing, setIsProcessing] = useState(false);

  const newBalance = useMemo(() => {
    const currentBalance = client?.balance ?? 0;
    const paymentAmount = Number(amount) || 0;

    return currentBalance + paymentAmount;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onPaymentSuccess();
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setIsProcessing(true);
    try {
      //   addPayment(client._id, Number(amount));

      const transactionData: CreateTransactionPayload = {
        type: "DEPOSIT",
        amount: Number(amount),
        total: Number(amount),
        description: reference || "Payment received",
        paymentMethod,
        reference: `TXN${Date.now()}`,
      };
      await createTransactionMutation.mutateAsync({
        clientId: client._id,
        transaction: transactionData,
      });
      // Add to transactions store
      addTransaction({
        ...transactionData,
        clientId: {
          _id: client._id,
          phone: client.phone,
          name: client.name,
        },
        createdAt: new Date().toISOString(),
        status: "COMPLETED",
        type: "DEPOSIT",
        total: Number(amount),

        // Add other required fields based on your Transaction type
      });

      setAmount(0);
      setReference("");
      setPaymentMethod("Cash");
    } catch (error) {
      console.error("Payment processing failed:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className=" border-b-2 pb-4 border-[#D9D9D9] text-start text-[#1E1E1E] font-medium font-Inter flex-shrink-0">
          <DialogTitle>Process Debt Payment</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto space-y-4"
          id="payment-form"
        >
          <div
            className={` border border-l-[6px]   ${
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
                {/* <MapPin size={14} /> */}
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                Payment Amount
              </label>
              <input
                disabled={isProcessing}
                required
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                disabled={isProcessing}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
                <option value="POS">POS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#1E1E1E] font-Inter">
                Reference/note
              </label>
              <textarea
                disabled={isProcessing}
                rows={4}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full p-2 border rounded-lg"
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
                  <p
                    className={`${
                      amount < 0
                        ? " text-[#F95353]"
                        : amount > 0
                        ? " text-[#2ECC71]"
                        : " text-[#7d7d7d]"
                    }`}
                  >
                    {formatCurrency(amount)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p>New Balance:</p>
                <p>{formatCurrency(newBalance)}</p>
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
                disabled={isProcessing}
                className="bg-[#2ECC71] hover:bg-[#27ae60]"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
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
