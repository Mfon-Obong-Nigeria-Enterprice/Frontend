/** @format */

// @/components/inventory/components/ProductDisplayTab.tsx

import { useState, useEffect } from "react"; // Added useEffect
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { updateProduct } from "@/services/productService";
import { type Product, type NewProduct } from "@/types/types"; // Import Product and Category types
import {
  // Shadcn UI components
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal"; // Assuming this Modal component exists
import { newProductSchema } from "@/schemas/productSchema";

interface ProductDisplayProps {
  product: Product; // IMPORTANT: Use the Product type directly from types.ts
}

// Helper function to determine stock status (high/low)
const getShieldStatus = (product: Product): "high" | "low" => {
  const currentStock = product.stock || 0;
  const minLevel = product.minStockLevel || 0;
  return currentStock > minLevel ? "high" : "low";
};

const ProductDisplayTab = ({ product }: ProductDisplayProps) => {
  const {
    categories,
    updateProduct: updateProductInStore,
    removeProduct: removeProductFromStore, // Make sure useInventoryStore exports this!
  } = useInventoryStore();

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset, // IMPORTANT: Destructure reset from useForm
  } = useForm<NewProduct>({
    defaultValues: {
      name: product.name,
      // Ensure categoryId is a string ID for default value when initializing the form
      categoryId:
        typeof product.categoryId === "object"
          ? product.categoryId._id
          : product.categoryId,
      unit: product.unit,
      stock: product.stock,
      unitPrice: product.unitPrice,
      minStockLevel: product.minStockLevel,
    },
    resolver: zodResolver(newProductSchema),
  });

  // IMPORTANT: Effect to reset form values when entering edit mode or when product prop changes
  useEffect(() => {
    if (editMode) {
      reset({
        name: product.name,
        categoryId:
          typeof product.categoryId === "object"
            ? product.categoryId._id
            : product.categoryId,
        unit: product.unit,
        stock: product.stock,
        unitPrice: product.unitPrice,
        minStockLevel: product.minStockLevel,
      });
    }
  }, [editMode, product, reset]); // Add reset to dependency array

  // Helper to safely get category name and units from the product's categoryId
  // This handles cases where categoryId is a string or an object
  const getCategoryDetails = (
    categoryId: string | { _id: string; name: string; units: string[] } // Must match Product type's categoryId
  ): { name: string; units: string[] } => {
    if (typeof categoryId === "object" && categoryId.name && categoryId.units) {
      return { name: categoryId.name, units: categoryId.units };
    }
    // If categoryId is a string, or an object without units, try to find it in the global categories
    const id = typeof categoryId === "string" ? categoryId : categoryId._id;
    const foundCategory = categories.find((cat) => cat._id === id);
    if (foundCategory) {
      return { name: foundCategory.name, units: foundCategory.units };
    }
    // Fallback if category not found or incomplete
    return { name: "Uncategorized", units: [] };
  };

  // Get details for the displayed product's category
  const productCategoryDetails = getCategoryDetails(product.categoryId);
  const categoryDisplayName = productCategoryDetails.name;

  const onSubmit = async (data: NewProduct) => {
    try {
      setIsLoading(true);

      // Prepare payload to ensure categoryId is a string ID for the API
      const payload = {
        ...data,
        categoryId:
          typeof data.categoryId === "object"
            ? data.categoryId // If it somehow became an object from form, extract ID
            : data.categoryId, // Otherwise, it's already a string ID
      };

      // Call API to update on the server (assuming updateProduct service exists and returns Product)
      const updated = await updateProduct(product._id, payload);

      // Update zustand store to trigger UI update
      updateProductInStore(updated);

      toast.success("Product updated successfully");
      setEditMode(false); // Close modal on success
    } catch (err) {
      toast.error("Failed to update product");
      console.error("Failed to update product", err);
    } finally {
      setIsLoading(false); // Ensure loading is off regardless of outcome
    }
  };

  // IMPORTANT: Function to handle product deletion
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      // In a real application, you would call a deleteProduct API here:
      // For example: await deleteProduct(product._id); // You need to implement this service

      // Remove from Zustand store to update UI immediately
      removeProductFromStore(product._id);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Failed to delete product", error);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false); // Always close delete modal
    }
  };

  const shieldStatus = getShieldStatus(product);

  if (editMode) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-orange-500 rounded p-4 space-y-3 shadow-xl"
      >
        {/* Product name and category fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-xs text-gray-700">
              Product name
            </label>
            <Input id="name" {...register("name")} placeholder="Product name" />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="categoryId" className="text-xs text-gray-700">
              Category
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-red-500 text-xs">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        {/* Unit and Stock fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="unit" className="text-xs text-gray-700">
              Unit
            </label>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Unit</SelectLabel>
                      {/* Use productCategoryDetails.units to get units for the selected category */}
                      {productCategoryDetails.units.length > 0 ? (
                        productCategoryDetails.units.map((unit, i) => (
                          <SelectItem key={i} value={unit}>
                            {unit}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No units for this category
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unit && (
              <p className="text-red-500 text-xs">{errors.unit.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="stock" className="text-xs text-gray-700">
              Stock
            </label>
            <Input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="Stock"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs">{errors.stock.message}</p>
            )}
          </div>
        </div>

        {/* Unit Price and Minimum Stock Level fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="unitPrice" className="text-xs text-gray-700">
              Unit price
            </label>
            <Input
              id="unitPrice"
              type="number"
              {...register("unitPrice", { valueAsNumber: true })}
              placeholder="Unit Price"
            />
            {errors.unitPrice && (
              <p className="text-red-500 text-xs">{errors.unitPrice.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="minStockLevel" className="text-xs text-gray-700">
              Min stock alert level
            </label>
            <Input
              id="minStockLevel"
              type="number"
              {...register("minStockLevel", { valueAsNumber: true })}
              placeholder="Minimum Stock Level"
            />
            {errors.minStockLevel && (
              <p className="text-red-500 text-xs">
                {errors.minStockLevel.message}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons for edit mode */}
        <div className="grid grid-cols-2 gap-8 mt-5">
          <Button
            onClick={() => setEditMode(false)}
            variant="outline"
            className="text-xs"
            type="button" // Important: Prevents accidental form submission
          >
            Cancel
          </Button>
          <Button type="submit" className="text-xs" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : "Save"}
          </Button>
        </div>
      </form>
    );
  }

  // Display mode
  return (
    <article className="relative bg-white border border-[var(--cl-border-gray)] rounded p-10 sm:p-4 mt-6 font-Arial hover:shadow-xl hover:border-green-400 transition-all duration-200 ease-in-out">
      <div className="flex justify-between" id={product._id}>
        <div>
          <h6 className="text-lg font-normal text-[var(--cl-text-gray)]">
            {product.name}
          </h6>
          <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 inline-block rounded">
            {categoryDisplayName}
          </p>
        </div>
        <div className="flex gap-3">
          <Pencil
            size={16}
            className="text-orange-500 cursor-pointer"
            onClick={() => setEditMode(true)}
          />
          <Trash2
            size={16}
            className="text-[#7d7d7d] cursor-pointer"
            onClick={() => setIsDeleteModalOpen(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        <div>
          <p className="font-medium text-gray-400">Stock</p>
          <p className="text-[var(--cl-text-semidark)] text-[0.8125rem]">
            {product.stock} {product.unit}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-400">Unit Price</p>
          <p className="text-[var(--cl-text-semidark)] text-[0.8125rem]">
            ₦ {product.unitPrice.toLocaleString("en-NG")}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-400">Total Value</p>
          <p className="text-[var(--cl-text-semidark)] text-[0.8125rem]">
            ₦ {(product.stock * product.unitPrice).toLocaleString("en-NG")}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-400">Minimum Level</p>
          <p className="text-[var(--cl-text-semidark)] text-[0.8125rem]">
            {product.minStockLevel} {product.unit}
          </p>
        </div>
      </div>

      {/* Stock Status Badge */}
      <div
        className={`mt-10 border rounded px-1 py-1 text-[.75rem] flex gap-0.5 items-center ${
          shieldStatus === "high" // Use shieldStatus directly
            ? "border-[var(--cl-bg-green)] bg-[var(--cl-bg-light-green)] text-[var(--cl-bg-green)]"
            : "border-[#F95353] bg-[#FFE4E2] text-[#F95353]"
        }`}
      >
        {shieldStatus === "high" ? (
          <p className="flex gap-1 items-center">
            <MoveUp size={12} />
            <span>High stock</span>
          </p>
        ) : (
          <p className="flex gap-1 items-center">
            <MoveDown size={12} />
            <span>Low Stock - Reorder soon</span>
          </p>
        )}
      </div>

      {/* Loading overlay for edit form */}
      {isLoading && <LoadingSpinner />}

      {/* Delete warning modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <div className="flex flex-col justify-center items-center gap-3 py-5">
          <p className="">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{product.name}</span>?
          </p>
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              type="button" // Important: Prevents accidental form submission
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete} // Call the handleDelete function
              disabled={isLoading}
              type="button" // Important: Prevents accidental form submission
            >
              {isLoading ? <LoadingSpinner /> : "Yes, Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </article>
  );
};

export default ProductDisplayTab;
