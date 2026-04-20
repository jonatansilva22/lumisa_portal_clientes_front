import { useCallback, useState } from 'react';
import * as orderService from '../services/orders';
import type { Order, OrderStatus } from '../types/order';

export function useManagedOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al obtener pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatuses = useCallback(async () => {
    try {
      const data = await orderService.getOrderStatuses();
      setStatuses(data);
    } catch {
      // No es critico para la gestion inicial.
    }
  }, []);

  return {
    orders,
    statuses,
    loading,
    error,
    fetchOrders,
    fetchStatuses,
    setOrders,
  };
}