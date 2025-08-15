import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toSentenceCaseName } from "@/utils/styles";

interface WalkinClientDetailBoxProps {
  onDataChange?: (data: { name: string; phone: string }) => void;
  data?: { name: string; phone: string };
}

const WalkinClientDetailBox: React.FC<WalkinClientDetailBoxProps> = ({
  onDataChange,
  data = { name: "", phone: "" },
}) => {
  const [formData, setFormData] = useState(data);

  // Update local state when prop changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Notify parent component of changes
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  return (
    <div className="p-4 border border-[#D9D9D9] rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 space-y-4">
        <div>
          <Label className="text-[#333333] text-sm font-medium mb-2 block">
            Client Name *
          </Label>
          <Input
            type="text"
            placeholder="Enter client name"
            value={toSentenceCaseName(formData.name)}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div>
          <Label className="text-[#333333] text-sm font-medium mb-2 block">
            Phone Number (Optional)
          </Label>
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default WalkinClientDetailBox;

// import { Input } from "@/components/ui/input";

// const WalkinClientDetailBox = () => {
//   return (
//     <div className="bg-[#F5F5F5] px-5 py-6 my-5 rounded-md">
//       <h5 className="font-medium">Client Information</h5>
//       <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//         {/* walk-in client name */}
//         <div className="flex flex-col gap-2">
//           <label htmlFor="walkinClientName" className="text-[#444444] text-sm">
//             Walk-in Client Name
//           </label>
//           <Input
//             className="w-full !bg-white text-[13px] text-[#7D7D7D]"
//             placeholder="Enter walk-in client's name"
//           />
//         </div>

//         {/* walk-in client phone number */}
//         <div className="flex flex-col gap-2">
//           <label htmlFor="walkinClientName" className="text-[#444444] text-sm">
//             Phone Number (Optional)
//           </label>
//           <Input
//             className="w-full !bg-white text-[13px] text-[#7D7D7D]"
//             placeholder="Enter walk-in client's name"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default WalkinClientDetailBox;
