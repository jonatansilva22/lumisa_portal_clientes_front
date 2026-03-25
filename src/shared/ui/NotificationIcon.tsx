import { BellIcon } from "@heroicons/react/24/outline";

type NotificationIconProps = {
  count?: number;
  className?: string;
};

export function NotificationIcon({ count = 0, className = "" }: NotificationIconProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <BellIcon className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
      {count > 0 && (
        <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] sm:text-xs rounded-full px-1 font-bold min-w-[16px] text-center">
          {count}
        </span>
      )}
    </div>
  );
}