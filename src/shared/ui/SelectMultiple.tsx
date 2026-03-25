import { ChevronDownIcon } from "@heroicons/react/24/outline";

type Option = { value: string; label: string };

type SelectMultipleProps = {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export function SelectMultiple({
  label,
  value,
  onChange,
  options,
  placeholder = "Seleccione una o varias opciones",
  className = "",
}: SelectMultipleProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <div className="relative">
        <select
          multiple
          value={value}
          onChange={e =>
            onChange(Array.from(e.target.selectedOptions, opt => opt.value))
          }
          className="w-full appearance-none border rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
        >
          {placeholder && value.length === 0 && (
            <option value="" disabled hidden>{placeholder}</option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map(val => {
            const label = options.find(o => o.value === val)?.label || val;
            return (
              <span key={val} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}