import {
  ClipboardDocumentListIcon,
  ClockIcon,
  ArrowPathIcon,
  TagIcon,
  UserCircleIcon,
  UserPlusIcon,
  BanknotesIcon,
  XCircleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../../../shared/ui/Card";

export interface OrdersSummaryStatusCard {
  id: number;
  name: string;
  count: number;
}

interface OrdersSummaryProps {
  total: number;
  statusCards: OrdersSummaryStatusCard[];
  assigned?: number;
  unassigned?: number;
}

function getStatusAccent(statusId: number): string {
  if (statusId === 1) return "text-amber-600";
  if (statusId === 2) return "text-blue-600";
  if (statusId === 3) return "text-green-600";
  if (statusId === 99) return "text-gray-500";
  return "text-indigo-600";
}

function getStatusText(statusId: number): string {
  if (statusId === 1) return "text-amber-700";
  if (statusId === 2) return "text-blue-700";
  if (statusId === 3) return "text-green-700";
  if (statusId === 99) return "text-gray-600";
  return "text-indigo-700";
}

// 1: Pendiente, 2: En revisión, 3: Pagado, 4: Cancelado, 5: Rechazado, 99: Otro
// Icono según nombre de estado
function StatusIcon({ statusName }: { statusName: string }) {
  const name = statusName.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  if (name.includes("pendiente")) return <ClockIcon className="w-7 h-7" />;
  if (name.includes("revis")) return <ArrowPathIcon className="w-7 h-7" />;
  if (name.includes("pagad")) return <BanknotesIcon className="w-7 h-7" />;
  if (name.includes("cancel")) return <XCircleIcon className="w-7 h-7" />;
  if (name.includes("rechaz")) return <NoSymbolIcon className="w-7 h-7" />;
  return <TagIcon className="w-7 h-7" />;
}

export function OrdersSummary({ total, statusCards, assigned, unassigned }: OrdersSummaryProps) {
  // Construir los bloques del sumario
  const blocks = [
    {
      key: 'total',
      icon: <ClipboardDocumentListIcon className="w-7 h-7" />, 
      iconClass: "text-blue-600",
      value: total,
      valueClass: "text-base font-extrabold text-gray-800 tracking-tight",
      label: "Pedidos",
      labelClass: "uppercase text-xs tracking-widest text-indigo-500 font-semibold mt-0.5"
    },
  ];
  if (typeof assigned === "number") {
    blocks.push({
      key: 'assigned',
      icon: <UserCircleIcon className="w-7 h-7" />, 
      iconClass: "text-green-600",
      value: assigned,
      valueClass: "text-base font-extrabold text-green-600 tracking-tight",
      label: "Asignados",
      labelClass: "uppercase text-xs tracking-widest text-green-600 font-semibold mt-0.5"
    });
  }
  if (typeof unassigned === "number") {
    blocks.push({
      key: 'unassigned',
      icon: <UserPlusIcon className="w-7 h-7" />, 
      iconClass: "text-gray-500",
      value: unassigned,
      valueClass: "text-base font-extrabold text-gray-400 tracking-tight",
      label: "Sin asesor",
      labelClass: "uppercase text-xs tracking-widest text-gray-400 font-semibold mt-0.5"
    });
  }
  statusCards.forEach((statusCard) => {
    blocks.push({
      key: `status-${statusCard.id}`,
      icon: <StatusIcon statusName={statusCard.name} />, 
      iconClass: `${getStatusAccent(statusCard.id)}`,
      value: statusCard.count,
      valueClass: "text-base font-extrabold text-gray-800 tracking-tight",
      label: statusCard.name,
      labelClass: `${getStatusText(statusCard.id)} uppercase text-xs tracking-widest font-semibold mt-0.5`
    });
  });

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
