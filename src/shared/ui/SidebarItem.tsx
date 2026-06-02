import { type ReactNode } from "react";

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg w-full text-left transition
        hover:bg-blue-300/60
        ${active ? "bg-blue-300/80 font-bold text-blue-900" : "text-blue-900"}
      `}
      onClick={onClick}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

}