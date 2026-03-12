import React from "react";
import { X, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PaymentConfirmationData = {
  clientName: string;
  currentBalance: number;
  paymentAmount: number;
  newBalance: number;
  paymentMethod: string;
  reference?: string;
  description?: string;
};

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: PaymentConfirmationData;
  isProcessing?: boolean;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return `₦${Math.abs(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const isDebt = data.currentBalance < 0;
  const willBeCleared = data.newBalance >= 0;
  const balanceChange = data.newBalance - data.currentBalance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Confirm Payment
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-amber-900 font-medium text-xs sm:text-sm">
              Important: Review Before Confirming
            </p>
            <p className="text-amber-700 text-xs sm:text-sm mt-1">
              This payment cannot be reversed after confirmation. Please verify all details carefully.
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
          {/* Client Name */}
          <div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Client</p>
            <p className="font-semibold text-base sm:text-lg text-gray-900">{data.clientName}</p>
          </div>

          {/* Payment Details Card */}
          <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Amount</span>
              <span className="font-bold text-green-600 text-base sm:text-lg">
                {formatCurrency(data.paymentAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900">{data.paymentMethod}</span>
            </div>

            {data.reference && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Reference</span>
                <span className="font-mono text-xs text-gray-700">{data.reference}</span>
              </div>
            )}

            {data.description && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{data.description}</p>
              </div>
            )}
          </div>

          {/* Balance Summary */}
          <div className="border border-blue-200 rounded-lg p-3 sm:p-4 bg-blue-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Current Balance</span>
              <span className={`font-semibold text-sm sm:text-base ${
                isDebt ? "text-red-600" : "text-green-600"
              }`}>
                {isDebt && "-"}{formatCurrency(data.currentBalance)}
              </span>
            </div>

            <div className="flex items-center justify-center py-2">
              {balanceChange >= 0 ? (
                <TrendingUp className="text-green-500" size={24} />
              ) : (
                <TrendingDown className="text-red-500" size={24} />
              )}
            </div>

            <div className="pt-3 border-t border-blue-300 flex justify-between items-center">
              <span className="font-semibold text-gray-900 text-sm sm:text-base">New Balance</span>
              <span className={`font-bold text-base sm:text-xl ${
                data.newBalance < 0 ? "text-red-600" : "text-green-600"
              }`}>
                {data.newBalance < 0 && "-"}{formatCurrency(data.newBalance)}
              </span>
            </div>

            {willBeCleared && isDebt && (
              <div className="pt-2 bg-green-100 border border-green-300 rounded-md p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-green-800 font-medium text-center">
                  ✓ This payment will clear the outstanding debt!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto sm:flex-1 order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full sm:w-auto sm:flex-1 bg-green-600 hover:bg-green-700 text-white order-1 sm:order-2"
          >
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;
