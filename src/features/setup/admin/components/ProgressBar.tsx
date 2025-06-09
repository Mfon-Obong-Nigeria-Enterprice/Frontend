import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const completed = Math.max(0, Math.min(currentStep - 1, totalSteps));
  const percentage = Math.round((completed / (totalSteps - 1)) * 100);

  const progressBarColor =
    percentage === 100
      ? "bg-[var(--cl-bg-green)]"
      : percentage > 50
      ? "bg-[var(--cl-accent-orange)]"
      : "bg-[var(--cl-accent-red)]";

  return (
    <div className="h-[115px] bg-[var(--cl-light-gray)] flex flex-col justify-center items-center gap-2 md:gap-4">
      <div className="w-[80%] mx-auto bg-[var(--cl-bg-progress)] h-2 rounded-[12px]">
        <div
          className={`${progressBarColor} h-full transition-all duration-300 ease-in-out rounded-[12px]`}
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>
      <p className="text-center text-[var(--cl-text-semidark)] font-Inter text-[0.625rem] md:text-base leading-none">
        Step {currentStep} of {totalSteps} ({percentage}% complete)
      </p>
    </div>
  );
};

export default ProgressBar;
