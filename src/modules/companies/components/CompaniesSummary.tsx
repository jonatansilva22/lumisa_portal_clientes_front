import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../../../shared/ui/Card";

interface CompaniesSummaryProps {
  total: number;
  active: number;
  inactive: number;
}

export function CompaniesSummary({ total, active, inactive }: CompaniesSummaryProps) {
  const blocks = [
    {
      key: 'total',
      icon: <BuildingOffice2Icon className="w-7 h-7" />,
      iconClass: "text-blue-600",
      value: total,
      valueClass: "text-base font-extrabold text-gray-800 tracking-tight",
      label: "Empresas",
      labelClass: "uppercase text-xs tracking-widest text-blue-500 font-semibold mt-0.5"
    },
    {
      key: 'active',
      icon: <CheckCircleIcon className="w-7 h-7" />,
      iconClass: "text-green-600",
      value: active,
      valueClass: "text-base font-extrabold text-green-600 tracking-tight",
      label: "Activas",
      labelClass: "uppercase text-xs tracking-widest text-green-600 font-semibold mt-0.5"
    },
    {
      key: 'inactive',
      icon: <ExclamationCircleIcon className="w-7 h-7" />,
      iconClass: "text-amber-600",
      value: inactive,
      valueClass: "text-base font-extrabold text-amber-600 tracking-tight",
      label: "Inactivas",
      labelClass: "uppercase text-xs tracking-widest text-amber-600 font-semibold mt-0.5"
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