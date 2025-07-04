import { useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
};

const TagInput = ({
  value,
  onChange,
  placeholder,
  className,
}: TagInputProps) => {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) {
        addTag(input.trim());
        setInput("");
      }
    }

    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div
      className={cn(
        "border p-2 rounded flex flex-wrap gap-2 min-h-[1rem]",
        className
      )}
    >
      {value.map((tag, i) => (
        <div
          key={i}
          className="bg-gray-200 px-2 py-1 rounded flex items-center"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="ml-1 text-red-500 font-bold"
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-grow outline-none px-2"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        onClick={() => {
          if (input.trim()) {
            addTag(input.trim());
            setInput("");
          }
        }}
        className="text-green-600 px-1 pt-1 rounded hover:bg-green-100 text-xs"
      >
        + Add
      </button>
    </div>
  );
};

export default TagInput;
