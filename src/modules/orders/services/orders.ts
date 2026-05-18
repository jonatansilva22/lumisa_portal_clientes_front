// Actualizar el precio de envío (solo staff)
export async function updateShippingPrice(orderId: number, shippingPrice: number): Promise<Order> {
  const { data } = await api.put<Order>(
    `/orders/${orderId}/shipping-price`,
    null,
    { headers: authHeader(), params: { shipping_price: shippingPrice } }
  );
  return data;
}
import { api } from '../../../shared/services/axios';
import type { Order, OrderStatus } from '../types/order';

// Helper para obtener el token de auth
function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

function authHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Crear pedido desde el carrito
export async function createOrderFromCart(): Promise<Order> {
  const { data } = await api.post<Order>(
    '/orders/from-cart',
    {},
    { headers: authHeader() }
  );
  return data;
}

// Obtener los pedidos del usuario actual
export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/me', {
    headers: authHeader(),
  });
  return data;
}

// Obtener todos los pedidos para admin/asesor
export async function getAllOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders', {
    headers: authHeader(),
  });
  return data;
}

// Obtener detalle de un pedido propio
export async function getMyOrderById(orderId: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/me/${orderId}`, {
    headers: authHeader(),
  });
  return data;
}

// Cancelar un pedido propio
export async function cancelMyOrder(orderId: number): Promise<Order> {
  const { data } = await api.post<Order>(`/orders/me/${orderId}/cancel`, {}, {
    headers: authHeader(),
  });
  return data;
}

// Obtener detalle de un pedido por ID (admin/asesor)
export async function getOrderById(orderId: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${orderId}`, {
    headers: authHeader(),
  });
  return data;
}

// Actualizar el estado de un pedido (admin/asesor)
export async function updateOrderStatus(orderId: number, statusId: number): Promise<Order> {
  const { data } = await api.put<Order>(
    `/orders/${orderId}/status`,
    null,
    { headers: authHeader(), params: { new_status_id: statusId } }
  );
  return data;
}

// Asignar asesor a un pedido (admin/asesor)
export async function assignAdvisor(orderId: number, advisorId: number): Promise<Order> {
  const { data } = await api.put<Order>(
    `/orders/${orderId}/assign-advisor`,
    null,
    { headers: authHeader(), params: { advisor_id: advisorId } }
  );
  return data;
}

// Obtener estatus de pedidos
export async function getOrderStatuses(): Promise<OrderStatus[]> {
  const { data } = await api.get<OrderStatus[]>('/orders/statuses', {
    headers: authHeader(),
  });
  return data;
}
