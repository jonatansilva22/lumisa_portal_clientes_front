import { type InputHTMLAttributes, forwardRef } from "react";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className="mr-2 accent-blue-600 w-4 h-4 rounded border-gray-300 focus:ring-blue-400"
    {...props}
  />
));
Checkbox.displayName = "Checkbox";