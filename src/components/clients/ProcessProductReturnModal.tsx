import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, Minus, Plus, ChevronDown } from 'lucide-react';
import type { Transaction } from '@/types/transactions';
import { getTransactionDate } from '@/utils/transactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReturnTransaction, type ReturnTransactionItem } from '@/services/transactionService';
import { toast } from 'react-toastify';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty string to let user clear the input, otherwise default to 0
    let val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    
    if (isNaN(val)) val = 0;
    
    // Clamp value between 0 and max quantity
    val = Math.max(0, Math.min(val, item.quantity));
    
    onQuantityChange(val);
  };

  const returnAmount = item.unitPrice * returnedQuantity;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
      {/* Checkbox and Item Details */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={returnedQuantity > 0}
            onChange={(e) => onQuantityChange(e.target.checked ? 1 : 0)}
          />
          <div>
            <h3 className="text-base font-semibold text-[#333333]">{item.productName}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.quantity} {item.unit || 'units'}</p>
            <p className="text-sm text-gray-500 mt-1">₦{item.unitPrice.toLocaleString()}/{item.unit || 'unit'}</p>
          </div>
        </div>
        <span className="text-base font-bold text-[#333333]">₦{item.subtotal.toLocaleString()}</span>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Controls Row */}
      <div className="flex justify-between items-end">
        
        {/* Quantity Controls */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Quantity to Return</label>
          <div className="flex items-center gap-2">
            {/* Minus Button */}
            <button 
              onClick={handleDecrement} 
              className="w-[34px] h-[34px] flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <Minus size={14} />
            </button>

            {/* Input with internal steppers */}
            <div className="relative">
              <input
                type="number"
                value={returnedQuantity.toString()} // toString removes leading zeros if any
                onChange={handleInputChange}
                min={0}
                max={item.quantity}
                className="w-[70px] h-[34px] border border-[#D9D9D9] rounded pl-2 pr-6 text-left text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute right-0 top-0 h-full flex flex-col border border-[#D9D9D9]">
                <button onClick={handleIncrement} className="h-1/2 px-1.5 flex items-center justify-center hover:bg-gray-100 border-b border-gray-300 rounded-tr-sm">
                  <ChevronDown size={12} className="rotate-180 text-gray-500" />
                </button>
                <button onClick={handleDecrement} className="h-1/2 px-1.5 flex items-center justify-center hover:bg-gray-100 rounded-br-sm">
                  <ChevronDown size={12} className="text-gray-500" />
                </button>
              </div>
            </div>


            {/* Plus Button */}
            <button 
              onClick={handleIncrement} 
              className="w-[34px] h-[34px] flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <Plus size={14} />
            </button>

            {/* Stacked Helper Text (Unit & Max) */}
            <div className="flex flex-col justify-center ml-1 leading-tight">
              <span className="text-xs text-gray-500">{item.unit || 'units'}</span>
              <span className="text-xs text-gray-400">Max {item.quantity}</span>
            </div>
          </div>
        </div>

        {/* Return Amount Display */}
        <div className="text-right">
          <label className="block text-xs text-gray-500 mb-1.5">Return Amount:</label>
          <div className="bg-[#F5F5F5] h-[34px] flex items-center px-3 rounded text-sm text-gray-500 font-medium min-w-[100px]">
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

  const returnMutation = useMutation({
    mutationFn: createReturnTransaction,
    onSuccess: () => {
      toast.success("Return processed successfully!");
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

  const totalItemsSelected = Object.keys(returnedItems).length;

  if (!isOpen || !transaction) return null;

  const handleClose = () => {
    setReturnedItems({});
    setReason('');
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

    returnMutation.mutate({
      clientId: transaction.clientId._id,
      type: "RETURN",
      reason,
      referenceTransactionId: transaction._id,
      items: itemsToSubmit,
      actualAmountReturned: calculatedTotalReturn,
      notes: '', 
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
        <div className="p-6 overflow-y-auto flex-grow min-h-0">
          {/* Select Item Section */}
          <div className="mb-8">
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
            <h3 className="text-[#444444] text-base font-normal mb-2">
              Return Reason
            </h3>
            <div className="relative">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="block w-full pl-4 pr-10 py-3 text-sm border-none rounded bg-[#F5F5F5] text-[#7D7D7D] appearance-none focus:outline-none focus:ring-0 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled hidden>
                  Select a reason
                </option>
                <option value="damage_defective">Damage/Defective product</option>
                <option value="wrong_item">Wrong item delivered</option>
                <option value="customer_request">Customer request</option>
                <option value="quality_issue">Quality issue</option>
                <option value="excess_order">Excess order</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Items Selected Summary Box */}
          <div className="bg-[#F9FAFB] rounded-lg p-4 mt-6 flex justify-between items-center">
             <div className="flex flex-col gap-1">
                <span className="text-xs text-[#7D7D7D]">Items Selected:</span>
                <span className="text-base font-medium text-[#333333]">Return Amount:</span>
             </div>
             <div className="flex flex-col gap-1 text-right">
                <span className="text-xs text-[#333333]">{totalItemsSelected} item(s)</span>
                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                    <span className="text-sm font-medium text-[#7D7D7D]">₦{calculatedTotalReturn.toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>
        
        {/* Footer Buttons */}
        <div className="p-6 pt-2 mt-auto bg-white sticky bottom-0">
            <div className="flex justify-end gap-4">
                <button 
                    onClick={handleClose} 
                    className="px-8 py-3 border border-[#9CA3AF] rounded-md text-[#333333] font-medium text-sm hover:bg-gray-50 w-full sm:w-auto"
                >
                    Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={returnMutation.isPending}
                  className="px-6 py-3 bg-[#2ECC71] text-white rounded-md font-medium text-sm hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {returnMutation.isPending ? 'Processing...' : 'Process Return'}
                </button>
            </div>
        </div>
      </div>
    </div>
  , document.body);
};

export default ProcessProductReturnModal;