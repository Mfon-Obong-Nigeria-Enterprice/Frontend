import React from "react";

const Logo: React.FC = () => {
  //  items-baseline-last
  return (
    <div className="flex items-center gap-1 max-w-[282px] bg-white">
      <div>
        <img className="w-[4rem]" src="/logo.png" alt="Mfon-Enterprise Logo" />
      </div>
      <p className="font-Arial font-bold text-sm leading-none text-[#333333]">
        Mfon-Obong Nigerian Enterprise
      </p>
    </div>
  );
};

export default Logo;
