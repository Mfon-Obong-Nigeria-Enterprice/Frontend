import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProgressBar from "../../components/ProgressBar";
import { adminCategorySetupSchema } from "../../lib/zodUtils";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";

type AdminSetupData = z.infer<typeof adminCategorySetupSchema>;

const setupTips: [string, string, string] = [
  "Categories help organize your Inventory by product type",
  "Create specific categories for different building materials",
  "You can add more categories later as needed",
];

const SetupMain02 = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminSetupData>({
    resolver: zodResolver(adminCategorySetupSchema),
    mode: "onBlur",
  });

  const [categories, setCategories] = useState<AdminSetupData[]>([]);

  const onSubmit = (data: AdminSetupData) => {
    const duplicate = categories.some(
      (cat) =>
        cat.categoryName.toLowerCase() === data.categoryName.toLowerCase()
    );
    if (duplicate) {
      alert("This category already exists!");
      return;
    }
    setCategories((category) => [...category, data]);
    reset();
  };

  return (
    <main className="bg-white md:max-w-[90%] lg:max-w-[80%] w-full mx-auto rounded-[0.625rem] overflow-hidden shadow-2xl">
      <div className="bg-[#F4E8E7] min-h-[98px] md:min-h-[155px] flex flex-col items-center justify-center gap-3.5 px-5">
        <h3 className="text-text-dark font-Arial text-base md:text-2xl leading-none text-center">
          Add Inventory Categories
        </h3>
        <p className="text-text-semidark font-Inter font-normal text-[0.75rem] md:text-base leading-none text-center">
          Before you can use the system, please complete this setup steps...
        </p>
      </div>
      {/* progress bar */}
      <ProgressBar currentStep={2} totalSteps={5} />

      {/* Form details */}
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
              options={["bags", "pics"]}
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

      {/* data */}
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
                <p>Stock: {cat.categoryUnit}</p>
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

      {/* buttons */}
      <div className="flex justify-between mb-10 mx-10">
        <div className="border border-secondary rounded-lg text-secondary">
          <Button
            text="Back"
            variant="outline"
            onClick={() => navigate("/admin-setup")}
          />
        </div>

        <div>
          <Button
            text="Continue"
            onClick={() => navigate("/admin-setup-page-03")}
          />
        </div>
      </div>
    </main>
  );
};

export default SetupMain02;
