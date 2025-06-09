import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";

import SetupHeader from "@/features/setup/admin/components/SetupHeader";
import Button from "@/components/MyButton";

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

  const currentStepIndex = steps.findIndex((step) =>
    location.pathname.endsWith(step)
  );

  const safeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  const onNext = () => {
    if (safeIndex < steps.length - 1) {
      navigate(steps[safeIndex + 1]);
    }
  };

  const onBack = () => {
    if (safeIndex >= 0) {
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
