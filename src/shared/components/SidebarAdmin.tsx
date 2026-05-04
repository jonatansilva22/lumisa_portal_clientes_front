import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { SidebarItem } from "../ui/SidebarItem";
import { LogoutModal } from "./LogoutModal";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../../modules/notifications/hooks/useNotifications";
import {
  HomeIcon,
  BuildingOffice2Icon,
  ShoppingBagIcon,
  UserIcon,
  CubeIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import LumisaLogo from "../../assets/lumisa-logo.png";

export function SidebarAdmin() {
  const [openModal, setOpenModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { unreadChatCount } = useNotifications();

  const handleLogout = () => {
    logout();
    setOpenModal(false);
    navigate("/");
  };

  return (
    <aside className="bg-neutral-800 text-white w-48 flex flex-col py-6 px-2 h-full">
      {/* Logo */}
      <div className="mb-8">
        <Logo src={LumisaLogo} className="h-20 w-30" />
      </div>
      {/* Menú */}
      <nav className="flex flex-col gap-2 w-full">
        <SidebarItem icon={<HomeIcon className="w-6 h-6" />} label="Inicio" />
        <SidebarItem icon={<BuildingOffice2Icon className="w-6 h-6" />} label="Empresas" onClick={() => navigate('/companies')} />
        <SidebarItem icon={<ShoppingBagIcon className="w-6 h-6" />} label="Pedidos" onClick={() => navigate('/manage/orders')} />
        <SidebarItem icon={<UserIcon className="w-6 h-6" />} label="Usuarios" onClick={() => navigate('/users')} />
        <SidebarItem icon={<CubeIcon className="w-6 h-6" />} label="Productos" onClick={() => navigate('/products')} />
        <SidebarItem
          icon={
            <div className="relative">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] rounded-full px-1 font-bold min-w-[16px] text-center">
                  {unreadChatCount}
                </span>
              )}
            </div>
          }
          label="Chat"
          onClick={() => navigate('/chat')}
        />
      </nav>
      <div className="flex-1" />
      <div className="w-full">
        <SidebarItem
          icon={<ArrowLeftOnRectangleIcon className="w-6 h-6" />}
          label="Salir"
          onClick={() => setOpenModal(true)}
        />
      </div>
      <LogoutModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleLogout}
      />
    </aside>
  );
}