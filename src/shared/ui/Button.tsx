import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`bg-gray-100 hover:bg-gray-200 rounded-full px-6 py-2 mt-6 cursor-pointer text-gray-800 font-medium shadow transition active:scale-95 ${className}`}
      {...props}
    />
  );
}