import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";

import { adminProductSetupSchema } from "@/lib/zodUtils";
import { type AdminSetupProd } from "@/types/types";
import { useCategoryStore } from "@/stores/useCategoryStore";

import SetupTitle from "./components/SetupTitle";
import ProgressBar from "./components/ProgressBar";
import InputField from "@/components/InputField";
import Button from "@/components/MyButton";
import { categoryUnit as unitOptions } from "@/data/categoryUnit";

const SetupThree: React.FC = () => {
  const { categories } = useCategoryStore();
  const [products, setProducts] = useState<AdminSetupProd[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const selectedCategoryUnit = Array.isArray(categories)
    ? categories.find((cat) => cat.categoryName === selectedCategory)
        ?.categoryUnit || ""
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminSetupProd>({
    resolver: zodResolver(adminProductSetupSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: AdminSetupProd) => {
    const duplicate = products.some(
      (prod) =>
        prod.productName.toLowerCase() === data.productName.toLowerCase()
    );
    if (duplicate) {
      alert("This product already exists!");
      return;
    }

    setProducts((prev) => [...prev, data]);
    reset();
  };

  return (
    <div>
      <SetupTitle
        title="Add Product"
        description="Before you can use the system, please complete this setup steps..."
      />
      <ProgressBar currentStep={3} totalSteps={5} />

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-10">
        <h3 className="font-medium font-Inter text-xl leading-none text-[var(--cl-text-dark)]">
          Add Product
        </h3>

        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 md:gap-8 mt-5 md:mt-10 border border-[var(--cl-border-gray)] rounded-[0.625rem] p-4">
          <InputField
            label="Product name"
            id="productName"
            placeholder="Name of product"
            {...register("productName")}
            error={errors.productName?.message}
          />

          <InputField
            label="Product Category"
            id="categoryName"
            options={
              Array.isArray(categories)
                ? categories.map((cat) => cat.categoryName)
                : []
            }
            {...register("categoryName")}
            onChange={(e) => setSelectedCategory(e.target.value)}
            error={errors.categoryName?.message}
          />

          <InputField
            label="Primary unit"
            id="productUnit"
            options={unitOptions}
            value={selectedCategoryUnit || unitOptions}
            {...register("productUnit")}
            error={errors.productUnit?.message}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <InputField
            label="Secondary unit (optional)"
            id="secondUnit"
            {...register("secondUnit")}
            error={errors.secondUnit?.message}
          />
          <InputField
            label="Conversion rate (if applicable)"
            id="unitConversion"
            placeholder="e.g. 50 pounds per bag"
            {...register("unitConversion")}
            error={errors.unitConversion?.message}
          />
          <InputField
            label="Initial quantity"
            id="initialQuantity"
            placeholder="Per Primary units"
            {...register("initialQuantity")}
            error={errors.initialQuantity?.message}
          />
          <InputField
            label="Price per unit"
            id="unitPrice"
            placeholder="#0.00"
            {...register("unitPrice")}
            error={errors.unitPrice?.message}
          />
          <InputField
            label="Low stock alert level"
            id="lowStockAlert"
            placeholder="Enter quantity"
            {...register("lowStockAlert")}
            error={errors.lowStockAlert?.message}
          />
        </div>

        <div className="w-full lg:w-[30%] mt-5">
          <Button text="Add Product" type="submit" />
        </div>
      </form>

      {/* display the data */}
      <section className="bg-[#F5F5F5] px-4 py-4 rounded-[0.625rem] flex flex-col gap-3 mb-8 mx-8">
        {products.length === 0 ? (
          <p className="text-base italic text-[var(--cl-text-semidark)] py-8 text-center">
            No Products have been added yet.
          </p>
        ) : (
          products.map((prod, index) => (
            <div
              key={index}
              className="bg-white rounded-sm p-5 flex gap-2 items-center"
            >
              <div className="flex-1">
                <p className="font-medium text-[#333333] text-sm leading-tight">
                  Product:
                  <span className="font-normal">{prod.productName}</span>
                </p>
                <p className="font-medium text-[#333333] text-sm leading-tight">
                  Category:{" "}
                  <span className="font-normal">{prod.categoryName}</span>
                </p>
                <p className="font-medium text-[#333333] text-sm leading-tight">
                  Primary Unit:{" "}
                  <span className="font-normal">{prod.productUnit}</span>
                </p>
                {prod.secondUnit && (
                  <p className="font-medium text-[#333333] text-sm leading-tight">
                    Secondary Unit:{" "}
                    <span className="font-normal">{prod.secondUnit}</span>
                  </p>
                )}
                {prod.unitConversion && (
                  <p className="font-medium text-[#333333] text-sm leading-tight">
                    Conversion:{" "}
                    <span className="font-normal">{prod.unitConversion}</span>
                  </p>
                )}
                <p className="font-medium text-[#333333] text-sm leading-tight">
                  Initial Quantity:{" "}
                  <span className="font-normal">{prod.initialQuantity}</span>
                </p>
                <p className="font-medium text-[#333333] text-sm leading-tight">
                  Price per Unit:{" "}
                  <span className="font-normal">{`₦${prod.unitPrice}`}</span>
                </p>
                <p className="font-medium text-[#333333] text-sm leading-tight">
                  Low Stock Alert Level:{" "}
                  <span className="font-normal">{prod.lowStockAlert}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <MdOutlineEdit className="text-[#FFA500] cursor-pointer" />
                <MdOutlineDelete className="cursor-pointer" />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default SetupThree;
