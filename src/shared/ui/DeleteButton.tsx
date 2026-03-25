import { TrashIcon } from "@heroicons/react/24/solid";

type DeleteButtonProps = {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export function DeleteButton({ onClick, className = "", ariaLabel = "Eliminar" }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`border border-red-400 rounded-full px-6 py-2 flex items-center justify-center hover:bg-red-50 transition cursor-pointer ${className}`}
    >
      <TrashIcon className="w-4 h-4 text-red-500" />
    </button>
  );
}