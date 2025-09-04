// import { useState } from "react";
import { type AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Add this import
import { categorySchema } from "@/schemas/categorySchema";
import { type Category } from "@/types/types";
import { createCategory } from "@/services/categoryService";
import TagInput from "../../../../components/TagInput";
import InputField from "../../../../components/InputField";
import { Button } from "../../../../components/ui/button";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { useNotificationStore } from "@/stores/useNotificationStore";
import type { Role } from "@/types/types";
import { v4 as uuidv4 } from "uuid"; // for unique IDs

const addErrorNotification = (
  message: string,
  recipients: Role[] = ["ADMIN"]
) => {
  const addNotification = useNotificationStore.getState().addNotification;

  addNotification({
    id: uuidv4(),
    title: "Category Failed",
    message,
    type: "error",
    action: "category_added", // you can still use the related action
    read: false,
    createdAt: new Date(),
    recipients,
  });
};

const addCategoryNotification = (
  newCategory: { name: string },
  recipients: Role[]
) => {
  const addNotification = useNotificationStore.getState().addNotification;

  addNotification({
    id: uuidv4(), // unique id
    title: "New Category",
    message: `${newCategory.name} has been created successfully.`,
    type: "success",
    action: "category_added",
    read: false,
    createdAt: new Date(),
    recipients,
  });
};

type Props = {
  closeBothModals: () => void;
};

// Create a type from the schema for better type safety
type CategoryFormData = z.infer<typeof categorySchema>;

const AddCategory = ({ closeBothModals }: Props) => {
  const queryClient = useQueryClient();

  // const [isLoading, setIsLoading] = useState(false);

  //  set up mutation
  const { mutate: addCategory, isPending } = useMutation({
    mutationFn: (data: CategoryFormData) => createCategory(data as Category),
    onSuccess: (newCategory) => {
      // update cache
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      // toast + notification
      toast.success("Category created successfully!");

      addCategoryNotification(newCategory, ["ADMIN", "SUPER_ADMIN"]);

      closeBothModals();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error?.response?.data?.message || "Failed to create category";
      toast.error(message);

      // Example: push to notification modal
      addErrorNotification("Failed to create the category. Please try again.");
    },
  });
  // Use CategoryFormData for the form type
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    // reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      units: [],
      description: "",
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    addCategory(data);
  };

  // const onSubmit = async (data: CategoryFormData) => {
  //   setIsLoading(true);
  //   try {
  //     await createCategory(data as Category);
  //     queryClient.invalidateQueries({ queryKey: ["categories"] });
  //     toast.success("Category created successfully");
  //     reset();
  //     closeBothModals();
  //   } catch (error) {
  //     const err = error as AxiosError<{ message: string }>;
  //     const message =
  //       err?.response?.data.message || "Failed to create category";
  //     toast.error(message);
  //     console.error("API Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-10">
      <h3 className="font-medium text-xl text-[var(--cl-text-dark)]">
        Add New Category
      </h3>

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 mt-6 border border-[#D9D9D9] p-4 rounded-[0.625rem]">
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
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Add Category"}
          </Button>
        </div>
      </div>
      {isPending && <LoadingSpinner />}
    </form>
  );
};

export default AddCategory;
