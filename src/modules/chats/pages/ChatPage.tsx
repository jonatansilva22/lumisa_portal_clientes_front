import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useAuthStore } from "../../auth/store/auth";
import { Header } from "../../../shared/components/Index";
import { SidebarAdmin } from "../../../shared/components/Index";
import { SidebarAdviser } from "../../../shared/components/Index";
import { SidebarClient } from "../../../shared/components/Index";
import { BackButton } from "../../../shared/ui/BackButton";
import { useChat } from "../hooks/useChat";
import type { Chat, ChatSocketEvent } from "../types/chat";
import type { Order } from "../../orders/types/order";
import { createDirectChatSocket, getAllActiveUsers, getChatHttpBaseUrl, sendDirectMessage, getMyDirectConversations, getS3UploadUrl, type User } from "../services/chats";

const getToken = () => useAuthStore.getState().token;

async function getAllOrdersLocal(): Promise<Order[]> {
  const res = await fetch(`${getChatHttpBaseUrl()}/orders/`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
}

async function getMyOrdersLocal(): Promise<Order[]> {
  const res = await fetch(`${getChatHttpBaseUrl()}/orders/me`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
}

function upsertMessage(messages: Chat[], message: Chat) {
  const nextMessages = messages.some((item) => item.id === message.id)
    ? messages.map((item) => (item.id === message.id ? message : item))
    : [...messages, message];

  return nextMessages.sort(
    (left, right) => new Date(left.sent_at).getTime() - new Date(right.sent_at).getTime()
  );
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(date: string) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Hoy";
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";
  return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

function getAttachmentName(fileUrl: string) {
  try {
    const pathname = new URL(fileUrl).pathname;
    const rawName = pathname.split("/").pop() ?? "Archivo adjunto";
    return decodeURIComponent(rawName);
  } catch {
    return "Archivo adjunto";
  }
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-700",
  revisado: "bg-blue-100 text-blue-700",
  autorizado: "bg-purple-100 text-purple-700",
  cancelado: "bg-gray-100 text-gray-500",
  pagado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
};

function getStatusColor(name: string) {
  return STATUS_COLORS[name?.toLowerCase()] ?? "bg-gray-100 text-gray-500";
}

const ROLE_BADGES: Record<number, { label: string; color: string }> = {
  1: { label: "Admin", color: "bg-blue-100 text-blue-700" },
  2: { label: "Asesor", color: "bg-green-100 text-green-700" },
  3: { label: "Cliente", color: "bg-yellow-100 text-yellow-700" },
};

export function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role_id === 1;

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => setFilePreview((event.target?.result as string) ?? null);
      reader.readAsDataURL(file);
      return;
    }

    setFilePreview(null);
  }, [file]);
  
  // Estado para pestañas
  const [activeTab, setActiveTab] = useState<'orders' | 'direct'>('orders');
  
  // Estado para pedidos
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  
  // Estado para usuarios (mensajes directos)
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  
  // Estado para mensajes directos
  const [directMessages, setDirectMessages] = useState<Chat[]>([]);
  const [loadingDirectMessages, setLoadingDirectMessages] = useState(false);
  const [sendingDirectMessage, setSendingDirectMessage] = useState(false);
  const directSocketRef = useRef<WebSocket | null>(null);
  const directReconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [searchConv, setSearchConv] = useState("");
  const { messages, loading, sending, handleSend } = useChat(selectedOrder ?? 0);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar pedidos
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          const data = isAdmin || user?.role_id === 2
            ? await getAllOrdersLocal()
            : await getMyOrdersLocal();
          
          const dataArray = Array.isArray(data) ? data : [];
          
          const filtered = user?.role_id === 2
            ? dataArray.filter((o) => (o as any).advisor?.id === user.id)
            : dataArray;
          
          setOrders(dataArray);
          
          if (window.innerWidth >= 768 && filtered.length > 0) {
            setSelectedOrder(filtered[0].id);
          }
        } catch {
          setOrders([]);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [isAdmin, activeTab, user?.role_id, user?.id]);

  // Cargar usuarios (admin: todos, no-admin: solo conversaciones activas)
  useEffect(() => {
    if (activeTab === 'direct') {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          let data: User[];
          
          if (isAdmin) {
            // Admin: cargar todos los usuarios activos
            data = await getAllActiveUsers();
            // Excluir al usuario actual
            const filteredUsers = data.filter(u => u.id !== user?.id);
            setUsers(filteredUsers);
            
            if (window.innerWidth >= 768 && filteredUsers.length > 0) {
              setSelectedUser(filteredUsers[0].id);
            }
          } else {
            // No-admin: cargar solo conversaciones activas
            data = await getMyDirectConversations();
            setUsers(data);
            
            if (window.innerWidth >= 768 && data.length > 0) {
              setSelectedUser(data[0].id);
            }
          }
        } catch {
          setUsers([]);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab, isAdmin, user?.id]);

  // Cargar mensajes directos cuando se selecciona un usuario
  useEffect(() => {
    if (directReconnectTimeoutRef.current) {
      clearTimeout(directReconnectTimeoutRef.current);
      directReconnectTimeoutRef.current = null;
    }

    if (directSocketRef.current) {
      directSocketRef.current.close();
      directSocketRef.current = null;
    }

    if (!selectedUser || activeTab !== 'direct') {
      setDirectMessages([]);
      setLoadingDirectMessages(false);
      return;
    }

    let isActive = true;

    const connect = () => {
      if (!isActive) {
        return;
      }

      setLoadingDirectMessages(true);

      try {
        const socket = createDirectChatSocket(selectedUser);
        directSocketRef.current = socket;

        socket.onmessage = (event) => {
          const payload = JSON.parse(event.data) as ChatSocketEvent;

          if (payload.type === 'history') {
            setDirectMessages(Array.isArray(payload.messages) ? payload.messages : []);
            setLoadingDirectMessages(false);
            return;
          }

          if (payload.type === 'message_created' || payload.type === 'message_read') {
            setDirectMessages((currentMessages) => upsertMessage(currentMessages, payload.message));
            setLoadingDirectMessages(false);
            return;
          }

          if (payload.type === 'error') {
            toast.error(payload.detail);
            setLoadingDirectMessages(false);
          }
        };

        socket.onerror = () => {
          if (isActive) {
            setLoadingDirectMessages(false);
          }
        };

        socket.onclose = () => {
          if (directSocketRef.current === socket) {
            directSocketRef.current = null;
          }

          if (!isActive) {
            return;
          }

          setLoadingDirectMessages(false);
          directReconnectTimeoutRef.current = setTimeout(connect, 2000);
        };
      } catch {
        setLoadingDirectMessages(false);
        toast.error('No se pudo conectar al chat directo en tiempo real');
      }
    };

    connect();

    return () => {
      isActive = false;

      if (directReconnectTimeoutRef.current) {
        clearTimeout(directReconnectTimeoutRef.current);
        directReconnectTimeoutRef.current = null;
      }

      if (directSocketRef.current) {
        directSocketRef.current.close();
        directSocketRef.current = null;
      }
    };
  }, [selectedUser, activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, directMessages]);

  // Leer state de navegación (notificaciones)
  useEffect(() => {
    const state = location.state as { orderId?: number; tab?: 'orders' | 'direct' } | null;
    
    if (state?.tab) {
      setActiveTab(state.tab);
    }
    
    if (state?.orderId && state.tab === 'orders') {
      setSelectedOrder(state.orderId);
    }
    
    window.history.replaceState({}, document.title);
  }, [location]);

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);
  const selectedUserData = users.find((u) => u.id === selectedUser);


  // Enviar mensaje de pedido (con archivo)
  const onSend = async () => {
    if ((!message.trim() && !file) || selectedOrder === null) return;

    const receiverId = isAdmin
      ? selectedOrderData?.client?.id
      : (selectedOrderData as any)?.advisor?.id;

    if (!receiverId) {
      toast.error("Este pedido no tiene asesor asignado aún");
      return;
    }

    let file_url: string | undefined = undefined;
    if (file) {
      setUploading(true);
      try {
        const { upload_url, object_url } = await getS3UploadUrl(file.name, file.type);
        await fetch(upload_url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        file_url = object_url;
      } catch (err) {
        toast.error("Error al subir archivo");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    await handleSend({ order_id: selectedOrder, receiver_id: receiverId, message: message.trim(), file_url });
    setMessage("");
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  // Enviar mensaje directo (con archivo)
  const onSendDirect = async () => {
    if ((!message.trim() && !file) || selectedUser === null) return;

    setSendingDirectMessage(true);
    let file_url: string | undefined = undefined;
    if (file) {
      setUploading(true);
      try {
        const { upload_url, object_url } = await getS3UploadUrl(file.name, file.type);
        await fetch(upload_url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        file_url = object_url;
      } catch (err) {
        toast.error("Error al subir archivo");
        setUploading(false);
        setSendingDirectMessage(false);
        return;
      }
      setUploading(false);
    }
    try {
      const socket = directSocketRef.current;

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            action: 'send_message',
            message: message.trim(),
            file_url,
          })
        );
      } else {
        const createdMessage = await sendDirectMessage(selectedUser, message.trim(), file_url);
        setDirectMessages((currentMessages) => upsertMessage(currentMessages, createdMessage));
      }

      setMessage("");
      setFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Error al enviar mensaje");
    } finally {
      setSendingDirectMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === 'orders') {
        onSend();
      } else {
        onSendDirect();
      }
    }
  };

  const filteredOrders = orders
    .filter((o) => {
      if (user?.role_id === 2) {
        return (o as any).advisor?.id === user.id;
      }
      return true;
    })
    .filter((o) =>
      `Pedido #${o.id} ${o.folio}`.toLowerCase().includes(searchConv.toLowerCase())
    );

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.last_name}`.toLowerCase().includes(searchConv.toLowerCase())
  );

  const showList = (activeTab === 'orders' && selectedOrder === null) || 
                   (activeTab === 'direct' && selectedUser === null);

  const currentMessages = activeTab === 'orders' ? messages : directMessages;
  const currentLoading = activeTab === 'orders' ? loading : loadingDirectMessages;
  const currentSending = activeTab === 'orders' ? sending : sendingDirectMessage;

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar según rol */}
        <div className="hidden md:block">
          {user?.role_id === 1 && <SidebarAdmin />}
          {user?.role_id === 2 && <SidebarAdviser />}
          {user?.role_id === 3 && <SidebarClient />}
        </div>
        <main className="flex-1 flex overflow-hidden">

          {/* Panel izquierdo */}
          <div className={`flex flex-col border-r border-gray-200 bg-white w-full md:w-64 lg:w-80 ${showList ? "flex" : "hidden"} md:flex`}>
            <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 mb-3">
                <BackButton onClick={() => navigate(-1)} />
                <h2 className="font-bold text-gray-800 text-lg">Mensajes</h2>
              </div>

              {/* Pestañas */}
              <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    setSelectedOrder(null);
                    setSelectedUser(null);
                  }}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition ${
                    activeTab === 'orders'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pedidos
                </button>
                <button
                  onClick={() => {
                    setActiveTab('direct');
                    setSelectedOrder(null);
                    setSelectedUser(null);
                  }}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition ${
                    activeTab === 'direct'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mensajes
                </button>
              </div>

              <div className="relative">
                <input
                  value={searchConv}
                  onChange={(e) => setSearchConv(e.target.value)}
                  placeholder={activeTab === 'orders' ? "Buscar pedido..." : "Buscar usuario..."}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 pl-9"
                />
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {activeTab === 'orders' ? (
                <>
                  {loadingOrders ? (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center mt-8">Sin pedidos</p>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusName = (order as any).status?.name ?? "";
                      return (
                        <button
                          key={order.id}
                          onClick={() => setSelectedOrder(order.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors text-left ${
                            selectedOrder === order.id ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
                          }`}
                        >
                          <div className="w-11 h-11 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
                            P
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-semibold text-gray-800 text-sm truncate">Pedido #{order.id}</p>
                              <span className="text-[10px] text-gray-400 flex-shrink-0">{order.folio}</span>
                            </div>
                            <div className="mt-0.5">
                              {statusName && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(statusName)}`}>
                                  {statusName}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </>
              ) : (
                <>
                  {loadingUsers ? (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center mt-8">Sin usuarios</p>
                  ) : (
                    filteredUsers.map((usr) => {
                      const roleBadge = ROLE_BADGES[usr.role_id] || { label: "Usuario", color: "bg-gray-100 text-gray-700" };
                      return (
                        <button
                          key={usr.id}
                          onClick={() => setSelectedUser(usr.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors text-left ${
                            selectedUser === usr.id ? "bg-blue-50 border-l-4 border-blue-600" : "border-l-4 border-transparent"
                          }`}
                        >
                          <div className="w-11 h-11 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
                            {usr.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {usr.name} {usr.last_name}
                            </p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadge.color}`}>
                              {roleBadge.label}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </>
              )}
            </div>
          </div>

          {/* Panel derecho */}
          <div className={`flex-1 flex-col ${!showList ? "flex" : "hidden"} md:flex`} style={{ background: "#f0f2f5" }}>
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (activeTab === 'orders') setSelectedOrder(null);
                    else setSelectedUser(null);
                  }}
                  className="md:hidden w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {activeTab === 'orders' ? 'P' : (selectedUserData?.name.charAt(0).toUpperCase() || 'U')}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {activeTab === 'orders' 
                      ? (selectedOrderData ? `Pedido #${selectedOrderData.id} — ${selectedOrderData.folio}` : "Selecciona un pedido")
                      : (selectedUserData ? `${selectedUserData.name} ${selectedUserData.last_name}` : "Selecciona un usuario")
                    }
                  </p>
                  {activeTab === 'orders' && (
                    <p className="text-xs text-gray-400">
                      {(selectedOrderData as any)?.status?.name ?? ""}
                    </p>
                  )}
                  {activeTab === 'direct' && selectedUserData && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_BADGES[selectedUserData.role_id]?.color}`}>
                      {ROLE_BADGES[selectedUserData.role_id]?.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-1">
              {/* Mensajes */}
              {(activeTab === 'orders' && !selectedOrder) || (activeTab === 'direct' && !selectedUser) ? (
                <div className="flex flex-col justify-center items-center h-full gap-2">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl">💬</div>
                  <p className="text-gray-500 text-sm font-medium">
                    {activeTab === 'orders' ? 'Selecciona un pedido' : 'Selecciona un usuario'}
                  </p>
                </div>
              ) : currentLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full gap-2">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl">💬</div>
                  <p className="text-gray-500 text-sm font-medium">No hay mensajes aún</p>
                  <p className="text-gray-400 text-xs">Sé el primero en escribir</p>
                </div>
              ) : (
                currentMessages.map((msg: Chat, i: number) => {
                  const isMe = msg.sender_id === user?.id;
                  const showDate = i === 0 || !isSameDay(msg.sent_at, currentMessages[i - 1].sent_at);
                  const isImage = msg.file_url && (msg.file_url.endsWith('.jpg') || msg.file_url.endsWith('.jpeg') || msg.file_url.endsWith('.png') || msg.file_url.endsWith('.gif') || msg.file_url.endsWith('.webp'));
                  const attachmentName = msg.file_url ? getAttachmentName(msg.file_url) : null;
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <span className="bg-white text-gray-500 text-xs font-medium px-3 py-1 rounded-full shadow-sm border border-gray-100 capitalize">
                            {formatDateLabel(msg.sent_at)}
                          </span>
                        </div>
                      )}
                      <div className={`flex items-end gap-2 mb-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold ${isMe ? "bg-gray-700" : "bg-blue-600"}`}>
                          {isMe ? user?.name?.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className={`flex flex-col gap-0.5 max-w-[70%] md:max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"}`}>
                          <div className={`px-4 py-2.5 text-sm shadow-sm ${isMe ? "bg-blue-600 text-white rounded-2xl rounded-br-sm" : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"}`}>
                            {msg.file_url && (
                              <div className="mb-1">
                                {isImage ? (
                                  <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                                    <img src={msg.file_url} alt="archivo" className="max-h-40 max-w-xs rounded-lg border border-gray-200 shadow-sm" />
                                  </a>
                                ) : (
                                  <a
                                    href={msg.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition hover:opacity-90 ${
                                      isMe
                                        ? "border-white/20 bg-white/15 text-white"
                                        : "border-gray-200 bg-gray-50 text-gray-800"
                                    }`}
                                  >
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isMe ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"}`}>
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7V5a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3v4h4" />
                                      </svg>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium">{attachmentName}</p>
                                      <p className={`text-xs ${isMe ? "text-blue-100" : "text-gray-500"}`}>Abrir archivo</p>
                                    </div>
                                  </a>
                                )}
                              </div>
                            )}
                            {msg.message && <p className="leading-relaxed whitespace-pre-line">{msg.message}</p>}
                          </div>
                          <div className={`flex items-center gap-1 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="text-[10px] text-gray-400">{formatTime(msg.sent_at)}</span>
                            {isMe && (
                              <span className={`text-[11px] ${msg.read ? "text-blue-500" : "text-gray-400"}`}>
                                {msg.read ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {((!isAdmin && activeTab === 'orders') || activeTab === 'direct') && (
              <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2 relative">
                {/* Adjuntar archivo */}
                {/* Icono para adjuntar archivo */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f && f.size > 10 * 1024 * 1024) {
                      toast.error("El archivo no puede ser mayor a 10MB");
                      return;
                    }
                    setFile(f || null);
                  }}
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.txt,.zip,.rar,.7z,.csv,.ppt,.pptx,.doc,.docx"
                />
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-colors ${file ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-blue-200'}`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || currentSending}
                  title="Adjuntar archivo"
                  style={{ marginRight: 4 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 10-5.656-5.657l-8.485 8.485a6 6 0 108.485 8.485l7.07-7.07" />
                  </svg>
                </button>
                {/* Preview archivo seleccionado */}
                {file && (
                  <div className="flex items-center gap-2 ml-2">
                    {filePreview && file.type.startsWith("image/") ? (
                      <img src={filePreview} alt="preview" className="w-10 h-10 object-cover rounded border border-gray-200" />
                    ) : (
                      <span className="text-xs text-gray-600 font-medium truncate max-w-[100px]">{file.name}</span>
                    )}
                    <button type="button" className="text-red-500 hover:text-red-700" onClick={() => { setFile(null); setFilePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} title="Quitar archivo">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe un mensaje..."
                  disabled={activeTab === 'orders' ? !selectedOrder : !selectedUser}
                  className="flex-1 bg-gray-100 border border-transparent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-blue-300 transition-colors disabled:opacity-50"
                  style={{ marginLeft: file ? 0 : 8 }}
                />
                <button
                  onClick={activeTab === 'orders' ? onSend : onSendDirect}
                  disabled={currentSending || uploading || (!message.trim() && !file) || (activeTab === 'orders' ? !selectedOrder : !selectedUser)}
                  className="w-10 h-10 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {uploading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  )}
                </button>
              </div>
            )}

            {isAdmin && activeTab === 'orders' && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Modo solo lectura
                  </span>
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}