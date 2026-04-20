import { useCallback, useState } from "react";
import { getOrderById, getOrderStatuses, updateOrderStatus, assignAdvisor } from "../services/orders";
import type { Order, OrderStatus } from "../types/order";

export function useManagedOrderDetail() {
  const [order, setOrder] = useState<Order | null>(null);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Error al cargar el pedido");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatuses = useCallback(async () => {
    try {
      const data = await getOrderStatuses();
      setStatuses(data);
    } catch {
      // silencioso — no crítico
    }
  }, []);

  const changeStatus = useCallback(async (orderId: number, statusId: number): Promise<void> => {
    setSaving(true);
    try {
      const updated = await updateOrderStatus(orderId, statusId);
      setOrder(updated);
    } finally {
      setSaving(false);
    }
  }, []);

  const autoAssignAdvisor = useCallback(async (orderId: number, advisorId: number): Promise<void> => {
    try {
      const updated = await assignAdvisor(orderId, advisorId);
      setOrder(updated);
    } catch {
      // silencioso — no crítico
    }
  }, []);

  const changeAdvisor = useCallback(async (orderId: number, advisorId: number): Promise<void> => {
    setSaving(true);
    try {
      const updated = await assignAdvisor(orderId, advisorId);
      setOrder(updated);
    } finally {
      setSaving(false);
    }
  }, []);

  return { order, statuses, loading, saving, error, fetchOrder, fetchStatuses, changeStatus, autoAssignAdvisor, changeAdvisor };
}
