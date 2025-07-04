import { IoIosArrowBack } from "react-icons/io";
import { BiErrorCircle } from "react-icons/bi";
import Button from "../../components/MyButton";

const MobileError = ({
  onClose,
  onSupport,
}: {
  onClose: () => void;
  onSupport?: () => void;
}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col py-[10%] items-center gap-4 bg-[var(--cl-bg-light)] p-3 mb-4 md:hidden">
      <div
        onClick={onClose}
        className="flex gap-2 bg-[var(--cl-light-gray)] items-center max-w-[95%] w-full p-6 rounded-lg cursor-pointer"
      >
        <div className="bg-white border p-0.5 rounded-full">
          <IoIosArrowBack className="text-[var(--cl-semidark)]" />
        </div>
        <span className="font-semibold text-base">
          Mfon-Obong Nigeria Enterprise
        </span>
      </div>

      <div className="bg-[var(--cl-error-light)] w-30 h-30 flex place-content-center items-center border border-[var(--cl-error)] rounded-full p-2 mt-10 text-[var(--cl-error)]">
        <BiErrorCircle size={64} />
      </div>

      <h5 className="font-medium text-xl text-[var(--cl-text-dark)] my-2">
        Error occured
      </h5>
      <div className="w-[90%] bg-[var(--cl-bg-gray)] py-4 px-2 border border-[var(--cl-secondary)] rounded-lg">
        <p className="text-[0.75rem] text-[var(--cl-text-semidark)] text-center">
          Invalid login credentials. Please check and try again.
        </p>
      </div>
      <span className="text-[0.625rem] text-[var(--cl-secondary)] text-center">
        Error code: AUTH-401
      </span>

      <Button
        onClick={onClose}
        text="Retry"
        variant="secondary"
        fullWidth={false}
      />

      <Button text="Contact Support" variant="outline" onClick={onSupport} />
    </div>
  );
};

export default MobileError;
