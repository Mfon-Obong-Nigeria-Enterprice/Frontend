import { GoCheck } from "react-icons/go";
import Button from "./Button";

const SupportFeedback = ({ onClose }: { onClose: () => void }) => {
  return (
    <section className="absolute top-0 left-0 w-full h-screen bg-slate-100 flex justify-center items-center px-2">
      <div className="bg-white min-h-100 max-w-[90%] rounded-xl overflow-hidden">
        <h4 className="text-center py-4 bg-[#F0F0F3] text-text-dark text-base font-medium">
          Support Request
        </h4>

        <div className="px-5">
          <p className="py-6 font-Inter font-medium text-sm leading-loose text-center max-w-[20rem]">
            Your request as been sent to the manager. Please wait for a response
            or check back later...
          </p>
          <div className="bg-[#64FF5C] flex justify-center items-center mx-auto mb-6 w-20 h-20 rounded-full">
            <GoCheck size={48} className="fill-white" />
          </div>

          <Button
            text="Close"
            fullWidth={true}
            variant="secondary"
            onClick={onClose}
          />
        </div>
      </div>
    </section>
  );
};

export default SupportFeedback;
