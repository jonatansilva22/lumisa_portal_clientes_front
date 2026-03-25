type StatusBadgeProps = {
  color: string; // Puede ser un color de Tailwind o un hex
  className?: string;
};

export function StatusBadge({ color, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block w-4 h-4 rounded-full border border-gray-300 ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}