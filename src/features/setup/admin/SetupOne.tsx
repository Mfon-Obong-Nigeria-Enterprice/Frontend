import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSetupSchema } from "@/lib/zodUtils.ts";
import { type AdminSetupData } from "@/types/types.ts";
import { useAdminSetupStore } from "@/store/adminsetup.ts";

import SetupTitle from "./components/SetupTitle.tsx";
import ProgressBar from "./components/ProgressBar.tsx";
import InputField from "@/components/InputField.tsx";

const SetupOne = () => {
  const { data, setField, setFormSubmit } = useAdminSetupStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger, // Add trigger for manual validation
  } = useForm<AdminSetupData>({
    resolver: zodResolver(adminSetupSchema),
    mode: "onBlur",
    defaultValues: {
      phoneNumber: data.phoneNumber || "",
      businessEmail: data.businessEmail || "",
      businessAddress: data.businessAddress || "",
    },
  });

  useEffect(() => {
    // Fixed: Proper async function handling
    setFormSubmit(async () => {
      const isValid = await trigger(); // Trigger validation first
      if (!isValid) {
        throw new Error("Form validation failed");
      }

      return new Promise((resolve) => {
        handleSubmit((formData: AdminSetupData) => {
          // Save valid data to store
          for (const [key, value] of Object.entries(formData)) {
            setField(key as keyof AdminSetupData, value);
          }
          console.log("Step 1 saved to store:", formData);
          resolve();
        })();
      });
    });

    return () => {
      setFormSubmit(null);
    };
  }, [handleSubmit, setField, setFormSubmit, trigger]);

  const onSubmit = (formData: AdminSetupData) => {
    for (const [key, value] of Object.entries(formData)) {
      setField(key as keyof AdminSetupData, value);
    }
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
              placeholder="Enter your business Address"
              {...register("businessAddress")}
              error={errors.businessAddress?.message}
            />
          </div>
          {/* hidden submit button */}
          {/* <button type="submit" className="hidden" /> */}
        </form>
      </div>
    </div>
  );
};

export default SetupOne;
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { adminSetupSchema } from "@/lib/zodUtils.ts";
// import { type AdminSetupData } from "@/types/types.ts";
// import { useAdminSetupStore } from "@/store/adminsetup.ts";

// import SetupTitle from "./components/SetupTitle.tsx";
// import ProgressBar from "./components/ProgressBar.tsx";
// import InputField from "@/components/InputField.tsx";

// const SetupOne = () => {
//   const { data, setField, setFormSubmit } = useAdminSetupStore();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<AdminSetupData>({
//     resolver: zodResolver(adminSetupSchema),
//     mode: "onBlur",
//     defaultValues: {
//       phoneNumber: data.phoneNumber || "",
//       businessEmail: data.businessEmail || "",
//       businessAddress: data.businessAddress || "",
//     },
//   });

//   useEffect(() => {
//     setFormSubmit(() =>
//       handleSubmit((formData: AdminSetupData) => {
//         // save valid data to store
//         for (const [key, value] of Object.entries(formData)) {
//           setField(key as keyof AdminSetupData, value);
//         }
//         console.log("Step 1 saved to store:", formData);
//       })
//     );
//     return () => {
//       setFormSubmit(null);
//     };
//   }, [handleSubmit, setField, setFormSubmit]);

//   const onSubmit = (formData: AdminSetupData) => {
//     for (const [key, value] of Object.entries(formData)) {
//       setField(key as keyof AdminSetupData, value);
//     }
//   };

//   return (
//     <div>
//       <SetupTitle
//         title="Business Information"
//         description="Before you can use the system, please complete this setup steps..."
//       />
//       <ProgressBar currentStep={1} totalSteps={5} />
//       <div className="px-4 md:px-10 py-10">
//         <h3 className="pb-6 text-[var(--cl-text-dark)] font-Inter font-medium text-base md:text-lg lg:text-xl leading-none">
//           Business Details
//         </h3>

//         {/* business name */}
//         <div className="flex flex-col justify-around rounded-[0.625rem] bg-[var(--cl-bg-gray)] gap-3 px-3 md:px-10 py-6">
//           <p className="text-[var(--cl-text-gray)] font-Inter text-base md:text-sm leading-none">
//             Business name
//           </p>
//           <div className="bg-white h-[53px] max-w-[665px] w-[98%] md:w-[90%] lg:w-[50%] px-5 flex items-center rounded-[0.625rem]">
//             <p className="text-[var(--cl-secondary)] font-Inter font-medium text-[0.75rem] md:text-sm leading-none">
//               Mfon-Obong Nigeria Enterprise
//             </p>
//           </div>
//           <p className="text-[var(--cl-text-semidark)] font-Inter text-[0.75rem] leading-none">
//             This will appear on receipt and invoices
//           </p>
//         </div>

//         {/* Form details */}
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="flex flex-col gap-5 lg:grid lg:grid-cols-3 md:gap-8 mt-5 md:mt-10"
//         >
//           <div>
//             <InputField
//               label="Business phone number"
//               id="admin-phoneNumber"
//               type="tel"
//               placeholder="+234 xxx xxx xxx"
//               variant="setup"
//               {...register("phoneNumber")}
//               error={errors.phoneNumber?.message}
//             />
//           </div>
//           <div>
//             <InputField
//               label="Business email (Optional)"
//               type="email"
//               id="admin-email"
//               placeholder="info@business.com"
//               variant="setup"
//               {...register("businessEmail")}
//               error={errors.businessEmail?.message}
//             />
//           </div>
//           <div>
//             <InputField
//               label="Business address"
//               type="text"
//               id="admin-address"
//               variant="setup"
//               placeholder="Enter your business Adress"
//               {...register("businessAddress")}
//               error={errors.businessAddress?.message}
//             />
//           </div>
//           {/* hidden submit button */}
//           <button type="submit" className="hidden" />

//           {/* <div className="lg:ml-auto lg:col-span-3"> */}
//           {/* <Button text="Continue" type="submit" /> */}
//           {/* </div> */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SetupOne;
