import { useCallback, useState, useEffect } from "react";
import type { PaymentStatus } from "../types/payment";
import { getPaymentStatuses } from "../services/payments";

export function usePaymentStatuses() {
  const [statuses, setStatuses] = useState<PaymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentStatuses();
      setStatuses(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener estados de pago");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ejecutar automáticamente al montar
  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  return { statuses, loading, error, fetchStatuses };
}
