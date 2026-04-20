import {
  TagIcon,
  BuildingOfficeIcon,
  UserIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import type { Order, OrderStatus } from "../types/order";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";

interface OrderCardProps {
  order: Order;
  orderNumber: number;
  statuses: OrderStatus[];
  onDetails: (id: number) => void;
}

function statusColor(statusName: string): string {
  const n = statusName.toLowerCase();
  if (n.includes("pend")) return "#f59e0b";    // Pendiente  - ámbar
  if (n.includes("revis")) return "#3b82f6";   // Revisado   - azul
  if (n.includes("autoriz")) return "#7c3aed"; // Autorizado - morado
  if (n.includes("pagad")) return "#10b981";   // Pagado     - verde
  if (n.includes("cancel")) return "#9ca3af";  // Cancelado  - gris
  if (n.includes("rechaz")) return "#ef4444";  // Rechazado  - rojo
  return "#d1d5db";
}

function statusPillClasses(statusName: string): string {
  const n = statusName.toLowerCase();
  if (n.includes("pend")) return "bg-amber-100 text-amber-700";
  if (n.includes("revis")) return "bg-blue-100 text-blue-700";
  if (n.includes("autoriz")) return "bg-violet-100 text-violet-700";
  if (n.includes("pagad")) return "bg-emerald-100 text-emerald-700";
  if (n.includes("cancel")) return "bg-gray-100 text-gray-600";
  if (n.includes("rechaz")) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const normalized = value.includes(" ") && !value.includes("T")
    ? value.replace(" ", "T")
    : value;

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function resolveCompanyName(order: Order): string {
  return order.company?.name || (order as any).company_name || (order as any)?.company?.name || "Empresa sin nombre";
}

function resolveAdvisorName(order: Order): string {
  const advisor = order.advisor || (order as any)?.advisor;
  if (advisor) return `${advisor.name} ${advisor.last_name ?? ""}`.trim();
  if (!order.advisor_id) return "Sin asignar";
  return (order as any).advisor_name || "Asesor sin nombre";
}

export function OrderCard({ order, orderNumber, statuses, onDetails }: OrderCardProps) {
  const statusName = statuses.find(s => s.id === order.status_id)?.name ?? String(order.status_id);
  const createdAt = order.created_at ?? (order as any).createdAt;
  const updatedAt = order.updated_at ?? (order as any).updatedAt;
  const itemCount = order.order_details?.length ?? 0;
  const companyName = resolveCompanyName(order);
  const advisorName = resolveAdvisorName(order);

  return (
    <Card className="flex flex-col min-w-0 px-0! py-0! overflow-hidden shadow-lg! transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl!">
      {/* Barra de color por estado */}
      <div
        className="h-1.5 w-full shrink-0"
        style={{ backgroundColor: statusColor(statusName) }}
      />

      <div className="flex flex-col gap-4 p-5">
        {/* Encabezado: nombre/folio + pill de estado */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-gray-800 leading-snug line-clamp-2">
            Pedido #{orderNumber}
          </h3>
          <span className={`shrink-0 text-sm font-semibold px-2.5 py-1 rounded-full ${statusPillClasses(statusName)}`}>
            {statusName}
          </span>
        </div>

        {/* Campos */}
        <div className="flex flex-col gap-2 text-base text-gray-800">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <span><span className="font-medium text-gray-700">Folio:</span> {order.folio}</span>
          </div>
          <div className="flex items-center gap-2">
            <BuildingOfficeIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <span><span className="font-medium text-gray-700">Empresa:</span> {companyName}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <span><span className="font-medium text-gray-700">Asesor:</span> {advisorName}</span>
          </div>
        </div>

        {/* Resumen: productos + total */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <div className="flex items-center gap-1.5 text-base text-gray-700">
            <ShoppingBagIcon className="w-4 h-4" />
            <span>{itemCount} producto{itemCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="text-lg font-bold text-gray-800">
            ${Number(order.total_payment).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Fechas */}
        <div className="flex flex-col gap-1 text-sm text-gray-700">
          <div className="flex items-center gap-1.5">
            <CalendarDaysIcon className="w-3.5 h-3.5 shrink-0" />
            <span><span className="text-gray-700 font-medium">Creado:</span> {formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDaysIcon className="w-3.5 h-3.5 shrink-0" />
            <span><span className="text-gray-700 font-medium">Actualizado:</span> {formatDate(updatedAt)}</span>
          </div>
        </div>

        {/* Botón */}
        <Button
          onClick={() => onDetails(order.id)}
          className="mt-0! w-full! border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-base py-2 shadow-none!"
        >
          Ver detalles
        </Button>
      </div>
    </Card>
  );
}
