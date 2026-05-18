import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { CartProductItem } from "../components/CartProductItem";
import { CartSummary } from "../components/CartSummary";
import { Header, SidebarClient, SidebarAdviser } from "../../../shared/components/Index";
import { useAuth } from '../../../shared/hooks/useAuth';
import { BackButton } from "../../../shared/ui/BackButton";
import { LoadingSpinner } from "../../../shared/ui/LoadingSpinner";

import { useProducts } from "../../products/hooks/useProducts";
import { createOrderFromCart } from "../../orders/services/orders";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function CartPage() {
  const { isAdviser } = useAuth();
  const { cart, loading, error, fetchCart, updateInCart, removeFromCart, clear } = useCart();
  const { products } = useProducts();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const subtotal = cart?.cart_details.reduce((acc, item) => acc + Number(item.unit_price) * item.quantity, 0) || 0;
  const totalItems = cart?.cart_details.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Verifica si hay productos inactivos en el carrito
  const hasInactive = cart?.cart_details.some(item => {
    const prod = products.find(p => p.id === item.product_id);
    return prod && prod.active === false;
  });

  // Lógica para solicitar pedido
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await createOrderFromCart();
      await fetchCart();
      toast.success("Pedido solicitado con exito");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Error al solicitar el pedido");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {isAdviser ? <SidebarAdviser /> : <SidebarClient />}
        <main className="flex-1 p-2 sm:p-4 md:p-8 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto px-0 sm:px-2 md:px-0">
            <div className="flex items-center mb-6">
              <BackButton onClick={() => window.history.back()} className="mr-2" />
              <h1 className="text-3xl font-bold">Carrito de compras</h1>
            </div>
            {loading ? (
              <LoadingSpinner className="my-12" />
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
                <div className="flex-1 bg-white rounded-lg shadow p-2 md:p-4 border border-gray-100 w-full max-w-full">
                  {cart?.cart_details.length ? (
                    <>
                      <div className="flex justify-end mb-2">
                        <button
                          type="button"
                          onClick={async () => {
                            if (loading || totalItems === 0) return;
                            await clear();
                            toast.success("Carrito limpiado");
                          }}
                          aria-label="Limpiar carrito"
                          className={`flex items-center gap-2 border cursor-pointer border-gray-300 bg-white text-gray-500 hover:bg-red-100 hover:text-red-700 px-3 py-1 text-sm font-medium rounded-full transition${(loading || totalItems === 0 ? ' opacity-60 cursor-not-allowed' : '')}`}
                          disabled={loading || totalItems === 0}
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span>Limpiar carrito</span>
                        </button>
                      </div>
                      {cart.cart_details.map(item => (
                        <CartProductItem
                          key={item.id}
                          item={item}
                          onQuantityChange={async (productId, quantity) => {
                            await updateInCart(productId, { quantity });
                            toast.success("Cantidad actualizada");
                          }}
                          onRemove={async (productId) => {
                            await removeFromCart(productId);
                            toast.success("Producto eliminado del carrito");
                          }}
                          className="w-full"
                        />
                      ))}
                      <div className="text-right font-bold text-lg mt-4">
                        Subtotal ({totalItems} producto{totalItems !== 1 ? 's' : ''}): <span className="text-orange-600">${subtotal.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 text-center py-12">Tu carrito está vacío</div>
                  )}
                </div>
                <div className="flex flex-col gap-2 self-start w-full md:w-auto mt-4 md:mt-0">
                  <CartSummary
                    subtotal={subtotal}
                    totalItems={totalItems}
                    onCheckout={handleCheckout}
                    loading={loading || checkoutLoading}
                    disabled={!!hasInactive || isAdviser}
                    inactiveMessage={
                      hasInactive
                        ? "No puedes solicitar el pedido porque hay productos no disponibles."
                        : isAdviser
                        ? "Los asesores no pueden solicitar pedidos, solo agregar productos al carrito."
                        : undefined
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
