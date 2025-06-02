import React from "react";

const SetupHeader: React.FC = () => {
  return (
    //   shadow-[10px_15px_10px_0_rgba(0, 0, 0, 0.25)]

    //   font-family: Arial;

    <header className="bg-white h-[171px] md:h-[191px] md:max-w-[90%] lg:max-w-[80%] w-full mx-auto px-4 flex flex-col justify-center items-center gap-4 mb-5 lg:mb-16 rounded-[0.625rem] shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <img src="/logo.png" alt="" className="w-14 md:w-24" />

        <h1 className="text-dark font-bold text-lg md:text-[2rem] lg:text-4xl leading-none font-Arial mt-5">
          Admin Set-up Guide
        </h1>
      </div>
      <p className="text-secondary font-Arial text-sm md:text-lg lg:text-2xl leading-none text-center">
        Lets get your construction materials system ready for business
      </p>
    </header>
  );
};

export default SetupHeader;
