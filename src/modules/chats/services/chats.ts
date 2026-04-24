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