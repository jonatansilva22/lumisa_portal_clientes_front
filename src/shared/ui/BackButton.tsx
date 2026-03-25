import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type BackButtonProps = {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export function BackButton({ onClick, className = "", ariaLabel = "Volver" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded hover:bg-gray-100 transition cursor-pointer ${className}`}
    >
      <ArrowLeftIcon className="w-7 h-7 text-gray-800" />
    </button>
  );
}