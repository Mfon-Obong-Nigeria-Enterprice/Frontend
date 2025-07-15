import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  currentQuantity: number;
  unit: string;
  minLevel: number;
  unitPrice: string;
  shieldStatus: "high" | "low";
  newQuantity?: number;
  selected?: boolean;
}

interface UpdateStockProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProducts: Product[]) => void;
}

export default function UpdateStock({
  products: initialProducts,
  isOpen,
  onClose,
  onSave,
}: UpdateStockProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(() =>
    initialProducts.map((p) => ({
      ...p,
      newQuantity: p.currentQuantity,
      selected: true,
    }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkQuantity, setBulkQuantity] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const selectedCount = useMemo(() => {
    return filteredProducts.filter((product) => product.selected).length;
  }, [filteredProducts]);

  const allSelected = useMemo(() => {
    return (
      filteredProducts.length > 0 &&
      filteredProducts.every((product) => product.selected)
    );
  }, [filteredProducts]);

  const handleClose = () => {
    onClose();
    navigate("/admin/dashboard/inventory");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleProductSelection = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        selected: checked,
      }))
    );
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, newQuantity: numValue }
          : product
      )
    );
  };

  const handleBulkQuantityApply = () => {
    const quantity = parseInt(bulkQuantity) || 0;
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.selected ? { ...product, newQuantity: quantity } : product
      )
    );
  };

  const handleSave = () => {
    const updatedProducts = products.map(({ newQuantity, ...rest }) => ({
      ...rest,
      currentQuantity: newQuantity || rest.currentQuantity,
    }));
    onSave(updatedProducts);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Update Stock Levels</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-6 pt-4 border-t">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-10 bg-gray-200 pl-10"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:gap-6 space-y-4 md:space-y-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm md:text-base">
                    Select All
                  </Label>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm md:text-base">Set all selected to:</Label>
                    <Input
                      type="number"
                      className="w-28 h-8"
                      placeholder="Quantity"
                      value={bulkQuantity}
                      onChange={(e) => setBulkQuantity(e.target.value)}
                    />
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBulkQuantityApply}
                      disabled={selectedCount === 0}
                      className="px-4 py-1.5 text-sm capitalize bg-emerald-500 hover:bg-green-500 hover:text-white text-white"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No products found matching your search
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            className="bg-white"
                            id={`product-${product.id}`}
                            checked={product.selected}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                          <Label className="text-base font-medium">
                            {product.name}
                          </Label>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.category}
                        </span>
                        <div className="flex gap-4 flex-wrap">
                          <div>
                            <span className="text-sm block">Current Stock</span>
                            <span className="text-sm">
                              {product.currentQuantity} {product.unit}
                            </span>
                          </div>
                          <div>
                            <div
                              className={`px-3 py-1 text-xs font-medium rounded ${
                                product.shieldStatus === "high"
                                  ? "bg-green-100 text-emerald-500"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.shieldStatus === "high" ? "High" : "Low"}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm block">Unit Price</span>
                        <span className="text-base font-medium">
                          {product.unitPrice}
                        </span>
                      </div>

                      <div className="w-full md:max-w-xs space-y-2">
                        <Label htmlFor={`quantity-${product.id}`}>New Quantity</Label>
                        <Input
                          id={`quantity-${product.id}`}
                          type="number"
                          min="0"
                          value={product.newQuantity}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          className="border border-black w-full"
                        />

                        <Label>Min Level</Label>
                        <Input
                          value={`${product.minLevel} ${product.unit}`}
                          readOnly
                          className="border-none bg-gray-100"
                        />

                        <Label>Status</Label>
                        <p
                          className={`text-sm font-medium ${
                            product.newQuantity && product.newQuantity >= product.minLevel
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.newQuantity && product.newQuantity >= product.minLevel
                            ? "Stock OK"
                            : "Reorder Needed"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-footer"
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                />
                <Label htmlFor="select-all-footer" className="text-sm">
                  {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
                </Label>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Button variant="outline" onClick={handleClose} className="w-full md:w-auto">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={selectedCount === 0}
                  className="bg-emerald-500 hover:bg-green-700 w-full md:w-auto"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
