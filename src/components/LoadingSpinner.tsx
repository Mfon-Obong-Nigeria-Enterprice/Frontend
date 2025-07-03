import React from "react";
import { Loader } from "lucide-react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center h-full w-full bg-black/10">
      <Loader className="animate-spin text-[#8c1c1380] w-8 h-8" />
    </div>
  );
};

export default LoadingSpinner;
