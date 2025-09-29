import React from "react";
import { Loader } from "lucide-react";

const InlineSpinner: React.FC = () => {
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
      <Loader className="animate-spin text-[#8c1c1380] w-4 h-4" />
    </span>
  );
};

export default InlineSpinner;
