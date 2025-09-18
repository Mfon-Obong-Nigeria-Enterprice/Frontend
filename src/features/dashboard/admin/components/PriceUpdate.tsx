/** @format */
import * as React from "react";
import { Loader2 } from "lucide-react";
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

interface PriceUpdateTableSectionProps {
  products: Product[];
  isReadOnly?: boolean;
  onUpdated?: () => void; // optional callback after update
}

export const PriceUpdateTableSection: React.FC<
  PriceUpdateTableSectionProps
> = ({ products, isReadOnly = false, onUpdated }) => {
  const [editingPrices, setEditingPrices] = React.useState<{
    [key: string]: number;
  }>({});
  const [loadingProductId, setLoadingProductId] = React.useState<string | null>(
    null
  );

  const handlePriceChange = (id: string, value: number) => {
    setEditingPrices((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = async (productId: string, newPrice: number) => {
    try {
      setLoadingProductId(productId);
      await updateProductPrice(productId, newPrice);
      setEditingPrices((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      if (onUpdated) onUpdated();
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

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">
        Price Update Management
      </h2>
      <p className="text-sm text-gray-500 mb-4">Product prices update</p>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-[#D9D9D9] rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F5F5F5]">
            <TableRow>
              <TableHead className="font-semibold text-gray-700 border-r">
                Product
              </TableHead>
              <TableHead className="font-semibold text-gray-700 border-r">
                Current Price
              </TableHead>
              <TableHead className="font-semibold text-gray-700 border-r">
                New Price
              </TableHead>
              <TableHead className="font-semibold text-gray-700 border-r">
                Change %
              </TableHead>
              <TableHead className="font-semibold text-gray-700 border-r">
                Unit
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">
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
              const displayChange = parseFloat(change.toFixed(2));

              const isEditing = editingPrices[product._id] !== undefined;
              const isChanged = isEditing && currentPrice !== product.unitPrice;
              const isValid =
                isEditing && !isNaN(currentPrice) && currentPrice > 0;

              return (
                <TableRow key={product._id}>
                  <TableCell className="font-medium text-gray-800 border-r">
                    {product.name || "Unnamed Product"}
                  </TableCell>
                  <TableCell className="text-gray-600 border-r">
                    ₦{(product.unitPrice || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="border-r">
                    <Input
                      type="number"
                      value={currentPrice}
                      onChange={(e) =>
                        handlePriceChange(
                          product._id,
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-24 h-8"
                      disabled={loadingProductId === product._id || isReadOnly}
                    />
                  </TableCell>
                  <TableCell className="border-r">
                    <span
                      className={`inline-block px-2 py-1 border ${
                        change >= 0
                          ? "border-[#E2F3EB] bg-[#E2F3EB]"
                          : "border-[#FFF2CE] bg-[#FFF2CE]"
                      } rounded text-[#444444] text-sm font-medium`}
                    >
                      {change > 0 ? "+" : ""}
                      {displayChange}%
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 border-r">
                    {product.unit || "No unit specified"}
                  </TableCell>
                  <TableCell className="flex space-x-2 justify-center">
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(product._id, currentPrice)}
                      disabled={
                        loadingProductId === product._id ||
                        !isChanged ||
                        !isValid ||
                        isReadOnly
                      }
                      className="h-8"
                    >
                      {loadingProductId === product._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReset(product._id)}
                      disabled={
                        loadingProductId === product._id ||
                        !isEditing ||
                        isReadOnly
                      }
                      className="h-8"
                    >
                      Reset
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {products.map((product) => {
          const currentPrice =
            editingPrices[product._id] ?? product.unitPrice;
          const change =
            ((currentPrice - product.unitPrice) / product.unitPrice) * 100;
          const displayChange = parseFloat(change.toFixed(2));

          const isEditing = editingPrices[product._id] !== undefined;
          const isChanged = isEditing && currentPrice !== product.unitPrice;
          const isValid =
            isEditing && !isNaN(currentPrice) && currentPrice > 0;

          return (
            <div
              key={product._id}
              className="border border-[#D9D9D9] rounded-lg p-3 bg-white"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-800">
                  {product.name || "Unnamed Product"}
                </h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.unit || "No unit"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Price</p>
                  <p className="text-gray-600">
                    ₦{(product.unitPrice || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">New Price</p>
                  <Input
                    type="number"
                    value={currentPrice}
                    onChange={(e) =>
                      handlePriceChange(product._id, parseFloat(e.target.value))
                    }
                    className="h-8 text-sm"
                    disabled={loadingProductId === product._id || isReadOnly}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Change %</p>
                  <span
                    className={`inline-block px-2 py-1 border ${
                      change >= 0
                        ? "border-[#E2F3EB] bg-[#E2F3EB]"
                        : "border-[#FFF2CE] bg-[#FFF2CE]"
                    } rounded text-[#444444] text-xs font-medium`}
                  >
                    {change > 0 ? "+" : ""}
                    {displayChange}%
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(product._id, currentPrice)}
                    disabled={
                      loadingProductId === product._id ||
                      !isChanged ||
                      !isValid ||
                      isReadOnly
                    }
                    className="h-8 text-xs"
                  >
                    {loadingProductId === product._id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReset(product._id)}
                    disabled={
                      loadingProductId === product._id ||
                      !isEditing ||
                      isReadOnly
                    }
                    className="h-8 text-xs"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
