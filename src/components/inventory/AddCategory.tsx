/** @format */

import { useState } from "react";
import { type AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/categorySchema";
import { type CategoryData } from "@/types/types";
import { createCategory } from "@/services/categoryService";
import TagInput from "../TagInput";
import InputField from "../InputField";
import { Button } from "../ui/button";
import { toast } from "sonner";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  closeBothModals: () => void;
};

const AddCategory = ({ closeBothModals }: Props) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CategoryData>({
    resolver: zodResolver(categorySchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      units: [],
      description: "",
    },
  });

  const onSubmit = async (data: CategoryData) => {
    setIsLoading(true);
    try {
      await createCategory(data);
      // invalidate the categories query so it's refetched automatically
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast.success("Category created successfully");
      reset();
      closeBothModals();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message =
        err?.response?.data.message || "Failed to create category";
      toast.error(message);
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-10">
      <h3 className="font-medium text-xl text-[var(--cl-text-dark)]">
        Add New Category
      </h3>

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 mt-6 border border-[#D9D9D9] p-4 rounded-[0.625rem]">
        {/* Category name */}
        <div>
          <InputField
            label="Category name"
            id="categoryName"
            type="text"
            placeholder="Name of category"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        {/* Units (Tag input) */}
        <div>
          <label className="block mb-3 font-Inter font-normal text-[var(--cl-text-gray)] text-sm">
            Measurement Units
          </label>
          <Controller
            name="units"
            control={control}
            render={({ field }) => (
              <>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Click enter when you enter a unit e.g. bag, litre"
                  className="border-[#7d7d7d]"
                />
                {errors.units && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.units.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Optional Description */}
        <div className="md:col-span-2">
          <InputField
            label="Description (Optional)"
            id="categoryDescription"
            textarea
            placeholder="Describe the category..."
            {...register("description")}
            error={errors.description?.message}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <div className="w-full lg:w-[30%]">
          <Button
            variant="ghost"
            onClick={closeBothModals}
            className="border px-6 py-3"
          >
            Cancel
          </Button>
        </div>
        <div className="w-full lg:w-[30%]">
          <Button type="submit" disabled={isLoading}>
            Add Category
          </Button>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </form>
  );
};

export default AddCategory;

//   const onSubmit = async () => {
//     // const onSubmit = async (data: CategoryData) => {
//     // const duplicate = categories.some(
//     //   (cat) =>
//     //     cat.categoryName.toLowerCase() === data.categoryName.toLowerCase()
//     // );
//     // if (duplicate) {
//     //   alert("This category already exists!");
//     //   return;
//     // }
//     // addCategory(data);
//     try {
//       await createCategory();
//       // await createCategory(data);
//       alert("Product created successfully");
//       reset();
//     } catch (error) {
//       alert("Failed to create category");
//       console.error(error);
//     }
//   };
