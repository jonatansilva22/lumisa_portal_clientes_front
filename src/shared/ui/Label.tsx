import { type LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label(props: LabelProps) {
  return (
    <label className="block mb-2 text-sm font-semibold text-gray-800" {...props} />
  );
}