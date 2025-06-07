import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AdminSetupCatData } from "../../../types/types";
import { adminCategorySetupSchema } from "@/lib/zodUtils";

import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";

import SetupTitle from "./components/SetupTitle";
import ProgressBar from "./components/ProgressBar";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

import { setupTips } from "../../../data/setupTips";
import { categoryUnit } from "../../../data/categoryUnit";
import { useCategoryStore } from "../../../store/useCategoryStore";

const SetupTwo = () => {
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
      <SetupTitle
        title=" Add Inventory Categories"
        description=" Before you can use the system, please complete this setup steps..."
      />
      <ProgressBar currentStep={2} totalSteps={5} />

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-10">
        <h3 className="font-medium font-Inter text-xl leading-none text-text-dark">
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
              placeholder=""
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

      {/* data display */}
      <section className="bg-[#F5F5F5] px-4 py-4 rounded-[0.625rem] flex flex-col gap-3 mb-8 mx-8">
        {categories.length === 0 ? (
          <p className="text-base italic text-text-semidark py-8 text-center">
            No categories have been added yet.
          </p>
        ) : (
          categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white rounded-sm p-5 flex gap-2 items-center"
            >
              <div className="flex-1">
                <h5>Category name: {cat.categoryName}</h5>
                <p>Unit: {cat.categoryUnit}</p>
                {cat.categoryDescription && <p>{cat.categoryDescription}</p>}
              </div>
              <div className="flex gap-3">
                <MdOutlineEdit className="text-[#FFA500]" />
                <MdOutlineDelete />
              </div>
            </div>
          ))
        )}
      </section>

      {/* tips */}
      <div className="bg-[#e2f3eb] border border-[#2ECC71] mx-6 mb-10 rounded-[0.625rem] py-2 px-10">
        <h6>Set up Tips</h6>
        <ul className="list-disc rounded-lg">
          {setupTips.map((tip, index) => (
            <li key={index} className="text-[#0B6E35]">
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SetupTwo;
