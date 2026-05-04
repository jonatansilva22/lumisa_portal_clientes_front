import { useState, useEffect } from "react";
import { notificationsService } from "../services/notifications";
import type { Notification } from "../types/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadChatCount = notifications.filter(n => n.type === "chat" && !n.read).length;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    await notificationsService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = async (id: number) => {
    await notificationsService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const fetchUnreadCount = fetchNotifications; // alias para compatibilidad

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    unreadChatCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
}