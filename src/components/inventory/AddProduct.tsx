import { useEffect, useState } from "react";
import { type AxiosError } from "axios";
import { toast } from "sonner";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { createProduct } from "@/services/productService";
import { type NewProduct } from "@/types/types";
import { newProductSchema } from "@/schemas/productSchema";
import { useGoBack } from "@/hooks/useGoBack";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import LoadingSpinner from "../LoadingSpinner";

const AddProduct = () => {
  // const navigate = useNavigate();
  const goBack = useGoBack();
  const [isLoading, setIsLoading] = useState(false);
  const { categories, categoryUnits, setSelectedCategoryId } =
    useInventoryStore();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewProduct>({
    resolver: zodResolver(newProductSchema),
  });

  // watch categoryId and update selectedCategoryId
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  useEffect(() => {
    if (selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(selectedCategoryId);
    }
  }, [selectedCategoryId, setSelectedCategoryId, categories]);

  const onSubmit = async (data: NewProduct) => {
    setIsLoading(true);
    try {
      await createProduct(data);
      toast.success("Product created successfully");
      reset();
      goBack();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data.message || "Error creating product";
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-3 md:px-10 py-2 flex justify-center items-center font-Inter">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white max-w-[60rem] w-full rounded-[0.625rem] border border-[#d9d9d9] px-5 md:px-10 py-10 space-y-4"
      >
        <h5 className="text-[#333333] font-medium text-sm md:text-lg">
          Product Information
        </h5>

        <div className="border-t border-[#d9d9d9] mt-2 py-5 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {/* Product name */}
          <div className="flex flex-col gap-2">
            <Label className="text-[#333333] text-sm">Product name</Label>
            <Input
              {...register("name")}
              placeholder="Product name"
              className="border border-[#7D7D7D] rounded-md p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label className="text-[#333333] text-sm">
                  Select category
                </Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-red-500 text-xs">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <h5 className="text-[#333333] font-medium text-sm md:text-lg mt-5">
          Inventory
        </h5>

        <div className="border-t border-[#d9d9d9] mt-2 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Unit */}
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label className="text-[#333333] text-sm">Primary unit</Label>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    setSelectedCategoryId(val);
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Primary unit (e.g., 8mm rod)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryUnits.map((unit, i) => (
                        <SelectItem key={i} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-red-500 text-xs">{errors.unit.message}</p>
                )}
              </div>
            )}
          />

          {/* Stock */}
          <div className="flex flex-col gap-2">
            <Label className="text-[#333333] text-sm">Initial quantity</Label>
            <Input
              {...register("stock", { valueAsNumber: true })}
              placeholder="100"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs">{errors.stock.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <Label className="text-[#333333] text-sm">Price per unit</Label>
            <Input
              {...register("unitPrice", { valueAsNumber: true })}
              placeholder="₦0.00"
            />
            {errors.unitPrice && (
              <p className="text-red-500 text-xs">{errors.unitPrice.message}</p>
            )}
          </div>

          {/* Minimum Stock Level */}
          <div className="flex flex-col gap-2">
            <Label className="text-[#333333] text-sm">
              Low stock alert level
            </Label>
            <Input
              {...register("minStockLevel", { valueAsNumber: true })}
              placeholder="10"
            />
            {errors.minStockLevel && (
              <p className="text-red-500 text-xs">
                {errors.minStockLevel.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-7 mt-7">
          <Button
            type="button"
            onClick={() => goBack()}
            className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)]"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)]"
          >
            Add Product
          </Button>
        </div>
      </form>
      {isLoading && <LoadingSpinner />}
    </section>
  );
};

export default AddProduct;
