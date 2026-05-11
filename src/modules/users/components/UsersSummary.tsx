import {
  UserGroupIcon,
  UserIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../../../shared/ui/Card";

interface UsersSummaryProps {
  total: number;
  clients: number;
  advisers: number;
  admins: number;
}

export function UsersSummary({ total, clients, advisers, admins }: UsersSummaryProps) {
  const blocks = [
    {
      key: 'total',
      icon: <UserGroupIcon className="w-7 h-7" />,
      iconClass: "text-blue-600",
      value: total,
      valueClass: "text-base font-extrabold text-gray-800 tracking-tight",
      label: "Total de Usuarios",
      labelClass: "uppercase text-xs tracking-widest text-blue-500 font-semibold mt-0.5"
    },
    {
      key: 'clients',
      icon: <UserIcon className="w-7 h-7" />,
      iconClass: "text-green-600",
      value: clients,
      valueClass: "text-base font-extrabold text-green-600 tracking-tight",
      label: "Clientes",
      labelClass: "uppercase text-xs tracking-widest text-green-600 font-semibold mt-0.5"
    },
    {
      key: 'advisers',
      icon: <BriefcaseIcon className="w-7 h-7" />,
      iconClass: "text-indigo-600",
      value: advisers,
      valueClass: "text-base font-extrabold text-indigo-600 tracking-tight",
      label: "Asesores",
      labelClass: "uppercase text-xs tracking-widest text-indigo-600 font-semibold mt-0.5"
    },
    {
      key: 'admins',
      icon: <Cog6ToothIcon className="w-7 h-7" />,
      iconClass: "text-purple-600",
      value: admins,
      valueClass: "text-base font-extrabold text-purple-600 tracking-tight",
      label: "Administradores",
      labelClass: "uppercase text-xs tracking-widest text-purple-600 font-semibold mt-0.5"
    },
  ];

  return (
    <div className="flex justify-center mb-4">
      <Card className="w-full max-w-4xl p-0 bg-linear-to-br from-gray-50 to-white border-0 shadow-md">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {blocks.map((block) => (
            <div key={block.key} className="flex flex-1 flex-col items-center py-2 px-0.5 md:px-2 min-w-[110px]">
              <span className={`mb-0.5 ${block.iconClass}`}>{block.icon}</span>
              <span className={block.valueClass}>{block.value}</span>
              <span className={block.labelClass}>{block.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}