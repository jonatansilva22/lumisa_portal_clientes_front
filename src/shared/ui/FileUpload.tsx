import { useRef } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

type FileUploadProps = {
  label?: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  accept?: string;
  className?: string;
};

export function FileUpload({
  label = "Subir imagen",
  onChange,
  value,
  accept = "image/*",
  className = "",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`w-full ${className}`}>
      <label className="block mb-1 font-medium">{label}</label>
      <button
        type="button"
        className="flex cursor-pointer flex-col items-center justify-center border border-gray-300 rounded-lg px-6 py-3 bg-white text-gray-600 hover:bg-gray-50 transition w-full"
        onClick={() => inputRef.current?.click()}
      >
        <ArrowUpTrayIcon className="w-8 h-8 mb-1 text-gray-400" />
        <span className="text-gray-500">
          {value ? value.name : "Imagen"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}