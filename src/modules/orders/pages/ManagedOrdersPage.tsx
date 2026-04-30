import { useEffect, useMemo, useState } from "react";
import { Header, SidebarAdmin, SidebarAdviser } from "../../../shared/components/Index";
import { useAuthStore } from "../../auth/store/auth";
import { BackButton } from "../../../shared/ui/BackButton";
import { LoadingSpinner } from "../../../shared/ui/LoadingSpinner";
import { OrdersFiltersBar } from "../components/OrdersFiltersBar";
import { OrdersSummary, type OrdersSummaryStatusCard } from "../components/OrdersSummary";
import { ManagedOrdersTable } from "../components/ManagedOrdersTable";
import { useManagedOrders } from "../hooks/useManagedOrders";
import type { Order } from "../types/order";
import { getUsers } from "../../users/services/users";

function orderYear(createdAt?: string): number | null {
  if (!createdAt) return null;
  const normalized = createdAt.includes(" ") && !createdAt.includes("T")
    ? createdAt.replace(" ", "T")
    : createdAt;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date.getFullYear();
}


function matchesSearch(order: Order, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;

  const clientName = (order as any).client_name || (order as any)?.client?.name || "";
  const companyName = (order as any).company_name || (order as any)?.company?.name || "";
  const adviserName = (order as any).advisor_name || (order as any)?.advisor?.name || "";

  return [
    order.folio,
    order.description,
    clientName,
    companyName,
    adviserName,
    String(order.id),
  ].some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
}

export default function ManagedOrdersPage() {
  const { user } = useAuthStore();
  const role = user?.role_id === 1 ? "admin" : "adviser";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [clientImageById, setClientImageById] = useState<Record<number, string>>({});
  const { orders, statuses, loading, error, fetchOrders, fetchStatuses } = useManagedOrders();

  const availableYears = useMemo(() => {
    const years = orders
      .map((order) => orderYear(order.created_at))
      .filter((year): year is number => year !== null);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [orders]);

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, [fetchOrders, fetchStatuses]);

  useEffect(() => {
    getUsers()
      .then((users) => {
        const imageMap = users.reduce<Record<number, string>>((acc, user) => {
          if (user.image_url) {
            acc[user.id] = user.image_url;
          }
          return acc;
        }, {});
        setClientImageById(imageMap);
      })
      .catch(() => setClientImageById({}));
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || String(order.status_id) === statusFilter;
      const year = orderYear(order.created_at);
      const matchesYear = yearFilter === "all" || String(year) === yearFilter;
      return matchesStatus && matchesYear && matchesSearch(order, search);
    });
  }, [orders, search, statusFilter, yearFilter]);

  const summary = useMemo(() => {
    const countsByStatusId = orders.reduce<Record<number, number>>((acc, order) => {
      acc[order.status_id] = (acc[order.status_id] ?? 0) + 1;
      return acc;
    }, {});

    const statusCards: OrdersSummaryStatusCard[] = Object.entries(countsByStatusId)
      .map(([statusId, count]) => {
        const numericStatusId = Number(statusId);
        return {
          id: numericStatusId,
          name: statuses.find((status) => status.id === numericStatusId)?.name ?? `Estado ${numericStatusId}`,
          count,
        };
      })
      .filter((statusCard) => statusCard.count > 0)
      .sort((a, b) => a.id - b.id);

    return {
      total: orders.length,
      assigned: orders.filter((order) => !!(order.advisor?.id ?? order.advisor_id)).length,
      unassigned: orders.filter((order) => !(order.advisor?.id ?? order.advisor_id)).length,
      statusCards,
    };
  }, [orders, statuses]);

  const isAdmin = role === "admin";
  const pageTitle = isAdmin ? "Gestion de pedidos" : "Pedidos del asesor";
  const detailPath = "/manage/orders";
  const emptyMessage = isAdmin
    ? "No hay pedidos disponibles."
    : "No hay pedidos disponibles para este asesor.";

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {isAdmin ? <SidebarAdmin /> : <SidebarAdviser />}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="w-full flex items-center max-w-6xl mx-auto mb-2">
              <BackButton onClick={() => window.history.back()} className="mr-2" />
              <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">{pageTitle}</h1>
            </div>
          </div>

          <OrdersSummary
            total={summary.total}
            assigned={summary.assigned}
            unassigned={summary.unassigned}
            statusCards={summary.statusCards}
          />

          <div className="flex flex-row items-center justify-between max-w-6xl mx-auto mb-2 w-full gap-4 flex-wrap">
            <div className="flex-1 min-w-75">
              <OrdersFiltersBar
                search={search}
                onSearchChange={(event) => setSearch(event.target.value)}
                statusFilter={statusFilter}
                onStatusFilterChange={(event) => setStatusFilter(event.target.value)}
                yearFilter={yearFilter}
                onYearFilterChange={(event) => setYearFilter(event.target.value)}
                years={availableYears}
                statuses={statuses}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="w-full max-w-7xl">
              {loading ? (
                <LoadingSpinner className="my-8" />
              ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-gray-500 text-center py-8">{emptyMessage}</div>
              ) : (
                <ManagedOrdersTable
                  orders={filteredOrders}
                  statuses={statuses}
                  detailPath={detailPath}
                  clientImageById={clientImageById}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}