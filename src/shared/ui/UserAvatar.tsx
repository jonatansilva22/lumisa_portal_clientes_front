import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

type UserAvatarProps = {
  className?: string;
  src?: string | null;
};

export function UserAvatar({ className = "", src }: UserAvatarProps) {
  const navigate = useNavigate();

  return (
    <span
      onClick={() => navigate('/profile')}
      className={`inline-flex items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300 w-10 h-10 sm:w-12 sm:h-12 cursor-pointer ${className}`}>
      {src ? (
        <img src={src} className="w-full h-full rounded-full object-cover" />
      ) : (
        <UserCircleIcon className="w-9 h-9 text-purple-500" />
      )}
    </span>
  );
}