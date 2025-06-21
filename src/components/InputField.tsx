import React, { forwardRef } from "react";

type InputProps = {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  error?: string;
  options?: string[];
  textarea?: boolean;
  variant?: "default" | "setup";
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      placeholder = "",
      type = "text",
      error,
      options,
      textarea = false,
      variant = "default",
      ...rest
    },
    ref
  ) => {
    const baseContainerStyles = "flex flex-col justify-center gap-3";

    const variantContainerStyles =
      variant === "setup"
        ? "bg-[var(--cl-bg-gray)] rounded-[0.625rem] px-3 md:px-10 lg:px-4 py-6"
        : "";

    const baseInputStyles =
      "bg-white w-full px-3 md:px-3 py-2 text-[var(--cl-secondary)] rounded-[0.625rem] outline-gray-100 focus:border focus:border-gray-100";

    const variantInputStyles = variant === "setup" ? " border-0" : "";

    const defaultInput =
      variant === "default" ? "border border-[var(--cl-secondary)]" : "";

    return (
      <>
        <fieldset
          className={`${baseContainerStyles} ${variantContainerStyles}`}
        >
          <label
            htmlFor={id}
            className="font-Inter font-normal text-[var(--cl-text-gray)] text-sm leading-none"
          >
            {label}
          </label>

          {textarea ? (
            <textarea
              id={id}
              placeholder={placeholder}
              rows={4}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={`${baseInputStyles} ${variantInputStyles} ${defaultInput}`}
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : options ? (
            <select
              id={id}
              ref={ref as React.Ref<HTMLSelectElement>}
              className={`${baseInputStyles} ${variantInputStyles} ${defaultInput}`}
              {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
            >
              <option value="" disabled>
                --Select unit --
              </option>

              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={id}
              placeholder={placeholder}
              ref={ref as React.Ref<HTMLInputElement>}
              className={`${baseInputStyles} ${variantInputStyles} ${defaultInput}`}
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {/* max-w-[665px] w-[98%] md:w-[90%] */}
        </fieldset>
        {error && <p className="text-error text-sm pt-1">{error}</p>}
      </>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
