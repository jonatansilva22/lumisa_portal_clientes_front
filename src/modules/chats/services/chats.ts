
import axios from "axios";
import { useAuthStore } from "../../auth/store/auth";
import type { Chat, ChatCreate } from "../types/chat";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getChatHttpBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_API_URL?.trim();
  return trimTrailingSlash(envBaseUrl || "/api");
};

const getChatWebSocketBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_WS_URL?.trim() || import.meta.env.VITE_API_URL?.trim();

  if (envBaseUrl) {
    if (envBaseUrl.startsWith("ws://") || envBaseUrl.startsWith("wss://")) {
      return trimTrailingSlash(envBaseUrl);
    }

    if (envBaseUrl.startsWith("http://") || envBaseUrl.startsWith("https://")) {
      return trimTrailingSlash(envBaseUrl.replace(/^http/i, "ws"));
    }

    if (envBaseUrl.startsWith("/")) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//${window.location.host}${trimTrailingSlash(envBaseUrl)}`;
    }
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api`;
};

const buildChatWebSocketUrl = (path: string) => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error("No hay token de autenticación disponible");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${getChatWebSocketBaseUrl()}${normalizedPath}`);
  url.searchParams.set("token", token);
  return url.toString();
};

export const createOrderChatSocket = (orderId: number) =>
  new WebSocket(buildChatWebSocketUrl(`/chats/ws/order/${orderId}`));

export const createDirectChatSocket = (userId: number) =>
  new WebSocket(buildChatWebSocketUrl(`/chats/ws/direct/${userId}`));

export const createUserChatEventsSocket = () =>
  new WebSocket(buildChatWebSocketUrl("/chats/ws"));

// Axios exclusivo para chats, usa proxy en desarrollo o URL configurada en producción.
const chatApi = axios.create({
  baseURL: getChatHttpBaseUrl(),
});

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

export async function getMessagesByOrder(order_id: number): Promise<Chat[]> {
  const res = await chatApi.get<Chat[]>(`/chats/order/${order_id}`, getAuthHeader());
  return res.data;
}

export async function sendMessage(data: ChatCreate): Promise<Chat> {
  const res = await chatApi.post<Chat>("/chats/", data, getAuthHeader());
  return res.data;
}

export async function markAsRead(message_id: number): Promise<Chat> {
  const res = await chatApi.patch<Chat>("/chats/read/", { message_id }, getAuthHeader());
  return res.data;
}

export async function getUnreadMessages(): Promise<Chat[]> {
  const res = await chatApi.get<Chat[]>("/chats/unread/", getAuthHeader());
  return res.data;
}

export async function getS3UploadUrl(filename: string, contentType: string): Promise<{ upload_url: string; object_url: string }> {
  const res = await chatApi.post<{ upload_url: string; object_url: string }>(
    "/chats/s3-upload-url",
    { filename, content_type: contentType },
    getAuthHeader()
  );
  return res.data;
}

//Mensajes directos

// Tipos para usuarios
export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role_id: number;
  role?: {
    id: number;
    name: string;
  };
  active: boolean;
}

// Obtener todos los usuarios activos
export async function getAllActiveUsers(): Promise<User[]> {
  const res = await chatApi.get<User[]>("/users/", getAuthHeader());
  return res.data.filter(u => u.active);
}

// Obtener mensajes directos con un usuario
export async function getDirectMessages(userId: number): Promise<Chat[]> {
  const res = await chatApi.get<Chat[]>(`/chats/direct/${userId}`, getAuthHeader());
  return res.data;
}

// Enviar mensaje directo
export async function sendDirectMessage(receiverId: number, message: string, file_url?: string): Promise<Chat> {
  const res = await chatApi.post<Chat>(
    "/chats/direct",
    { receiver_id: receiverId, message, file_url },
    getAuthHeader()
  );
  return res.data;
}

// Obtener mis conversaciones directas (solo usuarios con quien ya he hablado)
export async function getMyDirectConversations(): Promise<User[]> {
  const res = await chatApi.get<User[]>("/chats/direct/conversations", getAuthHeader());
  return res.data;
}