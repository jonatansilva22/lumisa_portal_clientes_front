import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, SidebarClient } from "../../../shared/components/Index";
import { BackButton } from "../../../shared/ui/BackButton";
import { LoadingSpinner } from "../../../shared/ui/LoadingSpinner";
import { useOrders } from "../hooks/useOrders";
import { OrderCard } from "../components/OrderCard";
import { OrdersFiltersBar } from "../components/OrdersFiltersBar";
import { OrdersSummary } from "../components/OrdersSummary";

function orderYear(createdAt?: string): number | null {
  if (!createdAt) return null;
  const normalized = createdAt.includes(" ") && !createdAt.includes("T")
    ? createdAt.replace(" ", "T")
    : createdAt;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date.getFullYear();
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const { orders, statuses, loading, error, fetchOrders, fetchStatuses } = useOrders();

  const availableYears = useMemo(() => {
    const years = orders
      .map((order) => orderYear(order.created_at))
      .filter((year): year is number => year !== null);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [orders]);

  const summary = useMemo(() => {
    const countsByStatusId = orders.reduce<Record<number, number>>((acc, order) => {
      acc[order.status_id] = (acc[order.status_id] ?? 0) + 1;
      return acc;
    }, {});

    const dynamicStatusCards = Object.entries(countsByStatusId)
      .map(([statusId, count]) => {
        const numericStatusId = Number(statusId);
        const statusName = statuses.find((status) => status.id === numericStatusId)?.name ?? `Estado ${numericStatusId}`;

        return {
          id: numericStatusId,
          name: statusName,
          count,
        };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => a.id - b.id);

    return {
      total: orders.length,
      statusCards: dynamicStatusCards,
    };
  }, [orders, statuses]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || String(order.status_id) === statusFilter;
      const year = orderYear(order.created_at);
      const matchesYear = yearFilter === "all" || String(year) === yearFilter;
      return matchesStatus && matchesYear;
    });
  }, [orders, statusFilter, yearFilter]);

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarClient />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold text-gray-800">Mis Pedidos</h1>
          </div>

          <OrdersSummary
            total={summary.total}
            statusCards={summary.statusCards}
          />

          <OrdersFiltersBar
            statusFilter={statusFilter}
            onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
            yearFilter={yearFilter}
            onYearFilterChange={(e) => setYearFilter(e.target.value)}
            years={availableYears}
            statuses={statuses}
          />

          {loading ? (
            <LoadingSpinner className="my-12" />
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-gray-500 text-center py-12">No tienes pedidos aún.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOrders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  orderNumber={index + 1}
                  statuses={statuses}
                  onDetails={(id) => navigate(`/orders/${id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
