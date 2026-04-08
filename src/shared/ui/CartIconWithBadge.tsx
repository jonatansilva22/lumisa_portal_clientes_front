import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

type CartIconWithBadgeProps = {
  count: number;
  className?: string;
};

export function CartIconWithBadge({ count, className = "" }: CartIconWithBadgeProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`relative flex items-center hover:bg-orange-100 ${className}`}
      onClick={() => navigate('/cart')}
      role="button"
      tabIndex={0}
      style={{ outline: 'none' }}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/cart'); }}
    >
      <ShoppingCartIcon className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
      <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] sm:text-xs rounded-full px-1 font-bold min-w-[16px] text-center">
        {count}
      </span>
    </div>
  );
}