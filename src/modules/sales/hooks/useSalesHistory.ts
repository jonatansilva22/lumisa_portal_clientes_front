import { useState, useCallback, useEffect } from 'react';
import type { SalesHistoryResponse, SalesHistoryPeriod } from '../types/salesHistory';
import { getSalesHistory } from '../services/salesHistory';

export function useSalesHistory() {
  const [customActive, setCustomActive] = useState(false);
  const [sales, setSales] = useState<SalesHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<SalesHistoryPeriod>('');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSalesHistory({ period, start_date: startDate, end_date: endDate });
      setSales(res);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar historial');
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    if (!customActive) {
      fetchSales();
    }
  }, [fetchSales, customActive]);

  return {
    sales,
    loading,
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch: fetchSales,
    customActive,
    setCustomActive,
  };
}
