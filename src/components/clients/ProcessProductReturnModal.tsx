import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, Minus, Plus, ChevronDown } from 'lucide-react';
import type { Transaction } from '@/types/transactions';
import { getTransactionDate } from '@/utils/transactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReturnTransaction, type ReturnTransactionItem } from '@/services/transactionService';
import { toast } from 'sonner';

// Infer the item type from the Transaction's items array
type TransactionItem = Transaction['items'][number];

interface ReturnedItemInfo extends ReturnTransactionItem {
  unitPrice: number;
}

interface ProductReturnCardProps {
  item: TransactionItem;
  returnedQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductReturnCard: React.FC<ProductReturnCardProps> = ({ item, returnedQuantity, onQuantityChange }) => {
  const handleIncrement = () => {
    onQuantityChange(Math.min(returnedQuantity + 1, item.quantity));
  };

  const handleDecrement = () => {
    onQuantityChange(Math.max(returnedQuantity - 1, 0));
  };

  const returnAmount = item.unitPrice * returnedQuantity;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={returnedQuantity > 0}
            onChange={(e) => onQuantityChange(e.target.checked ? 1 : 0)}
          />
          <div>
            <h3 className="text-base font-semibold text-[#7D7D7D]">{item.productName}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.quantity} {item.unit || 'units'}</p>
            <p className="text-sm text-gray-500 mt-1">₦{item.unitPrice.toLocaleString()}/{item.unit || 'unit'}</p>
          </div>
        </div>
        <span className="text-base font-semibold text-[#7D7D7D]">₦{item.subtotal.toLocaleString()}</span>
      </div>

      <hr className="my-4 border-gray-200" />

      <div className="flex justify-between items-end">
        <div>
          <label className="block text-sm text-gray-500 mb-2">Quantity to Return</label>
          <div className="flex items-center gap-2">
            <button onClick={handleDecrement} className="p-2 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-500">
              <Minus size={16} />
            </button>
            <div className="relative">
              <input
                type="text"
                value={returnedQuantity}
                readOnly
                className="w-16 border border-gray-300 rounded p-2 text-center text-gray-700 focus:outline-none"
              />
            </div>
            <button onClick={handleIncrement} className="p-2 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-500">
              <Plus size={16} />
            </button>
            <span className="text-sm text-gray-500 ml-2">
              {item.unit || 'units'} Max {item.quantity}
            </span>
          </div>
        </div>

        <div className="text-right">
          <label className="block text-sm text-gray-500 mb-2">Return Amount:</label>
          <div className="bg-gray-100 py-2 px-4 rounded text-gray-500 font-medium">
            ₦{returnAmount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProcessProductReturnModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const ProcessProductReturnModal: React.FC<ProcessProductReturnModalProps> = ({ isOpen, onClose, transaction }) => {
  const queryClient = useQueryClient();
  const [returnedItems, setReturnedItems] = useState<Record<string, ReturnedItemInfo>>({});
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [actualAmountReturned, setActualAmountReturned] = useState<number | string>('');

  const returnMutation = useMutation({
    mutationFn: createReturnTransaction,
    onSuccess: () => {
      toast.success("Return processed successfully!");
      // Invalidate queries to refetch client and transaction data.
      // We add a guard here to ensure clientId exists before invalidating.
      if (transaction?.clientId?._id) {
        queryClient.invalidateQueries({ queryKey: ['client', transaction.clientId._id] });
      }
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      handleClose();
    },
    onError: (error) => {
      toast.error(`Failed to process return: ${error.message}`);
    }
  });

  const handleQuantityChange = (item: TransactionItem, quantity: number) => {
    setReturnedItems(prev => {
      const newItems = { ...prev };
      if (quantity > 0) {
        newItems[item.productId] = {
          productId: item.productId,
          quantity,
          unit: item.unit || 'unit',
          unitPrice: item.unitPrice,
        };
      } else {
        delete newItems[item.productId];
      }
      return newItems;
    });
  };

  const calculatedTotalReturn = useMemo(() => {
    return Object.values(returnedItems).reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }, [returnedItems]);

  if (!isOpen || !transaction) return null;

  const handleClose = () => {
    // Reset state on close
    setReturnedItems({});
    setReason('');
    setNotes('');
    setActualAmountReturned('');
    onClose();
  };

  const handleSubmit = () => {
    if (!transaction.clientId?._id) {
      toast.error("Client information is missing.");
      return;
    }

    const itemsToSubmit: ReturnTransactionItem[] = Object.values(returnedItems).map(({ productId, quantity, unit }) => ({
      productId,
      quantity,
      unit,
    }));

    if (itemsToSubmit.length === 0) {
      toast.warning("Please select at least one item to return.");
      return;
    }

    if (!reason) {
      toast.warning("Please select a reason for the return.");
      return;
    }

    const finalAmountReturned = typeof actualAmountReturned === 'number' ? actualAmountReturned : calculatedTotalReturn;

    returnMutation.mutate({
      clientId: transaction.clientId._id,
      type: "RETURN",
      reason,
      referenceTransactionId: transaction._id,
      items: itemsToSubmit,
      actualAmountReturned: finalAmountReturned,
      notes,
    });
  };

  const transactionDate = getTransactionDate(transaction);
  const formattedDate = transactionDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-none flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-[505px] max-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-[18px] font-bold text-[#1E1E1E]">Process Product Return</h2>
            <p className="text-sm text-[#7D7D7D] mt-1">
              Transaction: {transaction.invoiceNumber || `TXN-${transaction._id.slice(-6)}`} - {formattedDate}
            </p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8 overflow-y-auto flex-grow min-h-0">
          {/* Select Item Section */}
          <div>
            <h3 className="text-base font-semibold text-[#444444] mb-4">
              Select Item to return
            </h3>
            <div className="space-y-4">
              {transaction.items && transaction.items.length > 0 ? (
                transaction.items.map((item, index) => (
                  <ProductReturnCard
                    key={`${item.productId}-${index}`}
                    item={item}
                    returnedQuantity={returnedItems[item.productId]?.quantity || 0}
                    onQuantityChange={(quantity) => handleQuantityChange(item, quantity)}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No items available for return in this transaction.</p>
              )}
            </div>
          </div>

          {/* Return Reason Section */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Return Reason
            </h3>
            <div className="relative">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="block w-full pl-4 pr-10 py-3 text-base border-none rounded-lg bg-gray-100 text-gray-500 appearance-none focus:outline-none focus:ring-0 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled hidden>
                  Select a reason
                </option>
                <option value="damaged">Damaged</option>
                <option value="wrong_item">Wrong Item</option>
                <option value="customer_changed_mind">Customer changed mind</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Notes and Actual Amount Returned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Notes <span className="text-gray-400 font-normal">(optional)</span>
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any extra details about the return..."
                className="block w-full p-3 text-base border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#7D7D7D] mb-4">
                Actual Amount Returned
              </h3>
              <p className="text-xs text-gray-500 mb-2">Override the calculated amount if needed. Leave blank to use the calculated total.</p>
              <input
                type="number"
                value={actualAmountReturned}
                onChange={(e) => setActualAmountReturned(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={`Calc: ₦${calculatedTotalReturn.toLocaleString()}`}
                className="block w-full p-3 text-base border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 mt-auto bg-white sticky bottom-0">
            <div className="flex justify-end gap-4">
                <button onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={returnMutation.isPending}
                  className="px-4 py-2 bg-[#2ECC71] text-white rounded hover:bg-green-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {returnMutation.isPending ? 'Submitting...' : 'Submit Return'}
                </button>
            </div>
        </div>
      </div>
    </div>
  , document.body);
};

export default ProcessProductReturnModal;