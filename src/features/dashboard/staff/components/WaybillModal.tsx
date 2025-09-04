import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

// Import the waybill service
import { generateWaybill, type WaybillError } from "@/services/waybillService";

// Types based on your transaction structure
interface Transaction {
  _id: string;
  clientId?: { name: string };
  walkInClientName?: string;
  items: Array<{
    quantity: number;
    productName: string;
  }>;
  total: number;
  createdAt: string;
}

interface WaybillModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onWaybillGenerated?: (transactionId: string) => void; // Optional callback for success
}

const WaybillModal = ({
  isOpen,
  onClose,
  transactions,
  onWaybillGenerated,
}: WaybillModalProps) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get recent transactions (last 10)
  const recentTransactions = transactions
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 15);

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDropdownOpen(false);
  };

  const handleSaveWaybill = async () => {
    if (!selectedTransaction) {
      toast.error("Please select a transaction first");
      return;
    }

    setIsLoading(true);

    try {
      const result = await generateWaybill(selectedTransaction._id);

      // Success - close modal and reset state
      onClose();
      setSelectedTransaction(null);

      // Show success message
      toast.success(result.message || "Waybill generated successfully");

      // Call optional callback with transaction ID
      if (onWaybillGenerated) {
        onWaybillGenerated(selectedTransaction._id);
      }

      console.log("Waybill generated:", result.data);
    } catch (error) {
      const waybillError = error as WaybillError;

      // Show specific error message
      toast.error(waybillError.message || "Failed to generate waybill");

      // Log error details for debugging
      console.error("Error generating waybill:", {
        message: waybillError.message,
        status: waybillError.status,
        transactionId: selectedTransaction._id,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedTransaction(null);
    setIsDropdownOpen(false);
  };

  const handleModalClick = () => {
    // Close dropdown if clicking outside of it
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#4444] bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleModalClick}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-[#1E1E1E] font-Inter">
            Add Waybill
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Client Name Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#333333] mb-2">
            Clients Name
          </label>
          <div className="relative" onClick={handleDropdownClick}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
              className="w-full p-3 border border-[#D9D9D9] rounded-md text-left bg-white hover:border-[#3D80FF] focus:border-[#3D80FF] focus:outline-none flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span
                className={
                  selectedTransaction ? "text-[#333333]" : "text-[#999999]"
                }
              >
                {selectedTransaction
                  ? selectedTransaction.clientId?.name ||
                    selectedTransaction.walkInClientName
                  : "Select recent transaction"}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && !isLoading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D9D9D9] rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <button
                      key={transaction._id}
                      onClick={() => handleTransactionSelect(transaction)}
                      className="w-full p-3 text-left hover:bg-[#F5F5F5] border-b border-[#F0F0F0] last:border-b-0 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[#333333] font-medium truncate mr-2">
                          {transaction.clientId?.name ||
                            transaction.walkInClientName}
                        </span>
                        <span className="text-[#666666] text-sm whitespace-nowrap">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[#888888] text-sm mt-1 truncate">
                        {transaction.items.length > 0 && (
                          <span>
                            {transaction.items[0].quantity}x{" "}
                            {transaction.items[0].productName}
                            {transaction.items.length > 1 &&
                              ` +${transaction.items.length - 1} more`}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-[#999999] text-center">
                    No recent transactions found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Waybill Number */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#333333] mb-2">
            Waybill Number
          </label>
          <input
            type="text"
            placeholder="Auto-generated"
            disabled
            className="w-full p-3 border border-[#D9D9D9] rounded-md bg-[#F9F9F9] text-[#999999] cursor-not-allowed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={isLoading}
            className="flex-1 h-12 border-[#D9D9D9] text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveWaybill}
            disabled={!selectedTransaction || isLoading}
            className="flex-1 h-12 bg-[#4CD964] hover:bg-[#45C55A] text-white disabled:bg-[#CCCCCC] disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Saving..." : "Save Waybill"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaybillModal;
