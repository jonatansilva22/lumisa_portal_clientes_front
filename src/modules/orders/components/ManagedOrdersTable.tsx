import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/Button";
import { Table } from "../../../shared/ui/Table";
import type { Order, OrderStatus } from "../types/order";

type OrderRow = Order & {
  rowNumber: number;
  clientDisplay: string;
  companyDisplay: string;
  adviserDisplay: string;
  statusDisplay: string;
  clientImageUrl: string | null;
};

interface ManagedOrdersTableProps {
  orders: Order[];
  statuses: OrderStatus[];
  detailPath: string;
  clientImageById?: Record<number, string>;
  sortDesc?: boolean;
  onSortDescChange?: (desc: boolean) => void;
}

function resolveStatusName(order: Order, statuses: OrderStatus[]): string {
  return statuses.find((status) => status.id === order.status_id)?.name ?? `Estado ${order.status_id}`;
}

function statusBadgeClass(statusName: string): string {
  const normalized = statusName.toLowerCase();
  if (normalized.includes("pend")) return "bg-amber-100 text-amber-800 border-amber-200";
  if (normalized.includes("revis")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (normalized.includes("autoriz")) return "bg-violet-100 text-violet-800 border-violet-200";
  if (normalized.includes("pagad")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (normalized.includes("cancel")) return "bg-gray-100 text-gray-700 border-gray-200";
  if (normalized.includes("rechaz")) return "bg-red-100 text-red-800 border-red-200";
  return "bg-indigo-100 text-indigo-800 border-indigo-200";
}

function resolveClientName(order: Order): string {
  if (order.client) return `${order.client.name} ${order.client.last_name ?? ""}`.trim();
  return (order as any).client_name || (order as any)?.client?.name || "Cliente sin nombre";
}

function resolveClientImage(order: Order, clientImageById: Record<number, string>): string | null {
  const clientId = order.client?.id ?? order.client_id;
  if (clientId && clientImageById[clientId]) return clientImageById[clientId];
  return (order as any)?.client?.image_url || (order as any)?.client_image_url || null;
}

function initialsFromName(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "CL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function resolveCompanyName(order: Order): string {
  return order.company?.name || (order as any).company_name || (order as any)?.company?.name || "Empresa sin nombre";
}

function resolveAdviserName(order: Order): string {
  if (order.advisor) return `${order.advisor.name} ${order.advisor.last_name ?? ""}`.trim();
  if (!order.advisor_id) return "Sin asignar";
  return (order as any).advisor_name || "Asesor sin nombre";
}

function formatMoney(value: number | string): string {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "-";
  return `$${numericValue.toFixed(2)}`;
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const normalized = value.includes(" ") && !value.includes("T") ? value.replace(" ", "T") : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}


export function ManagedOrdersTable({ orders, statuses, detailPath, clientImageById = {} }: ManagedOrdersTableProps) {
  const navigate = useNavigate();

  const rows: OrderRow[] = orders.map((order: Order, index: number) => ({
    ...order,
    rowNumber: index + 1,
    clientDisplay: resolveClientName(order),
    companyDisplay: resolveCompanyName(order),
    adviserDisplay: resolveAdviserName(order),
    statusDisplay: resolveStatusName(order, statuses),
    clientImageUrl: resolveClientImage(order, clientImageById),
  }));

  return (
    <Table
      columns={[
        { header: "#", accessor: "rowNumber" },
        { header: "Folio", accessor: "folio" },
        { header: "Cliente", accessor: "clientDisplay" },
        { header: "Empresa", accessor: "companyDisplay" },
        { header: "Asesor", accessor: "adviserDisplay" },
        {
          header: "Estado",
          accessor: (row: OrderRow) => (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(row.statusDisplay)}`}>
              {row.statusDisplay}
            </span>
          ),
        },
        { header: "Total", accessor: (row: OrderRow) => formatMoney(row.total_payment) },
        { header: "Fecha de creación", accessor: (row: OrderRow) => formatDate(row.created_at) },
        {
          header: <span className="flex justify-center w-full">Acciones</span>,
          accessor: (row: OrderRow) => (
            <div className="flex justify-center w-full">
              <Button
                onClick={() => navigate(`${detailPath}/${row.id}`)}
                className="h-12 w-28 px-3 py-1 text-sm hover:bg-gray-200"
              >
                Ver detalles
              </Button>
            </div>
          ),
        },
      ]}
      data={rows}
    />
  );
}