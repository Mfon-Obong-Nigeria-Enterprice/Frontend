import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-1 max-w-[282px] bg-white">
      <div>
        <img className="w-[4rem]" src="/logo.png" alt="Mfon-Enterprise Logo" />
      </div>
      <p className="font-Arial font-bold text-sm leading-tight text-[#333333] text-shadow-lg text-shadow-black/25 whitespace-normal break-words">
        Mfon-Obong Nigeria<br />Enterprise
      </p>
    </div>
  );
};

export default Logo;
