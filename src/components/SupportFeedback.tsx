/** @format */

import { GoCheck } from "react-icons/go";
import { Button } from "./ui/button";

const SupportFeedback = ({ onClose }: { onClose: () => void }) => {
  return (
    <section className="absolute top-0 left-0 w-full h-screen bg-[var(--cl-secondary)] flex justify-center items-center px-2">
      <div className="bg-white min-h-100 max-w-[90%] rounded-xl overflow-hidden">
        <h4 className="text-center py-4 bg-[var(--cl-light-gray)] text-[var(--cl-text-dark)] text-base font-medium">
          Support Request
        </h4>

        <div className="px-5">
          <p className="py-6 font-Inter font-medium text-sm leading-loose text-center text-[var(--cl-text-semidark)] max-w-[20rem]">
            Your request has been sent to the manager. Please wait for a
            response or check back later...
          </p>
          <div className="bg-[var(--cl-success)] flex justify-center items-center mx-auto mb-6 w-20 h-20 rounded-full">
            <GoCheck size={48} className="fill-white" />
          </div>

          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full bg-[#D9D9D9] hover:bg-[#D9D9D9]/90 h-12 mt-5"
          >
            Close
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SupportFeedback;
