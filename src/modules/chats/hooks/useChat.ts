import { useState, useEffect, useRef } from "react";
import { getMessagesByOrder, sendMessage } from "../services/chats";
import type { Chat, ChatCreate } from "../types/chat";
import toast from "react-hot-toast";

export function useChat(order_id: number) {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitialLoadRef = useRef(true);  // ✅ Bandera para carga inicial

  const fetchMessages = async (showLoading: boolean = false) => {
    // No hacer fetch si order_id no es válido
    if (!order_id || order_id === 0) {
      setMessages([]);
      setLoading(false);
      isInitialLoadRef.current = false;
      return;
    }

    // Solo mostrar loading en la primera carga
    if (showLoading) {
      setLoading(true);
    }

    try {
      const data = await getMessagesByOrder(order_id);
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      if (showLoading) {
        toast.error("Error al cargar mensajes");
      }
      setMessages([]);
    } finally {
      if (showLoading) {
        setLoading(false);
        isInitialLoadRef.current = false;
      }
    }
  };

  const handleSend = async (data: ChatCreate) => {
    try {
      setSending(true);
      await sendMessage(data);
      fetchMessages(false);  // Recargar sin loading
    } catch {
      toast.error("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    // Reset de la bandera cuando cambia el order_id
    isInitialLoadRef.current = true;
    
    // Fetch inicial con loading
    fetchMessages(true);
    
    // Solo iniciar el polling si hay un order_id válido
    if (order_id && order_id > 0) {
      intervalRef.current = setInterval(() => fetchMessages(false), 5000);  // Polling sin loading
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [order_id]);

  return { messages, loading, sending, handleSend };
}