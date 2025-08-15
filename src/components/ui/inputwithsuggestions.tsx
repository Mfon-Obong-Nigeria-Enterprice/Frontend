import { ChevronDown } from "lucide-react";

type Props = {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  requiredMessage: string;
  onChange: (value: string) => void;
};

function InputWithSuggestions({
  label,
  placeholder,
  options = [],
  value,
  requiredMessage,
  onChange,
  ...props
}: Props) {
  const listId = `${label.replace(/\s+/g, "-").toLowerCase()}-list`;

  return (
    <div className="bg-[#FFF2CE] border border-[#FFA500] rounded-md mt-10 py-2.5 px-4">
      {label && <p className="text-sm text-[#333333]">{label}</p>}

      <div className="py-4">
        <div className="bg-white border border-[#FFA500] rounded-md flex items-center px-3 no-arrow">
          <input
            list={listId}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full py-2 text-[#333333] outline-none"
            {...props}
          />
          <ChevronDown />
        </div>
        <datalist id={listId}>
          {options.map((option, idx) => (
            <option key={idx} value={option} />
          ))}
        </datalist>
      </div>

      {requiredMessage && (
        <p className="text-xs text-[#F95353]">{requiredMessage}</p>
      )}
    </div>
  );
}

export default InputWithSuggestions;
