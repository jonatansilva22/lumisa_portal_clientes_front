import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Header, SidebarClient } from "../../../shared/components/Index";
import { BackButton } from "../../../shared/ui/BackButton";
import { LoadingSpinner } from "../../../shared/ui/LoadingSpinner";
import { useAuth } from "../../../shared/hooks/useAuth";
import { OrderActionsCard } from "../components/OrderActionsCard";
import { OrderDetailHeaderCard } from "../components/OrderDetailHeaderCard";
import { OrderGeneralInfoCard } from "../components/OrderGeneralInfoCard";
import { OrderProductsTableCard } from "../components/OrderProductsTableCard";
import { fetchProducts } from "../../products/services/products";
import { useOrders } from "../hooks/useOrders";
import type { Order } from "../types/order";

function statusStyles(statusName: string): string {
  const normalized = statusName.toLowerCase();
  if (normalized.includes("pend")) return "bg-amber-100 text-amber-800 border-amber-200";
  if (normalized.includes("revis")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (normalized.includes("autoriz")) return "bg-violet-100 text-violet-800 border-violet-200";
  if (normalized.includes("pagad")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (normalized.includes("cancel")) return "bg-gray-100 text-gray-700 border-gray-200";
  if (normalized.includes("rechaz")) return "bg-red-100 text-red-800 border-red-200";
  return "bg-indigo-100 text-indigo-800 border-indigo-200";
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const normalized = value.includes(" ") && !value.includes("T") ? value.replace(" ", "T") : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrderById, cancelOrder, statuses, fetchStatuses, loading, error } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [productNames, setProductNames] = useState<Record<number, string>>({});

  const orderId = Number(id);
  const hasValidId = Number.isFinite(orderId) && orderId > 0;

  useEffect(() => {
    if (!hasValidId) return;

    const load = async () => {
      const data = await getOrderById(orderId);
      if (data) {
        setOrder(data);
      }
    };

    fetchStatuses();
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, hasValidId]);

  useEffect(() => {
    if (!order) return;

    const loadRelatedNames = async () => {
      const companyNameFromOrder =
        order.company?.name ||
        (order as any)?.company?.name ||
        (order as any)?.company_name ||
        (order as any)?.companyName;

      if (companyNameFromOrder) {
        setCompanyName(companyNameFromOrder);
      }

      try {
        const products = await fetchProducts();
        const nameById = (products as Array<{ id: number; name: string }>).reduce<Record<number, string>>((acc, product) => {
          acc[product.id] = product.name;
          return acc;
        }, {});
        setProductNames(nameById);
      } catch {
        setProductNames({});
      }
    };

    loadRelatedNames();
  }, [order]);

  const statusName = useMemo(() => {
    if (!order) return "-";
    return statuses.find((status) => status.id === order.status_id)?.name ?? `Estado ${order.status_id}`;
  }, [order, statuses]);

  const canceledStatusId = useMemo(() => {
    return statuses.find((status) => status.name.toLowerCase().includes("cancel"))?.id;
  }, [statuses]);

  const canProceedToPay = useMemo(() => {
    return statusName.toLowerCase().includes("autorizado");
  }, [statusName]);


  const isCanceled = useMemo(() => {
    return statusName.toLowerCase().includes("cancelado") || order?.status_id === 99;
  }, [order?.status_id, statusName]);

  // Solo puede cancelar si el estado es pendiente, autorizado o rechazado
  const canCancelOrder = useMemo(() => {
    const name = statusName.toLowerCase();
    return (
      name.includes("pend") ||
      name.includes("autoriz") ||
      name.includes("rechaz")
    );
  }, [statusName]);

  const clientName = useMemo(() => {
    if (!order) return "-";

    if (order.client) {
      return `${order.client.name} ${order.client.last_name ?? ""}`.trim();
    }

    const clientNameFromOrder = (order as any).client_name || (order as any)?.client?.name;
    if (clientNameFromOrder) return clientNameFromOrder;

    if (user && user.id === (order.client_id ?? (order.client && typeof order.client === 'object' && 'id' in order.client ? (order.client as { id: number }).id : undefined))) {
      const fullName = `${user.name} ${user.last_name ?? ""}`.trim();
      return fullName || "Cliente sin nombre";
    }

    return "Cliente sin nombre";
  }, [order, user]);

  const displayCompanyName = useMemo(() => {
    if (!order) return "-";
    return companyName || "Empresa sin nombre";
  }, [companyName, order]);

  const advisorName = useMemo(() => {
    if (!order) return "-";
    if (order.advisor) return `${order.advisor.name} ${order.advisor.last_name ?? ""}`.trim();
    if (!order.advisor_id) return "Sin asignar";
    return (order as any).advisor_name || "Asesor sin nombre";
  }, [order]);

  const handleCancelOrder = async () => {
    if (!order || isCanceled) return;

    setActionLoading(true);
    try {
      const updated = await cancelOrder(order.id);
      if (!updated) {
        toast.error("No se pudo cancelar el pedido");
        return;
      }

      if (typeof canceledStatusId === "number") {
        setOrder({ ...updated, status_id: canceledStatusId });
      } else {
        setOrder(updated);
      }
      toast.success("Pedido cancelado correctamente");
    } finally {
      setActionLoading(false);
    }
  };

  const handleProceedToPay = () => {
    if (!order) return;
    if (!canProceedToPay) {
      toast.error("Este pedido solo puede pagarse cuando este autorizado");
      return;
    }
    navigate(`/pay/${order!.id}`);
  };

  if (!hasValidId) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 min-h-0">
          <SidebarClient />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <BackButton onClick={() => navigate(-1)} />
              <h1 className="text-2xl font-bold text-gray-800">Detalle del pedido</h1>
            </div>
            <div className="text-red-500">El identificador del pedido no es valido.</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarClient />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold text-gray-800">Detalle del pedido</h1>
          </div>

          {loading && !order ? (
            <LoadingSpinner className="my-12" />
          ) : error && !order ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : !order ? (
            <div className="text-gray-500 text-center py-12">No se encontro el pedido.</div>
          ) : (
            <div className="space-y-5">
              <OrderDetailHeaderCard
                order={order}
                statusName={statusName}
                statusClassName={statusStyles(statusName)}
              />

              <OrderGeneralInfoCard
                order={order}
                clientName={clientName}
                companyName={displayCompanyName}
                advisorName={advisorName}
                formatDate={formatDate}
              />

              <OrderProductsTableCard order={order} productNames={productNames} />

              <OrderActionsCard
                isCanceled={isCanceled}
                actionLoading={actionLoading}
                canProceedToPay={canProceedToPay}
                canCancelOrder={canCancelOrder}
                onCancelOrder={handleCancelOrder}
                onProceedToPay={handleProceedToPay}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
