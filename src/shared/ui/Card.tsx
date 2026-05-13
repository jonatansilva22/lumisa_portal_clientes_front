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
        p-2 sm:p-4 md:p-6 m-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}