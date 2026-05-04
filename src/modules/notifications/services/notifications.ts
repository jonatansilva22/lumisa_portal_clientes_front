import { api } from '../../../shared/services/axios';
import type { Notification } from '../types/notification';

function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

function authHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const notificationsService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get<Notification[]>('/notifications/', {
      headers: authHeader(),
    });
    return data;
  },

  markAsRead: async (notification_id: number): Promise<void> => {
    await api.patch('/notifications/read', { notification_id }, {
      headers: authHeader(),
    });
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all', {}, {
      headers: authHeader(),
    });
  },
};