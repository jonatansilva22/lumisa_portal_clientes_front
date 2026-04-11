import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { CartProductItem } from "../components/CartProductItem";
import { CartSummary } from "../components/CartSummary";
import { Header, SidebarClient } from "../../../shared/components/Index";
import { BackButton } from "../../../shared/ui/BackButton";
import { LoadingSpinner } from "../../../shared/ui/LoadingSpinner";
import { useProducts } from "../../products/hooks/useProducts";

export default function CartPage() {
  const { cart, loading, error, fetchCart, updateInCart, removeFromCart, clear } = useCart();
  const { products } = useProducts();

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

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarClient />
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
                      {cart.cart_details.map(item => (
                        <CartProductItem
                          key={item.id}
                          item={item}
                          onQuantityChange={(productId, quantity) => updateInCart(productId, { quantity })}
                          onRemove={removeFromCart}
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
                <CartSummary
                  subtotal={subtotal}
                  totalItems={totalItems}
                  onCheckout={() => {/* Aquí irá la lógica de checkout */}}
                  loading={loading}
                  className="self-start w-full md:w-auto mt-4 md:mt-0"
                  disabled={!!hasInactive}
                  inactiveMessage={hasInactive ? "No puedes solicitar el pedido porque hay productos no disponibles." : undefined}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
