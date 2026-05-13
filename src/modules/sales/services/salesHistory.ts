import { api } from '../../../shared/services/axios';
import type { SalesHistoryResponse, SalesHistoryPeriod } from '../types/salesHistory';

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

function authHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getSalesHistory(params: {
  period?: SalesHistoryPeriod;
  start_date?: string;
  end_date?: string;
} = {}): Promise<SalesHistoryResponse> {
  // Elimina start_date y end_date si son cadenas vacías
  const filteredParams: Record<string, any> = { ...params };
  if (filteredParams.start_date === '') delete filteredParams.start_date;
  if (filteredParams.end_date === '') delete filteredParams.end_date;
  const { data } = await api.get<SalesHistoryResponse>('/sales/history/', {
    params: filteredParams,
    headers: authHeader(),
  });
  return data;
}
