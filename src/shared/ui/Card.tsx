import { type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-2xl border border-gray-200
        px-6 py-6 m-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}