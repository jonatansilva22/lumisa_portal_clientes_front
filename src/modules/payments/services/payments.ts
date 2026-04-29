import { api } from '../../../shared/services/axios';
import type { Payment, PaymentCreate, PaymentMethod } from '../types/payment';

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

function authHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Crear un pago
export async function createPayment(payment: PaymentCreate) {
  const { data } = await api.post('/payments/', payment, { headers: authHeader() });
  // El backend retorna todos los campos juntos, incluyendo mp_init_point
  return data;
}

// Obtener métodos de pago activos
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await api.get('/payments/methods', { headers: authHeader() });
  return data;
}

// Obtener pagos de un pedido
export async function getPaymentsByOrder(orderId: number): Promise<Payment[]> {
  const { data } = await api.get(`/payments/order/${orderId}`, { headers: authHeader() });
  return data;
}

// Obtener estados de pago
export async function getPaymentStatuses() {
  const { data } = await api.get('/payments/statuses', { headers: authHeader() });
  return data;
}

// Actualizar estado de un pago manual
export async function updatePaymentStatus(paymentId: number, newStatusId: number) {
  const { data } = await api.patch(`/payments/${paymentId}/update-status`, null, {
    params: { new_status_id: newStatusId },
    headers: authHeader(),
  });
  return data;
}
