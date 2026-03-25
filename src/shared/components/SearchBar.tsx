import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type SearchBarProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({ value, onChange, placeholder = "Buscar producto", className = "" }: SearchBarProps) {
  return (
    <div className={`flex items-center border rounded px-3 py-1 bg-white ${className}`}>
      <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 mr-2" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="outline-none bg-transparent flex-1 text-sm"
      />
    </div>
  );
}