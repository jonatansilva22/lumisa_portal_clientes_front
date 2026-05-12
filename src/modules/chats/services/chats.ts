import axios from "axios";
import { useAuthStore } from "../../auth/store/auth";
import type { Chat, ChatCreate } from "../types/chat";

// Axios exclusivo para chats,usa proxy para evitar CORS
const chatApi = axios.create({
  baseURL: "/api",
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
  const res = await axios.get<User[]>("http://localhost:8000/users/", getAuthHeader());
  return res.data.filter(u => u.active);
}

// Obtener mensajes directos con un usuario
export async function getDirectMessages(userId: number): Promise<Chat[]> {
  const res = await chatApi.get<Chat[]>(`/chats/direct/${userId}`, getAuthHeader());
  return res.data;
}

// Enviar mensaje directo
export async function sendDirectMessage(receiverId: number, message: string): Promise<Chat> {
  const res = await chatApi.post<Chat>(
    "/chats/direct",
    { receiver_id: receiverId, message },
    getAuthHeader()
  );
  return res.data;
}

// Obtener mis conversaciones directas (solo usuarios con quien ya he hablado)
export async function getMyDirectConversations(): Promise<User[]> {
  const res = await chatApi.get<User[]>("/chats/direct/conversations", getAuthHeader());
  return res.data;
}