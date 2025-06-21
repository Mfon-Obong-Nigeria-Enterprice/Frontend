import React from "react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "custom";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
};

const baseStyles =
  "px-2 rounded-[0.625rem] font-semibold text-base transition-all duration-200 ease-in-out focus:outline-none cursor-pointer";

const variantStyles = {
  primary:
    "bg-[var(--cl-bg-green)] hover:bg-[var(--cl-bg-green-hover)] text-white py-3 px-10",

  secondary:
    "bg-[var(--cl-secondary)] hover:bg-[var(--cl-secondary-hover)] text-white py-3 px-10",

  outline:
    "bg-transparent text-blue-500 hover:text-blue-600 text-sm py-3 px-10",

  custom: "",
};

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = "primary",
  fullWidth = true,
  disabled = false,
  type = "button",
  className = "",
}) => {
  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {text}
    </button>
  );
};

export default Button;
