import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AdminSetupCatData } from "@/types/types";
import { adminCategorySetupSchema } from "@/lib/zodUtils";
import InputField from "./InputField";
import Button from "./MyButton";
import { categoryUnit } from "@/data/categoryUnit";
import { useCategoryStore } from "@/store/useCategoryStore";

const AddCategory = () => {
  const { categories, addCategory } = useCategoryStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminSetupCatData>({
    resolver: zodResolver(adminCategorySetupSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: AdminSetupCatData) => {
    const duplicate = categories.some(
      (cat) =>
        cat.categoryName.toLowerCase() === data.categoryName.toLowerCase()
    );
    if (duplicate) {
      alert("This category already exists!");
      return;
    }
    addCategory(data);
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-10">
        <h3 className="font-medium font-Inter text-xl leading-none text-[var(--cl-text-dark)]">
          Add New Category
        </h3>
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 md:gap-8 mt-5 md:mt-10 border border-[#D9D9D9] rounded-[0.625rem] p-4">
          <div>
            <InputField
              label="Category name"
              id="categoryName"
              type="text"
              placeholder=""
              {...register("categoryName")}
              error={errors.categoryName?.message}
            />
          </div>
          <div>
            <InputField
              label="Measure unit"
              id="categoryUnit"
              options={categoryUnit}
              {...register("categoryUnit")}
              error={errors.categoryUnit?.message}
            />
          </div>
          <div className="md:col-span-2 min-h-[4rem]">
            <InputField
              label="Description (Optional)"
              id="categoryDescription"
              textarea
              placeholder="Describe the category here..."
              variant="default"
              {...register("categoryDescription")}
            />
          </div>
        </div>
        {/* submit button */}
        <div className="w-full lg:w-[30%] mt-5">
          <Button text="Add Category" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
