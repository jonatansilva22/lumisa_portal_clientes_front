import {
  ClipboardDocumentListIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  TagIcon,
  UserCircleIcon,
  UserPlusIcon,
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

function StatusIcon({ statusId }: { statusId: number }) {
  if (statusId === 1) return <ClockIcon className="w-7 h-7" />;
  if (statusId === 2) return <ArrowPathIcon className="w-7 h-7" />;
  if (statusId === 3) return <CheckCircleIcon className="w-7 h-7" />;
  return <TagIcon className="w-7 h-7" />;
}

export function OrdersSummary({ total, statusCards, assigned, unassigned }: OrdersSummaryProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 justify-center">
      <Card className="flex flex-col items-center min-w-40 p-4 border border-gray-200 shadow-sm">
        <span className="text-blue-600 mb-1">
          <ClipboardDocumentListIcon className="w-7 h-7" />
        </span>
        <span className="text-2xl font-bold text-gray-800">{total}</span>
        <span className="text-gray-600 text-sm mt-1">Total pedidos</span>
      </Card>

      {typeof assigned === "number" ? (
        <Card className="flex flex-col items-center min-w-40 p-4 border border-gray-200 shadow-sm">
          <span className="text-green-600 mb-1">
            <UserCircleIcon className="w-7 h-7" />
          </span>
          <span className="text-2xl font-bold text-gray-800">{assigned}</span>
          <span className="text-green-700 text-sm mt-1">Asignados</span>
        </Card>
      ) : null}

      {typeof unassigned === "number" ? (
        <Card className="flex flex-col items-center min-w-40 p-4 border border-gray-200 shadow-sm">
          <span className="text-gray-500 mb-1">
            <UserPlusIcon className="w-7 h-7" />
          </span>
          <span className="text-2xl font-bold text-gray-800">{unassigned}</span>
          <span className="text-gray-500 text-sm mt-1">Sin asesor</span>
        </Card>
      ) : null}

      {statusCards.map((statusCard) => (
        <Card
          key={statusCard.id}
          className="flex flex-col items-center min-w-40 p-4 border border-gray-200 shadow-sm"
        >
          <span className={`${getStatusAccent(statusCard.id)} mb-1`}>
            <StatusIcon statusId={statusCard.id} />
          </span>
          <span className="text-2xl font-bold text-gray-800">{statusCard.count}</span>
          <span className={`${getStatusText(statusCard.id)} text-sm mt-1`}>{statusCard.name}</span>
        </Card>
      ))}
    </div>
  );
}
