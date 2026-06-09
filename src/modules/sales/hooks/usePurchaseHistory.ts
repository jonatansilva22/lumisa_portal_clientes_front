import { useState, useCallback, useEffect } from 'react';
import { getPurchaseHistory } from '../services/salesHistoryPurchases';
import type { PurchaseHistory, PurchaseHistoryPeriod } from '../types/salesHistoryPurchases';

export function usePurchaseHistory() {
  const [customActive, setCustomActive] = useState(false); // Nuevo estado para saber si está activo el filtro personalizado
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
  const [summary, setSummary] = useState({ total_purchases: 0, total_spent: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PurchaseHistoryPeriod>('');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPurchaseHistory({ period, start_date: startDate, end_date: endDate });
      setPurchases(data.purchases);
      setSummary({ total_purchases: data.total_purchases, total_spent: data.total_spent });
    } catch (e: any) {
      setError(e?.message || 'Error al cargar historial de compras');
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  // Solo dispara fetch automáticamente si NO está activo el filtro personalizado
  useEffect(() => {
    if (!customActive) {
      fetch();
    }
  }, [fetch, customActive]);

  return {
    purchases,
    summary,
    loading,
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch: fetch,
    customActive,
    setCustomActive,
  };
}
