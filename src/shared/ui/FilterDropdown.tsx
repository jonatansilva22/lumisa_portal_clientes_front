type FilterDropdownProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function FilterDropdown({ options, value, onChange, className = "" }: FilterDropdownProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`border rounded px-4 py-1 bg-white text-sm cursor-pointer ${className}`}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}