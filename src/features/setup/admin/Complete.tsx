import { useNavigate } from "react-router-dom";
import SetupTitle from "./components/SetupTitle";
import ProgressBar from "./components/ProgressBar";
import Button from "@/components/MyButton";

import { FaCircleCheck } from "react-icons/fa6";

const Complete: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <SetupTitle
        title="Set-up Complete!"
        description="Your system is ready for business"
      />
      <ProgressBar currentStep={5} totalSteps={5} />
      <div className="px-6 py-24 flex flex-col justify-center items-center gap-6">
        <div className="flex place-items-center justify-center w-[12.5rem] h-[12.5rem] rounded-full bg-[#E0DDDD]">
          <FaCircleCheck className="fill-[#2ECC71] h-[10.3125rem] w-[10.3125rem]" />
        </div>
        <h5 className="text-[var(--cl-text-dark)] font-bold text-4xl leading-none">
          Setup Compete!
        </h5>
        <p className="text-base leading-relaxed text-[#444444] max-w-prose text-center">
          Your Construction materials is ready for business. You can now start
          recording sales, manage inventory and tracking client accounts.
        </p>

        <div className="mt-10">
          <Button
            text="Go to Dashboard now"
            onClick={() => navigate("/admin/dashboard/overview")}
          />
        </div>
      </div>
    </div>
  );
};

export default Complete;
