import { UserCircleIcon } from "@heroicons/react/24/outline";

type UserAvatarProps = {
  className?: string;
};

export function UserAvatar({ className = "" }: UserAvatarProps) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300 w-10 h-10 sm:w-12 sm:h-12 ${className}`}>
      <UserCircleIcon className="w-9 h-9 text-purple-500 cursor-pointer" />
    </span>
  );
}