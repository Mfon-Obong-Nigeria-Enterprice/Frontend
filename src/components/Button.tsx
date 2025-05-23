import React from "react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
};

const baseStyles =
  "p-3 rounded-[0.625rem] font-semibold text-base transition-all duration-200 focus:outline-none cursor-pointer";

const variantStyles = {
  primary: "bg-[#2ECC71] hover:bg-green-500 text-white",
  secondary: "bg-secondary hover:bg-text-semidark text-white",
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
