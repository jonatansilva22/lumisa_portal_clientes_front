import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-full px-6 py-2 mt-6 cursor-pointer font-medium shadow transition active:scale-95 ${className}`}
      {...props}
    />
  );
}