import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CustomInputSelect = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [showValue, setShowValue] = useState("");

  return (
    <div className="relative flex items-center my-10">
      <input
        className="bg-amber-100 p-4 border"
        placeholder="enter text"
        value={showValue}
        onChange={(e) => setShowValue(e.target.value)}
        type="text"
      />
      <ChevronDown onClick={() => setShowSelect((p) => !p)} />

      {showSelect && (
        <div className="w-full absolute top-full left-0 border bg-white">
          <p className="border-b p-1" onClick={() => setShowValue("Eba")}>
            Choose me 1
          </p>
          <p className="border-b p-1" onClick={() => setShowValue("beans")}>
            Choose me 2
          </p>
          <p className="border-b p-1">Choose me 3</p>
          <p className="border-b p-1">Choose me 4</p>
          <p className="border-b p-1">Choose me 5</p>
        </div>
      )}
      {/* <select
        name=""
        id=""
        className="w-full absolute top-full left-0 border appearance-none"
      >
        <option value=""></option>
        <option value="opt">Choose me</option>
        <option value="op">Choose me</option>
        <option value="o">Choose me</option>
      </select> */}
      {/* )} */}
    </div>
  );
};

export default CustomInputSelect;
