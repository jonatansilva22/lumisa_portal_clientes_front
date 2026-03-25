import { Logo } from "../ui/Logo";
import { SidebarItem } from "../ui/SidebarItem";
import {
  HomeIcon,
  BuildingOffice2Icon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import LumisaLogo from "../../assets/lumisa-logo.png";

export function SidebarAdviser() {
  return (
    <aside className="bg-neutral-800 text-white w-48 flex flex-col py-6 px-2 h-full">
      {/* Logo */}
      <div className="mb-8">
        <Logo src={LumisaLogo} className="h-20 w-30" />
      </div>
      {/* Menú */}
      <nav className="flex flex-col gap-2 w-full">
        <SidebarItem icon={<HomeIcon className="w-6 h-6" />} label="Inicio" />
        <SidebarItem icon={<BuildingOffice2Icon className="w-6 h-6" />} label="Empresas" />
        <SidebarItem icon={<ShoppingBagIcon className="w-6 h-6" />} label="Pedidos" />
        <SidebarItem icon={<UserGroupIcon className="w-6 h-6" />} label="Clientes" />
        <SidebarItem icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Chat" />
        <SidebarItem icon={<CubeIcon className="w-6 h-6" />} label="Productos" />
      </nav>
      <div className="flex-1" />
      {/* Salir */}
      <div className="w-full">
        <SidebarItem icon={<ArrowLeftOnRectangleIcon className="w-6 h-6" />} label="Salir" />
      </div>
    </aside>
  );
}