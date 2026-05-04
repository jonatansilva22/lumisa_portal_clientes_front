import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Header, SidebarAdmin, SidebarAdviser } from "../../../shared/components/Index";
import { BackButton } from "../../../shared/ui/BackButton";
import { LoadingSpinner } from "../../../shared/ui/LoadingSpinner";
import { useAuthStore } from "../../auth/store/auth";
import { OrderDetailHeaderCard } from "../components/OrderDetailHeaderCard";
import { OrderGeneralInfoCard } from "../components/OrderGeneralInfoCard";
import { OrderProductsTableCard } from "../components/OrderProductsTableCard";
import { OrderStatusEditCard } from "../components/OrderStatusEditCard";
import { OrderAdvisorCard } from "../components/OrderAdvisorCard";
import { useManagedOrderDetail } from "../hooks/useManagedOrderDetail";
import { fetchProducts } from "../../products/services/products";
import { usePaymentsByOrder, useUpdatePaymentStatus } from "../../payments/hooks/usePayments";
import { usePaymentStatuses } from "../../payments/hooks/usePaymentStatuses";
import { ManualPaymentStatusCard } from "../../payments/components/ManualPaymentStatusCard";

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
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function ManagedOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role_id === 1;

  const { order, statuses, loading, saving, error, fetchOrder, fetchStatuses, changeStatus, autoAssignAdvisor, changeAdvisor } = useManagedOrderDetail();
  const [productNames, setProductNames] = useState<Record<number, string>>({});

  const orderId = Number(id);
  const hasValidId = Number.isFinite(orderId) && orderId > 0;

  useEffect(() => {
    if (!hasValidId) return;
    fetchOrder(orderId);
    fetchStatuses();
  }, [orderId, hasValidId, fetchOrder, fetchStatuses]);

  // Si no tiene asesor asignado, el usuario actual (admin o asesor) se asigna automáticamente
  useEffect(() => {
    if (!order || !user) return;
    if ((order.advisor?.id ?? order.advisor_id) != null) return;
    autoAssignAdvisor(order.id, user.id);
  }, [order?.id, order?.advisor?.id, order?.advisor_id, user, autoAssignAdvisor]);

  useEffect(() => {
    if (!order) return;
    fetchProducts()
      .then((products) => {
        const nameById = products.reduce<Record<number, string>>((acc, p) => {
          acc[p.id] = p.name;
          return acc;
        }, {});
        setProductNames(nameById);
      })
      .catch(() => setProductNames({}));
  }, [order]);

  const statusName = useMemo(() => {
    if (!order) return "-";
    return statuses.find((s) => s.id === order.status_id)?.name ?? `Estado ${order.status_id}`;
  }, [order, statuses]);

  const clientName = useMemo(() => {
    if (!order) return "-";
    if (order.client) return `${order.client.name} ${order.client.last_name ?? ""}`.trim();
    return (order as any).client_name || (order as any)?.client?.name || "Cliente sin nombre";
  }, [order]);

  const companyName = useMemo(() => {
    if (!order) return "-";
    return order.company?.name || (order as any).company_name || (order as any)?.company?.name || "Empresa sin nombre";
  }, [order]);

  const advisorName = useMemo(() => {
    if (!order) return "-";
    if (order.advisor) return `${order.advisor.name} ${order.advisor.last_name ?? ""}`.trim();
    if (!order.advisor_id) return "Sin asignar";
    return (order as any).advisor_name || "Asesor sin nombre";
  }, [order]);

  const handleSaveStatus = async (statusId: number) => {
    if (!order) return;
    try {
      await changeStatus(order.id, statusId);
      toast.success("Estado actualizado correctamente");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Error al actualizar el estado");
    }
  };

  const handleAssignAdvisor = async (advisorId: number) => {
    if (!order) return;
    try {
      await changeAdvisor(order.id, advisorId);
      toast.success("Asesor asignado correctamente");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Error al asignar el asesor");
    }
  };


  // --- PAGOS MANUALES: integración para admin/asesor ---
  const { payments: rawPayments, fetchPayments } = usePaymentsByOrder(orderId);
  const payments = (rawPayments ?? []);
  const { statuses: paymentStatuses } = usePaymentStatuses();
  const { updateStatus, loading: updatingPayment } = useUpdatePaymentStatus();
  // Solo mostrar para pagos manuales pendientes
  const manualPayments = payments.filter(
    (p) => (p.method_id === 2 || p.method_id === 3) && p.status_id === 1
  );

  const sidebar = isAdmin ? <SidebarAdmin /> : <SidebarAdviser />;

  if (!hasValidId) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 min-h-0">
          {sidebar}
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
        {sidebar}
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
          ) : !isAdmin && (order.advisor?.id ?? order.advisor_id) != null && (order.advisor?.id ?? order.advisor_id) !== user?.id ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <p className="text-lg font-semibold text-gray-700">Pedido no disponible</p>
              <p className="text-gray-400 text-sm">Este pedido ya fue tomado por otro asesor.</p>
              <BackButton onClick={() => navigate(-1)} />
            </div>
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
                companyName={companyName}
                advisorName={advisorName}
                formatDate={formatDate}
              />

              <OrderStatusEditCard
                currentStatusId={order.status_id}
                statuses={statuses}
                saving={saving}
                onSave={handleSaveStatus}
              />

              {isAdmin && (
                <OrderAdvisorCard
                  currentAdvisorId={order.advisor?.id ?? order.advisor_id}
                  orderId={order.id}
                  saving={saving}
                  onAssign={handleAssignAdvisor}
                />
              )}

              <OrderProductsTableCard order={order} productNames={productNames} />

              {/* Validación de pagos manuales para admin/asesor */}
              {manualPayments.length > 0 && paymentStatuses.length > 0 && manualPayments.map(payment => (
                <ManualPaymentStatusCard
                  key={payment.id}
                  currentStatusId={payment.status_id}
                  statuses={paymentStatuses}
                  saving={updatingPayment}
                  onSave={async (newStatusId) => {
                    try {
                      await updateStatus(payment.id, newStatusId);
                      toast.success('Estado de pago actualizado');
                      fetchPayments();
                    } catch (err) {
                      toast.error('Error al actualizar el estado del pago');
                    }
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
