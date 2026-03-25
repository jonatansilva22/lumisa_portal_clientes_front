import { type TextareaHTMLAttributes, forwardRef } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  className?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = "", ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${className}`}
        {...props}
      />
    </div>
  )
);

Textarea.displayName = "Textarea";