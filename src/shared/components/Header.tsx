import { CartIconWithBadge } from "../ui/CartIconWithBadge";
import { NotificationIcon } from "../ui/NotificationIcon";
import { UserName } from "../ui/UserName";
import { UserAvatar } from "../ui/UserAvatar";


export function Header() {
  return (
    <header className="w-full flex items-center justify-between bg-gray-200 px-4 sm:px-12 py-0 shadow-sm h-18">
      {/* Logo alineado a la izquierda */}
      <div className="flex items-center h-full">
         <h1 className="text-2xl font-bold ">Lumisa</h1>
      </div>
      {/* Iconos alineados a la derecha */}
      <div className="flex items-center gap-6 h-full">
        <CartIconWithBadge count={1} className="scale-125" />
        <NotificationIcon count={2} className="scale-125" />
        <UserName name="USUARIO" className="text-xl" />
        <UserAvatar />
      </div>
    </header>
  );
}