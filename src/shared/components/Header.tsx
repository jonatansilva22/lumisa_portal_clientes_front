import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartIconWithBadge } from "../ui/CartIconWithBadge";
import { NotificationIcon } from "../ui/NotificationIcon";
import { UserName } from "../ui/UserName";
import { UserAvatar } from "../ui/UserAvatar";
import { useAuth } from "../hooks/useAuth";
import { useCart } from '../../modules/carts/hooks/useCart';
import { useNotifications } from '../../modules/notifications/hooks/useNotifications';

export function Header() {
  const { user, isAdmin, isAdviser } = useAuth();
  const { cart, fetchCart } = useCart();
  const { unreadCount, notifications, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const cartCount = cart?.cart_details?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    if (!showDropdown) {
      fetchNotifications();
      fetchUnreadCount();
    }
    setShowDropdown((prev) => !prev);
  };

  const handleNotificationClick = async (id: number, type: string, order_id?: number | null) => {
    await markAsRead(id);
    
    if (type === "chat") {
      
      if (order_id) {
        
        navigate(`/chat`, { state: { orderId: order_id, tab: 'orders' } });
      } else {
      
        navigate(`/chat`, { state: { tab: 'direct' } });
      }
    }
    else if (["order_new", "order_status", "order_advisor"].includes(type) && order_id) {
      if (isAdmin || isAdviser) navigate(`/manage/orders/${order_id}`);
      else navigate(`/orders/${order_id}`);
    }
    else if (["product_price", "product_stock", "cart_stock"].includes(type)) navigate(`/cart`);
    else if (type === "payment" && order_id) navigate(`/orders/${order_id}`);
    
    setShowDropdown(false);
  };

  return (
    <header className="w-full flex items-center justify-between bg-gradient-to-r from-blue-200 via-blue-100 to-blue-300 px-4 sm:px-10 py-0 shadow-lg h-20 border-b border-blue-200/60 backdrop-blur-md z-40">
      <div className="flex items-center h-full gap-4">
        <div className="flex flex-col leading-tight">
          <span className="text-3xl font-extrabold text-blue-900 drop-shadow tracking-tight leading-none">LUMISA</span>
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase mt-1 text-blue-800/90">
            C O M <span className="text-[#60a5fa]">E R I</span> C I A L I Z A D O R A
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6 h-full">
        {!isAdmin && <CartIconWithBadge count={cartCount} className="scale-125" />}

        <div className="relative" ref={dropdownRef}>
          <div onClick={handleBellClick} className="cursor-pointer">
            <NotificationIcon count={unreadCount} className="scale-125" />
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Notificaciones</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-orange-500 hover:underline">
                    Marcar todas como leídas
                  </button>
                )}
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-6 text-center text-gray-400 text-sm">Sin notificaciones</li>
                ) : (
                  notifications.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id, n.type, n.order_id)}
                      className={`px-4 py-3 border-b border-gray-50 text-sm cursor-pointer hover:bg-gray-50 ${
                        n.read ? "text-gray-400" : "text-gray-700 bg-orange-50"
                      }`}
                    >
                      <p>{n.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(n.created_at).toLocaleString("es-MX")}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        <UserName name={user ? `${user.name}` : "USUARIO"} className="text-xl" />
        <UserAvatar src={user?.image_url} />
      </div>
    </header>
  );
}