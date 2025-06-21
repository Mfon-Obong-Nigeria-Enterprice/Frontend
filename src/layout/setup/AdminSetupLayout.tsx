import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";

import SetupHeader from "@/features/setup/admin/components/SetupHeader";
import Button from "@/components/MyButton";
import { useAdminSetupStore } from "@/store/adminsetup";
import { adminSetupSchema } from "@/lib/zodUtils";

const steps = [
  "step-01",
  "step-02",
  "step-03",
  "step-04",
  "review",
  "complete",
];

const AdminSetupLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formSubmit, data } = useAdminSetupStore(); // Added data to destructuring

  const currentStepIndex = steps.findIndex((step) =>
    location.pathname.endsWith(step)
  );

  const safeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  const onNext = async () => {
    if (!formSubmit) {
      console.warn("No form submit function available");
      return;
    }

    try {
      await formSubmit(); // Triggers validation and saves data

      // Get fresh data from store after submission
      const { data: currentData } = useAdminSetupStore.getState();

      // For step validation, you might want to validate specific fields per step
      // instead of the entire schema at once
      const parsed = adminSetupSchema.safeParse(currentData);

      if (!parsed.success) {
        console.error("Validation errors:", parsed.error.format());
        alert("🚫 Please fill in all required fields correctly.");
        return;
      }

      // Navigate to next step
      if (safeIndex < steps.length - 1) {
        navigate(steps[safeIndex + 1]);
      }
    } catch (error) {
      console.error("Form submission or validation failed:", error);
      alert("🚫 Something went wrong. Please try again.");
    }
  };

  const onBack = () => {
    if (safeIndex > 0) {
      // Fixed: should be > 0, not >= 0
      navigate(steps[safeIndex - 1]);
    }
  };

  const isFirstStep = safeIndex === 0;
  const isReviewStep = steps[safeIndex] === "review";
  const isCompletedStep = steps[safeIndex] === "complete";

  return (
    <div className="bg-[var(--cl-bg-light)] md:py-10">
      <SetupHeader />
      <main className="bg-white md:max-w-[90%] lg:max-w-[80%] w-full mx-auto rounded-[0.625rem] overflow-hidden">
        <Outlet />
        <ScrollRestoration />
        {!isCompletedStep && (
          <div className="flex justify-between mb-10 mx-10">
            {!isFirstStep && (
              <Button
                text="Back"
                variant="custom"
                onClick={onBack}
                fullWidth={false}
                className="text-[var(--cl-text-semidark)] border border-[var(--cl-secondary)] rounded-lg hover:bg-[var(--cl-light-gray)] hover:text-gray-500 px-10"
              />
            )}
            <div className={isFirstStep ? "ml-auto" : ""}>
              <Button
                text={isReviewStep ? "Confirm Setup" : "Continue"}
                onClick={onNext}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSetupLayout;

// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { ScrollRestoration } from "react-router-dom";

// import SetupHeader from "@/features/setup/admin/components/SetupHeader";
// import Button from "@/components/MyButton";
// import { useAdminSetupStore } from "@/store/adminsetup";
// import { adminSetupSchema } from "@/lib/zodUtils";

// const steps = [
//   "step-01",
//   "step-02",
//   "step-03",
//   "step-04",
//   "review",
//   "complete",
// ];

// const AdminSetupLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { formSubmit } = useAdminSetupStore();

//   const currentStepIndex = steps.findIndex((step) =>
//     location.pathname.endsWith(step)
//   );

//   const safeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

//   const isValid = adminSetupSchema.safeParse(data).success;

//   const onNext = async () => {
//     if (!formSubmit) return;

//     try {
//       await formSubmit(); // Triggers `handleSubmit` in step component
//       const { data } = useAdminSetupStore.getState();

//       const parsed = adminSetupSchema.safeParse(data);
//       if (!parsed.success) {
//         alert("🚫 Please fill in all required fields correctly.");
//         return;
//       }

//       if (safeIndex < steps.length - 1) {
//         navigate(steps[safeIndex + 1]);
//       }
//     } catch (error) {
//       console.error("Form submission or validation failed:", error);
//       alert("🚫 Something went wrong. Please try again.");
//     }
//   };

//   // const onNext = async () => {
//   //   if (formSubmit) {
//   //     try {
//   //       await formSubmit();
//   //       const { data } = useAdminSetupStore.getState();
//   //       const isStepValid = Object.values(store.data).some((v) => v !== "");
//   //     } catch {}
//   //     if (isStepValid) {
//   //       navigate(steps[safeIndex + 1]);
//   //     }
//   //     alert("Form is invalid or empty");
//   //   }
//   //   // if (safeIndex < steps.length - 1) {
//   //   // }
//   // };

//   const onBack = () => {
//     if (safeIndex >= 0) {
//       navigate(steps[safeIndex - 1]);
//     }
//   };

//   const isFirstStep = safeIndex === 0;
//   const isReviewStep = steps[safeIndex] === "review";
//   const isCompletedStep = steps[safeIndex] === "complete";

//   return (
//     <div className="bg-[var(--cl-bg-light)] md:py-10">
//       <SetupHeader />
//       <main className="bg-white md:max-w-[90%] lg:max-w-[80%] w-full mx-auto rounded-[0.625rem] overflow-hidden">
//         <Outlet />
//         <ScrollRestoration />
//         {!isCompletedStep && (
//           <div className="flex justify-between mb-10 mx-10">
//             {!isFirstStep && (
//               <Button
//                 text="Back"
//                 variant="custom"
//                 onClick={onBack}
//                 fullWidth={false}
//                 className="text-[var(--cl-text-semidark)] border border-[var(--cl-secondary)] rounded-lg hover:bg-[var(--cl-light-gray)] hover:text-gray-500 px-10"
//               />
//             )}
//             <div className={isFirstStep ? "ml-auto" : ""}>
//               <Button
//                 text={isReviewStep ? "Confirm Setup" : "Continue"}
//                 onClick={onNext}
//               />
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AdminSetupLayout;
