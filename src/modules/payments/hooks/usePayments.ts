import { useCallback, useState, useEffect } from 'react';
import type { Payment, PaymentCreate, PaymentMethod } from '../types/payment';
import {
  createPayment,
  getPaymentMethods,
  getPaymentsByOrder,
  updatePaymentStatus,
} from '../services/payments';

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentMethods();
      setMethods(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener métodos de pago');
    } finally {
      setLoading(false);
    }
  }, []);

  return { methods, loading, error, fetchMethods };
}

export function usePaymentsByOrder(orderId: number) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentsByOrder(orderId);
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener pagos');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Ejecutar automáticamente al montar o cambiar orderId
  useEffect(() => {
    if (!orderId) return;
    fetchPayments();
  }, [orderId, fetchPayments]);

  return { payments, loading, error, fetchPayments };
}

export function useCreatePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mpInitPoint, setMpInitPoint] = useState<string | undefined>();

  const submitPayment = useCallback(async (payment: PaymentCreate) => {
    setLoading(true);
    setError(null);
    setMpInitPoint(undefined);
    try {
      const result = await createPayment(payment);
      setMpInitPoint(result.mp_init_point);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al crear pago');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitPayment, loading, error, mpInitPoint };
}

export function useUpdatePaymentStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (paymentId: number, newStatusId: number) => {
      setLoading(true);
      setError(null);
      try {
        await updatePaymentStatus(paymentId, newStatusId);
      } catch (err: any) {
        setError(err.message || 'Error al actualizar el estado del pago');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateStatus, loading, error };
}
