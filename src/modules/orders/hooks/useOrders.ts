import { useState, useCallback } from 'react';
import * as orderService from '../services/orders';
import type { Order, OrderStatus } from '../types/order';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los pedidos del usuario actual
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al obtener pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estatus de pedidos
  const fetchStatuses = useCallback(async () => {
    try {
      const data = await orderService.getOrderStatuses();
      setStatuses(data);
    } catch {
      // No es crítico
    }
  }, []);

  // Obtener detalle de un pedido propio
  const getOrderById = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      return await orderService.getMyOrderById(orderId);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al obtener el pedido');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancelar un pedido propio
  const cancelOrder = useCallback(async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await orderService.cancelMyOrder(orderId);
      setOrders((prev) => prev.map(o => o.id === updated.id ? updated : o));
      return updated;
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al cancelar el pedido');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    statuses,
    loading,
    error,
    fetchOrders,
    fetchStatuses,
    getOrderById,
    cancelOrder,
    setOrders, // por si se necesita manipular manualmente
  };
}
