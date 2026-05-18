import { useState, useEffect, useRef } from "react";
import { createOrderChatSocket, sendMessage } from "../services/chats";
import type { Chat, ChatCreate, ChatSocketEvent } from "../types/chat";
import toast from "react-hot-toast";

function upsertMessage(messages: Chat[], message: Chat) {
  const nextMessages = messages.some((item) => item.id === message.id)
    ? messages.map((item) => (item.id === message.id ? message : item))
    : [...messages, message];

  return nextMessages.sort(
    (left, right) => new Date(left.sent_at).getTime() - new Date(right.sent_at).getTime()
  );
}

export function useChat(order_id: number) {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSend = async (data: ChatCreate) => {
    try {
      setSending(true);
      const socket = socketRef.current;

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            action: "send_message",
            receiver_id: data.receiver_id,
            message: data.message,
            file_url: data.file_url,
          })
        );
        return;
      }

      const createdMessage = await sendMessage(data);
      setMessages((currentMessages) => upsertMessage(currentMessages, createdMessage));
    } catch {
      toast.error("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (!order_id || order_id === 0) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let isActive = true;

    const connect = () => {
      if (!isActive) {
        return;
      }

      setLoading(true);

      try {
        const socket = createOrderChatSocket(order_id);
        socketRef.current = socket;

        socket.onmessage = (event) => {
          const payload = JSON.parse(event.data) as ChatSocketEvent;

          if (payload.type === "history") {
            setMessages(Array.isArray(payload.messages) ? payload.messages : []);
            setLoading(false);
            return;
          }

          if (payload.type === "message_created" || payload.type === "message_read") {
            setMessages((currentMessages) => upsertMessage(currentMessages, payload.message));
            setLoading(false);
            return;
          }

          if (payload.type === "error") {
            toast.error(payload.detail);
            setLoading(false);
          }
        };

        socket.onerror = () => {
          if (isActive) {
            setLoading(false);
          }
        };

        socket.onclose = () => {
          if (socketRef.current === socket) {
            socketRef.current = null;
          }

          if (!isActive) {
            return;
          }

          setLoading(false);
          reconnectTimeoutRef.current = setTimeout(connect, 2000);
        };
      } catch {
        setLoading(false);
        toast.error("No se pudo conectar al chat en tiempo real");
      }
    };

    connect();

    return () => {
      isActive = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [order_id]);

  return { messages, loading, sending, handleSend };
}