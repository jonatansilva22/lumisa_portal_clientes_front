import { useState, useEffect, useRef } from "react";
import { getMessagesByOrder, sendMessage } from "../services/chats";
import type { Chat, ChatCreate } from "../types/chat";
import toast from "react-hot-toast";

export function useChat(order_id: number) {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await getMessagesByOrder(order_id);
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Error al cargar mensajes");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (data: ChatCreate) => {
    try {
      setSending(true);
      await sendMessage(data);
      fetchMessages();
    } catch {
      toast.error("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [order_id]);

  return { messages, loading, sending, handleSend };
}