/** @format */
import * as React from "react";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/types";
import { updateProductPrice } from "@/services/productService";
import { useInventoryStore } from "@/stores/useInventoryStore";

interface PriceUpdateTableSectionProps {
  products: Product[];
  isReadOnly?: boolean;
}

export const PriceUpdateTableSection: React.FC<
  PriceUpdateTableSectionProps
> = ({ products, isReadOnly = false }) => {
  const [editingPrices, setEditingPrices] = React.useState<{
    [key: string]: number;
  }>({});
  const [loadingProductId, setLoadingProductId] = React.useState<string | null>(
    null
  );

  const updateProduct = useInventoryStore((state) => state.updateProduct);

  const handlePriceChange = (id: string, value: number) => {
    setEditingPrices((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = async (productId: string, newPrice: number) => {
    try {
      setLoadingProductId(productId);
      const updatedProduct = await updateProductPrice(productId, newPrice);
      updateProduct(updatedProduct);
      setEditingPrices((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    } catch (err) {
      console.error("Failed to update price:", err);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleReset = (productId: string) => {
    setEditingPrices((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const getBadgeStyles = (change: number) => {
    if (change >= 10) return "bg-[#FFF8DD] text-[#F59E0B]";
    if (change > 0) return "bg-[#DCFCE7] text-[#16A34A]";
    return "bg-gray-100 text-gray-600";
  };

  /**
   * Custom Stepper Input Component
   * Replicates the split-column design from Figma/Screenshots:
   * - Vertical divider (border-l)
   * - Stacked buttons with horizontal divider (border-b)
   * - Distinct background for button area
   */
  const StepperInput = ({
    value,
    onChange,
    disabled,
    className,
  }: {
    value: number;
    onChange: (val: number) => void;
    disabled?: boolean;
    className?: string;
  }) => {
    return (
      <div className={`relative flex items-center ${className}`}>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          // pr-10 ensures text doesn't go under the buttons
          // appearance-none hides browser default spinners
          className="w-full pr-10  focus-visible:ring-0 focus-visible:ring-offset-0 z-10"
          disabled={disabled}
        />
        
        {/* The Button Container - Physically attached to the right */}
        {/* The Button Container - Physically attached to the right */}
        <div className="absolute right-1 top-1 bottom-1 rounded-[2px] w-[18px] flex flex-col  bg-[#D9D9D9] z-20 overflow-hidden">
          {/* Up Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(value + 1)}
            className="flex-1 flex items-center justify-center hover:bg-[#D1D5DB] active:bg-[#C4C9D0] transition-colors disabled:opacity-50"
          >
            <ChevronUp className="h-4 w-4 text-[#7D7D7D]" strokeWidth={2} />
          </button>
          
          {/* Down Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(value - 1)}
            className="flex-1 flex items-center justify-center hover:bg-[#D1D5DB] active:bg-[#C4C9D0] transition-colors disabled:opacity-50"
          >
            <ChevronDown className="h-4 w-4 text-[#7D7D7D]" strokeWidth={2} />
          </button>
        </div>
        
        {/* Visual trick: A full border wrapper to ensure the input and buttons look like one cohesive unit if needed, 
            but here we use the absolute positioning to overlay the right side controls accurately. */}
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-white rounded-lg">
      <div className="px-1">
        <h2 className="text-xl font-semibold text-[#333333]">
          Price Update Management
        </h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block space-y-4">
        <p className="text-[#666666] text-sm">Product Price Update</p>
        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-[#F9FAFB]">
              <TableRow className="border-b border-[#E5E7EB]">
                <TableHead className="font-semibold text-[#333333] border-r border-[#E5E7EB] h-12 pl-6">
                  Product
                </TableHead>
                <TableHead className="font-semibold text-[#333333] border-r border-[#E5E7EB] h-12 pl-6">
                  Current Price
                </TableHead>
                <TableHead className="font-semibold text-[#333333] border-r border-[#E5E7EB] h-12 w-[280px] pl-6">
                  New Price
                </TableHead>
                <TableHead className="font-semibold text-[#333333] border-r border-[#E5E7EB] h-12 pl-6">
                  Change%
                </TableHead>
                <TableHead className="font-semibold text-[#333333] border-r border-[#E5E7EB] h-12 pl-6">
                  Unit
                </TableHead>
                <TableHead className="font-semibold text-[#333333] h-12 pl-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const currentPrice =
                  editingPrices[product._id] ?? product.unitPrice;
                const change =
                  ((currentPrice - product.unitPrice) / product.unitPrice) * 100;
                const displayChange = parseFloat(change.toFixed(0));

                const isEditing = editingPrices[product._id] !== undefined;
                const isChanged = isEditing && currentPrice !== product.unitPrice;
                const isValid =
                  isEditing && !isNaN(currentPrice) && currentPrice > 0;

                return (
                  <TableRow
                    key={product._id}
                    className="border-b border-[#E5E7EB] last:border-0 hover:bg-transparent"
                  >
                    <TableCell className="text-[#333333] border-r border-[#E5E7EB] py-4 pl-6">
                      {product.name || "Unnamed Product"}
                    </TableCell>
                    <TableCell className="text-[#333333] border-r border-[#E5E7EB] py-4 pl-6">
                      ₦{(product.unitPrice || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="border-r border-[#E5E7EB] py-4 pl-6 pr-4">
                      <StepperInput
                        value={currentPrice}
                        onChange={(val) => handlePriceChange(product._id, val)}
                        disabled={loadingProductId === product._id || isReadOnly}
                        className="h-12 md:h-full border border-[#E5E7EB] rounded-md"
                      />
                    </TableCell>
                    <TableCell className="py-4 pl-6 border border-[#E5E7EB]">
                      <span
                        className={`inline-block px-3 py-1  rounded text-sm font-medium ${getBadgeStyles(
                          displayChange
                        )}`}
                      >
                        {change > 0 ? "+" : ""}
                        {displayChange}%
                      </span>
                    </TableCell>
                    <TableCell className="text-[#333333] border-r border-[#E5E7EB] py-4 pl-6">
                      {product.unit || "No unit specified"}
                    </TableCell>
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleUpdate(product._id, currentPrice)}
                          disabled={
                            loadingProductId === product._id ||
                            !isChanged ||
                            !isValid ||
                            isReadOnly
                          }
                          className="bg-[#22C55E] hover:bg-[#16A34A] text-white h-9 px-4 font-medium min-w-[80px]"
                        >
                          {loadingProductId === product._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Update"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReset(product._id)}
                          disabled={
                            loadingProductId === product._id ||
                            !isEditing ||
                            isReadOnly
                          }
                          className="border-[#D1D5DB] text-[#333333] hover:bg-gray-50 h-9 px-4 font-medium min-w-[80px]"
                        >
                          Reset
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => {
          const currentPrice =
            editingPrices[product._id] ?? product.unitPrice;
          const change =
            ((currentPrice - product.unitPrice) / product.unitPrice) * 100;
          const displayChange = parseFloat(change.toFixed(0));

          const isEditing = editingPrices[product._id] !== undefined;
          const isChanged = isEditing && currentPrice !== product.unitPrice;
          const isValid = isEditing && !isNaN(currentPrice) && currentPrice > 0;

          return (
            <div
              key={product._id}
              className="border border-[#E5E7EB] rounded-lg p-5 space-y-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-1 text-[#333333] text-[15px]">
                  <span className="text-[#666666]">Product:</span>
                  <span>{product.name || "Unnamed Product"}</span>
                </div>
                <span className="text-[#666666] text-[15px]">
                  {product.unit || "Piece"}
                </span>
              </div>

              <div className="flex items-center justify-between md:justify-start gap-3">
                <div className="flex gap-1 text-[#333333] text-[15px] whitespace-nowrap">
                  <span className="text-[#666666]">Current Price:</span>
                  <span>₦{(product.unitPrice || 0).toLocaleString()}</span>
                </div>

                <div className="flex items-center  gap-2 flex-1 md:justify-start justify-end max-w-[200px]">
                  <StepperInput
                    value={currentPrice}
                    onChange={(val) => handlePriceChange(product._id, val)}
                    disabled={loadingProductId === product._id || isReadOnly}
                    className="h-10 md:w-[110px] "
                  />
                  <span
                    className={`inline-block px-2 py-1.5 rounded text-xs font-medium whitespace-nowrap ${getBadgeStyles(
                      displayChange
                    )}`}
                  >
                    {change > 0 ? "+" : ""}
                    {displayChange}%
                  </span>
                </div>
              </div>

              <div className="flex md:justify-end gap-3 pt-2">
                <Button
                  onClick={() => handleUpdate(product._id, currentPrice)}
                  disabled={
                    loadingProductId === product._id ||
                    !isChanged ||
                    !isValid ||
                    isReadOnly
                  }
                  className="flex-1 md:flex-initial bg-[#22C55E] hover:bg-[#16A34A] text-white h-10 font-medium px-4"
                >
                  {loadingProductId === product._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReset(product._id)}
                  disabled={
                    loadingProductId === product._id || !isEditing || isReadOnly
                  }
                  className="flex-1 md:flex-initial  border-[#D1D5DB] text-[#333333] hover:bg-gray-50 h-10 font-medium"
                >
                  Reset
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};