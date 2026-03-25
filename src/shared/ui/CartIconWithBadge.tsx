import { ShoppingCartIcon } from "@heroicons/react/24/outline";

type CartIconWithBadgeProps = {
  count: number;
  className?: string;
};

export function CartIconWithBadge({ count, className = "" }: CartIconWithBadgeProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <ShoppingCartIcon className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
      <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] sm:text-xs rounded-full px-1 font-bold min-w-[16px] text-center">
        {count}
      </span>
    </div>
  );
}