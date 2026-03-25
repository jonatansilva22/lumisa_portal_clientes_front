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
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg w-full text-left hover:bg-neutral-700 transition
        ${active ? "bg-neutral-700 font-bold" : ""}
      `}
      onClick={onClick}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}