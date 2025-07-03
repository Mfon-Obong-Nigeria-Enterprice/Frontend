import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { updateProduct } from "@/services/productService";
import { newProductSchema } from "@/lib/zodUtils";
import { type NewProduct } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";

interface ProductDisplayProps {
  product: {
    _id: string;
    name: string;
    categoryId: string | { _id: string; name: string };
    unit: string;
    stock: number;
    unitPrice: number;
    minStockLevel: number;
  };
}

const ProductDisplayTab = ({ product }: ProductDisplayProps) => {
  const { categories, updateProduct: updateProductInStore } =
    useInventoryStore();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProduct>({
    defaultValues: {
      name: product.name,
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

  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const onSubmit = async (data: NewProduct) => {
    try {
      setIsLoading(true);

      // call API to update on the server
      const updated = await updateProduct(product._id, data);

      // update zustand store to trigger UI update
      updateProductInStore(updated);

      // show success message
      toast.success("Product updated successfully");

      // close modal
      setEditMode(false);
    } catch (err) {
      toast.error("Failed to update product");
      console.error("Failed to update product", err);
    } finally {
      setIsLoading(false);
      setEditMode(false);
    }
  };

  if (editMode) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-[#FFA500] rounded p-4 space-y-3 hover:shadow-xl"
      >
        {/* product and category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-xs">
              Product name
            </label>
            <Input {...register("name" as const)} placeholder="Product name" />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
          <div className="-mt-1">
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <label className="text-xs">Category</label>
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
          </div>
        </div>
        {/* unit and stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <label className="text-xs">Unit</label>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Unit</SelectLabel>
                      {categories
                        .find((category) => category._id === selectedCategoryId)
                        ?.units.map((unit, i) => (
                          <SelectItem key={i} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <label className="text-xs">
              Stock
              <Input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="Stock"
              />
            </label>
            {errors.stock && (
              <p className="text-red-500 text-xs">{errors.stock.message}</p>
            )}
          </div>
        </div>
        {/* price and min level*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-xs">Unit price</label>
            <Input
              type="number"
              {...register("unitPrice", { valueAsNumber: true })}
              placeholder="Unit Price"
            />
            {errors.unitPrice && (
              <p className="text-red-500 text-xs">{errors.unitPrice.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs">Min stock alert level</label>
            <Input
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

        <div className="grid grid-cols-2 gap-8 mt-5">
          <Button
            onClick={() => setEditMode(false)}
            variant="outline"
            className="text-xs"
          >
            Cancel
          </Button>
          <Button type="submit" className="text-xs">
            Save
          </Button>
        </div>
      </form>
    );
  }

  return (
    <article
      // id={product._id}
      className="relative bg-white border border-[var(--cl-border-gray)] rounded p-10 sm:p-4 mt-6 font-Arial hover:shadow-xl hover:border-green-400 transition-all duration-200 ease-in-out"
    >
      <div className="flex justify-between" id={product._id}>
        <div>
          <h6 className="text-lg font-normal text-[var(--cl-text-gray)]">
            {product.unit} {product.name}
          </h6>
          <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 inline-block rounded">
            {typeof product.categoryId === "object" &&
            product.categoryId !== null
              ? product.categoryId.name
              : "Uncategorized"}
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
            className="text-[#7d7d7d]"
            onClick={() => setIsDeleteModalOpen(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        <div>
          <p className="font-medium text-gray-400">Stock</p>
          <p className="text-[var(--cl-text-semidark)] text-[0.8125rem]">
            {product.stock}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-400">Unit Price</p>
          <p className="text-[var(--cl-text-semidark)] text-[0.8125rem]">
            ₦ {product.unitPrice.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-400">Total Value</p>
          <p className="text-[var(--cl-text-semidark)] text-[0.8125rem]">
            ₦ {(product.stock * product.unitPrice).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-400">Minimum Level</p>
          <p className="text-[var(--cl-text-semidark)] text-[0.8125rem]">
            {product.minStockLevel}
          </p>
        </div>
      </div>

      <div
        className={`mt-10 border rounded px-1 py-1 text-[.75rem] flex gap-0.5 items-center ${
          product.stock > product.minStockLevel
            ? "border-[var(--cl-bg-green)] bg-[var(--cl-bg-light-green)] text-[var(--cl-bg-green)]"
            : "border-[#F95353] bg-[#FFE4E2] text-[#F95353]"
        }`}
      >
        {product.stock > product.minStockLevel ? (
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

      {/* Loading for edit form */}
      {isLoading && <LoadingSpinner />}

      {/* delete warning modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <div className="flex flex-col justify-center items-center gap-3 py-5">
          <p className="">Are you sure you want to delete?</p>
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsDeleteModalOpen(false);
                toast.success("Deleted successfully");
              }}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </article>
  );
};

export default ProductDisplayTab;
