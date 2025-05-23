import React from "react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
};

const baseStyles =
  "py-3 px-26 rounded-[0.625rem] font-semibold text-base transition-all duration-200 ease-in-out focus:outline-none cursor-pointer";

const variantStyles = {
  primary: "bg-[#2ECC71] hover:bg-[#138643] text-white",
  secondary: "bg-secondary hover:opacity-90 text-white",
  outline: "bg-transparent text-blue-500 hover:text-blue-600 text-sm",
};
const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = "primary",
  fullWidth = true,
  disabled = false,
  type = "button",
}) => {
  return (
    // bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth && "w-full"} ${
        disabled && "opacity-50 cursor-not-allowed"
      }`}
    >
      {text}
    </button>
  );
};

export default Button;
