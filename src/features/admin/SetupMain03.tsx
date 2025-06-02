import ProgressBar from "../../components/ProgressBar";

const SetupMain03: React.FC = () => {
  return (
    <main className="bg-white md:max-w-[90%] lg:max-w-[80%] w-full mx-auto rounded-[0.625rem] overflow-hidden shadow-2xl">
      <div className="bg-[#F4E8E7] min-h-[98px] md:min-h-[155px] flex flex-col items-center justify-center gap-3.5 px-5">
        <h3 className="text-text-dark font-Arial text-base md:text-2xl leading-none text-center">
          Add Product
        </h3>
        <p className="text-text-semidark font-Inter font-normal text-[0.75rem] md:text-base leading-none text-center">
          Before you can use the system, please complete this setup steps...
        </p>
      </div>
      {/* progress bar */}
      <ProgressBar currentStep={3} totalSteps={5} />
    </main>
  );
};

export default SetupMain03;
