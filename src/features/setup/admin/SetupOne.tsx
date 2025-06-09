import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSetupSchema } from "../../../lib/zodUtils.ts";
import { type AdminSetupData } from "../../../types/types.ts";
import SetupTitle from "./components/SetupTitle.tsx";
import ProgressBar from "./components/ProgressBar.tsx";
import InputField from "@/components/InputField.tsx";

const SetupOne = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSetupData>({
    resolver: zodResolver(adminSetupSchema),
    mode: "onBlur",
  });
  const onSubmit = (data: AdminSetupData) => {
    console.log(data);
    // navigate("/admin-setup-02");
  };

  return (
    <div>
      <SetupTitle
        title="Business Information"
        description="Before you can use the system, please complete this setup steps..."
      />
      <ProgressBar currentStep={1} totalSteps={5} />
      <div className="px-4 md:px-10 py-10">
        <h3 className="pb-6 text-[var(--cl-text-dark)] font-Inter font-medium text-base md:text-lg lg:text-xl leading-none">
          Business Details
        </h3>

        {/* business name */}
        <div className="flex flex-col justify-around rounded-[0.625rem] bg-[var(--cl-bg-gray)] gap-3 px-3 md:px-10 py-6">
          <p className="text-[var(--cl-text-gray)] font-Inter text-base md:text-sm leading-none">
            Business name
          </p>
          <div className="bg-white h-[53px] max-w-[665px] w-[98%] md:w-[90%] lg:w-[50%] px-5 flex items-center rounded-[0.625rem]">
            <p className="text-[var(--cl-secondary)] font-Inter font-medium text-[0.75rem] md:text-sm leading-none">
              Mfon-Obong Nigeria Enterprise
            </p>
          </div>
          <p className="text-[var(--cl-text-semidark)] font-Inter text-[0.75rem] leading-none">
            This will appear on receipt and invoices
          </p>
        </div>

        {/* Form details */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 lg:grid lg:grid-cols-3 md:gap-8 mt-5 md:mt-10"
        >
          <div>
            <InputField
              label="Business phone number"
              id="admin-phoneNumber"
              type="tel"
              placeholder="+234 xxx xxx xxx"
              variant="setup"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
          </div>
          <div>
            <InputField
              label="Business email (Optional)"
              type="email"
              id="admin-email"
              placeholder="info@business.com"
              variant="setup"
              {...register("businessEmail")}
              error={errors.businessEmail?.message}
            />
          </div>
          <div>
            <InputField
              label="Business address"
              type="text"
              id="admin-address"
              variant="setup"
              placeholder="Enter your business Adress"
              {...register("businessAddress")}
              error={errors.businessAddress?.message}
            />
          </div>
          {/* submit button */}
          {/* <div className="lg:ml-auto lg:col-span-3"> */}
          {/* <Button text="Continue" type="submit" /> */}
          {/* </div> */}
        </form>
      </div>
    </div>
  );
};

export default SetupOne;
