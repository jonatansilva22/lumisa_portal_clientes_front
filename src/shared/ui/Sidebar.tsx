import { type ReactNode } from "react";

type SidebarProps = {
  children: ReactNode;
  className?: string;
};

export function Sidebar({ children, className = "" }: SidebarProps) {
  return (
    <aside className={`flex flex-col ${className}`}>
      {children}
    </aside>
  );
}