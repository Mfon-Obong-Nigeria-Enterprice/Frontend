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
      ? "bg-[#2ECC71]"
      : percentage > 50
      ? "bg-[#FFA500]"
      : "bg-[#DA251C]";

  return (
    <div className="h-[115px] bg-[#F0F0F3] flex flex-col justify-center items-center gap-2 md:gap-4">
      <div className="w-[80%] mx-auto bg-[#E3E3E3] h-2 rounded-[12px]">
        <div
          className={`${progressBarColor} h-full transition-all duration-300 ease-in-out rounded-[12px]`}
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>
      <p className="text-center text-text-semidark font-Inter text-[0.625rem] md:text-base leading-none">
        Step {currentStep} of {totalSteps} ({percentage}% complete)
      </p>
    </div>
  );
};

export default ProgressBar;
