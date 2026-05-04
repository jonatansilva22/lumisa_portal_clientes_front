import { api } from '../../../shared/services/axios';
import type { ClientDashboard, AdvisorDashboard, AdminDashboard } from '../types/dashboard';

function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

function authHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getClientDashboard(): Promise<ClientDashboard> {
  const { data } = await api.get<ClientDashboard>('/dashboard/client', {
    headers: authHeader(),
  });
  return data;
}

export async function getAdvisorDashboard(): Promise<AdvisorDashboard> {
  const { data } = await api.get<AdvisorDashboard>('/dashboard/advisor', {
    headers: authHeader(),
  });
  return data;
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const { data } = await api.get<AdminDashboard>('/dashboard/admin', {
    headers: authHeader(),
  });
  return data;
}
