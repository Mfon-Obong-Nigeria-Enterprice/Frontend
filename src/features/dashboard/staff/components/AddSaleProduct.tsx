import React, { useState } from "react";
import Modal from "@/components/Modal";
import { toast } from "react-toastify";

//store
import { useInventoryStore } from "@/stores/useInventoryStore";

// ui
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import InputWithSuggestions from "@/components/ui/inputwithsuggestions";
import { Button } from "@/components/ui/button";

// icons
import { Plus } from "lucide-react";

// utils
import { formatCurrency } from "@/utils/styles";

// type
import type { Row } from "../NewSales";
// import type { Product } from "@/types/types";

interface AddSaleProductProps {
  rows: Row[];
  setRows: React.Dispatch<React.SetStateAction<Row[]>>;
  emptyRow: Row;
  onDiscountReasonChange?: (reason: string) => void;
  discountReason?: string;
}

const discountReasons = [
  "Bulk Purchase Discount",
  "Price Match Competitor's Offer",
  "Loyal Customer Discount",
  "End of the Season Clearance",
  "Damage/Defective Goods",
];

const AddSaleProduct: React.FC<AddSaleProductProps> = ({
  rows,
  setRows,
  emptyRow,
  onDiscountReasonChange,
  discountReason = "",
}) => {
  const { products } = useInventoryStore();

  const [modal, setModal] = useState<{
    isOpen: boolean;
    rowIndex: number | null;
  }>({
    isOpen: false,
    rowIndex: null,
  });

  const updateRow = (index: number, updates: Partial<Row>) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const newRow = { ...row, ...updates };
        const baseAmount = newRow.quantity * newRow.unitPrice;

        let discountAmount = 0;
        if (newRow.discountType === "percent") {
          discountAmount = (baseAmount * newRow.discount) / 100;
        } else if (newRow.discountType === "amount") {
          discountAmount = newRow.discount;
        }

        return {
          ...newRow,
          total: Math.max(baseAmount - discountAmount, 0), // no negatives
        };
      })
    );
  };

  // Filter out products that are inactive or out of stock, or already selected
  const availableProducts = products.filter(
    (product) => product.isActive && product.stock > 0
  );

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      updateRow(index, {
        productId,
        unitPrice: product?.unitPrice || 0,
        unit: product?.unit || "pcs",
        productName: product?.name || "",
      });
    } else {
      updateRow(index, {
        productId: "",
        unitPrice: 0,
        unit: "",
        productName: "",
      });
    }
  };

  // Add new row
  const addRow = () => {
    // the user cannot add a row if there's only one product
    if (availableProducts.length === 1) {
      toast.warn("You have only one product in store");
      return;
    }

    if (rows.length >= availableProducts.length) {
      toast.warn("No more products available to add");
      return;
    }

    setRows((prev) => [...prev, { ...emptyRow }]);
  };

  // open delete modal with checks
  const openDeleteModal = (index: number) => {
    // const row = rows[index];
    // const isRowEmpty =
    //   !row.productId &&
    //   row.unitPrice === 0 &&
    //   row.quantity === 1 &&
    //   row.discount === 0 &&
    //   row.total === 0;

    // if (isRowEmpty ) {
    //   toast.warn("Add a product first");
    //   return;
    // }

    setModal({ isOpen: true, rowIndex: index });
  };

  // delete or reset row
  const handleDelete = () => {
    if (modal.rowIndex === null) return;

    if (rows.length > 1) {
      setRows((prev) => prev.filter((_, i) => i !== modal.rowIndex));
    } else {
      setRows([emptyRow]);
    }

    setModal({ isOpen: false, rowIndex: null });
  };

  // calculate subtotal
  const subtotal = rows.reduce(
    (acc, row) => acc + (Number(row.quantity) * Number(row.unitPrice) || 0),
    0
  );

  const discountTotal = rows.reduce((acc, row) => {
    const baseAmount = row.quantity * row.unitPrice;

    if (row.discountType === "percent") {
      return acc + (baseAmount * (row.discount || 0)) / 100;
    } else {
      return acc + (row.discount || 0);
    }
  }, 0);

  const rowTotal = subtotal - discountTotal;

  // Check if any row has discount
  const hasDiscount = rows.some((row) => row.discount > 0);

  const handleDiscountReasonChange = (reason: string) => {
    if (onDiscountReasonChange) {
      onDiscountReasonChange(reason);
    }
  };

  return (
    <div className="bg-white border px-2 py-5">
      <h6 className="text-[#1E1E1E] text-base font-medium">Add Products</h6>

      <Table className="w-full mt-2 space-y-20">
        <TableHeader className="bg-[#F0F0F3] h-12">
          <TableRow>
            <TableHead className="text-[#333333] font-normal px-4">
              Product
            </TableHead>
            <TableHead className="text-[#333333] text-center font-normal">
              Quantity
            </TableHead>
            <TableHead className="text-[#333333] text-center font-normal">
              Unit Price
            </TableHead>
            <TableHead className=" text-[#333333] text-center font-normal">
              Discount
            </TableHead>
            <TableHead className="text-[#333333] text-center font-normal">
              Total
            </TableHead>
            <TableHead className="text-[#333333] pr-5 text-center font-normal">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            const selectedProduct = products.find(
              (p) => p._id === row.productId
            );
            const maxQuantity = selectedProduct?.stock || 0;

            return (
              <TableRow key={index} className="!border-b">
                {/* Product select */}
                <TableCell className="py-5">
                  <Select
                    value={row.productId}
                    onValueChange={(value) => handleProductChange(index, value)}
                  >
                    <SelectTrigger className="!bg-white w-[75px] md:w-[170px]">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {products
                        .filter(
                          (p) =>
                            p.isActive &&
                            p.stock > 0 &&
                            // include if its the current row's selected product
                            (p._id === row.productId ||
                              // or if its not already seleceted in another row
                              !rows.some(
                                (r, i) => r.productId === p._id && i !== index
                              ))
                        )
                        .map((p) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p.name} - {p.unit}
                            {/* - Stock: {p.stock}  */}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* Quantity input */}
                <TableCell className="w-[75px] md:w-[100px]">
                  <Input
                    type="number"
                    placeholder="1"
                    max={maxQuantity}
                    value={row.quantity === 0 ? "" : row.quantity} // allow clearing zero
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "") {
                        // user cleared input
                        updateRow(index, { quantity: 0 }); // keep store consistent but UI shows empty
                        return;
                      }

                      const newQuantity = Number(value);

                      if (newQuantity > maxQuantity && maxQuantity > 0) {
                        toast.warn(
                          `Only ${maxQuantity} ${
                            row.unit || "items"
                          } available in stock`
                        );
                        updateRow(index, { quantity: maxQuantity });
                      } else {
                        updateRow(index, { quantity: newQuantity });
                      }
                    }}
                    className="text-center !bg-white"
                  />

                  {/* {selectedProduct && (
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Max: {maxQuantity} {row.unit}
                    </p>
                  )} */}
                </TableCell>

                {/* Unit Price */}
                <TableCell className="text-center">
                  <div>
                    {formatCurrency(row.unitPrice)}
                    {/* {row.unit && (
                      <p className="text-xs text-gray-500">per {row.unit}</p>
                    )} */}
                  </div>
                </TableCell>

                {/* Discount */}
                <TableCell>
                  <div className="w-16 md:w-20 mx-auto h-[35.5px] flex items-center border px-2 !rounded-[7.5px]">
                    <input
                      type="number"
                      step="0.01"
                      value={row.discount === 0 ? "" : row.discount}
                      onChange={(e) => {
                        let newDiscount = Number(e.target.value) || 0;
                        const baseAmount = row.quantity * row.unitPrice;

                        if (
                          row.discountType === "percent" &&
                          newDiscount > 100
                        ) {
                          toast.warn("Discount percentage cannot exceed 100%");
                          newDiscount = 100;
                        } else if (
                          row.discountType === "amount" &&
                          newDiscount > baseAmount
                        ) {
                          toast.warn(
                            "Discount cannot exceed total amount of goods"
                          );
                          newDiscount = baseAmount;
                        }

                        updateRow(index, {
                          discount: newDiscount,
                        });
                      }}
                      className="flex-1/3 text-center w-8 md:w-12 outline-0 mr-0.5"
                    />
                    <Select
                      value={row.discountType}
                      onValueChange={(val) =>
                        updateRow(index, {
                          discountType: val as "amount" | "percent",
                        })
                      }
                    >
                      <SelectTrigger className="w-auto !border-0 !bg-transparent !outline-0 shadow-none -ml-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-2">
                        <SelectItem value="amount">₦</SelectItem>
                        <SelectItem value="percent">%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>

                {/* Total */}
                <TableCell className="text-center">
                  {formatCurrency(row.total)}
                </TableCell>

                {/* Delete */}
                <TableCell>
                  <button
                    onClick={() => openDeleteModal(index)}
                    className="py-2 px-3 mx-auto bg-[#f5f5f5] hover:bg-[#f5f5f5]/90 rounded flex items-center justify-center"
                    title="Delete row"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, rowIndex: null })}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
          <p className="mb-6">Are you sure you want to delete this row?</p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setModal({ isOpen: false, rowIndex: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Show discount reason input only when there's a discount */}
      {hasDiscount && (
        <div className="mt-4">
          <InputWithSuggestions
            label="Discount Reason:"
            placeholder="Input or select Reason for Discount"
            options={discountReasons}
            value={discountReason}
            onChange={handleDiscountReasonChange}
            requiredMessage="Discount reason is required for all discounts above 0% for audit purposes"
          />
        </div>
      )}

      {/* add button */}
      <div className="flex justify-center py-4 px-2.5 border-2 border-dashed border-[#D9D9D9] my-7 rounded-md">
        <Button
          variant="ghost"
          onClick={addRow}
          className="flex justify-center items-center gap-1"
        >
          <Plus className="text-[#2ECC71] w-4" />
          <span className="text-[#2ECC71]">Add Another Product</span>
        </Button>
      </div>

      {/* total */}
      <div className="bg-[#F5F5F5] rounded-md overflow-hidden">
        {/* subtotal */}
        <div className="flex justify-between items-center py-3 px-7">
          <p>Subtotal</p>
          <p className="mr-2">{formatCurrency(subtotal)}</p>
        </div>
        {/* discount */}
        <div className="flex justify-between items-center py-3 px-7">
          <p>Discount</p>
          <p className="border bg-white py-1 px-2 rounded">
            {formatCurrency(discountTotal)}
          </p>
        </div>
        {/* total */}
        <div className="bg-[#F0F0F3] text-[#333333] flex justify-between items-center py-3 px-7">
          <p>Total</p>
          <p className="mr-2">{formatCurrency(rowTotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default AddSaleProduct;
