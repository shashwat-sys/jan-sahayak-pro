import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

type BaseFieldProps = {
  label: string;
  name?: string;
};

type InputFieldProps = BaseFieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "name">;

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, name, ...props },
  ref,
) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input ref={ref} id={name} name={name} {...props} />
    </div>
  );
});

type SelectFieldProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> & {
    options: Array<{ label: string; value: string } | string>;
  };

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, name, options, ...props }, ref) {
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <select ref={ref} id={name} name={name} {...props}>
          {options.map((option) => {
            const value = typeof option === "string" ? option : option.value;
            const optionLabel = typeof option === "string" ? option : option.label;
            return (
              <option key={value} value={value}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      </div>
    );
  },
);

type TextAreaFieldProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name">;

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ label, name, ...props }, ref) {
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <textarea ref={ref} id={name} name={name} {...props} />
      </div>
    );
  },
);
