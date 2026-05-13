import { api } from '../../../shared/services/axios';
import type { PurchaseHistoryResponse, PurchaseHistoryPeriod } from '../types/salesHistoryPurchases';

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

function authHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPurchaseHistory(params: {
  period?: PurchaseHistoryPeriod;
  start_date?: string;
  end_date?: string;
} = {}): Promise<PurchaseHistoryResponse> {
  const { data } = await api.get<PurchaseHistoryResponse>('/sales/history/purchases', {
    params,
    headers: authHeader(),
  });
  return data;
}
